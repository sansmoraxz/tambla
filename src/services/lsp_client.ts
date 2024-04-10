import * as cp from 'child_process';
import * as rpc from 'vscode-jsonrpc/node';
import * as lsp from 'vscode-languageserver-protocol';



export class LanguageClient {
  private process: cp.ChildProcess;

  private connection: rpc.MessageConnection;

  constructor(command: string, args: string[]) {
    this.process = cp.spawn(command, args, {
      shell: true,
      stdio: 'pipe',
    });
    // log out the process streams
    if (this.process.stdin !== null && this.process.stdout !== null && this.process.stderr !== null) {
      this.process.stdout.on('data', (data) => {
        console.debug(`server stdout: ${data}`);
      });
      this.process.stderr.on('data', (data) => {
        console.debug(`server stderr: ${data}`);
      });
      this.connection = rpc.createMessageConnection(
        new rpc.StreamMessageReader(this.process.stdout),
        new rpc.StreamMessageWriter(this.process.stdin),
      );

      // log messages
      this.connection.onNotification((notification) => {
        console.debug('notification', notification);
      });
      this.connection.onRequest((request) => {
        console.debug('request', request);
      });
      this.connection.onError((error) => {
        console.debug('error', error);
      });

      this.connection.listen();
    } else {
      throw new Error('Failed to create connection to language server');
    }
  }

  public async initialize(
    params: lsp.InitializeParams,
  ): Promise<lsp.InitializeResult> {
    return this.connection.sendRequest<lsp.InitializeResult>(
      lsp.InitializeRequest.type.method,
      params,
    );
  }

  public async initialized(): Promise<void> {
    await this.connection.sendNotification(lsp.InitializedNotification.type, {});
  }

  public async hover(params: lsp.HoverParams): Promise<lsp.Hover> {
    return this.connection.sendRequest<lsp.Hover>(
      lsp.HoverRequest.type.method,
      params,
    );
  }

  public async listWorkspaceSymbols(
    params: lsp.WorkspaceSymbolParams,
  ): Promise<lsp.SymbolInformation[] | lsp.WorkspaceSymbol[] | null> {
    return this.connection.sendRequest<
    lsp.SymbolInformation[] | lsp.WorkspaceSymbol[] | null
    >(lsp.WorkspaceSymbolRequest.type.method, params);
  }

  public async listDocumentSymbols(
    params: lsp.DocumentSymbolParams,
  ): Promise<lsp.DocumentSymbol[] | null> {
    return this.connection.sendRequest<lsp.DocumentSymbol[] | null>(
      lsp.DocumentSymbolRequest.type.method,
      params,
    );
  }

  public async openFile(params: lsp.DidOpenTextDocumentParams): Promise<void> {
    return this.connection.sendNotification(
      lsp.DidOpenTextDocumentNotification.type,
      params,
    );
  }

  public async closeFile(params: lsp.DidCloseTextDocumentParams): Promise<void> {
    return this.connection.sendNotification(
      lsp.DidCloseTextDocumentNotification.type,
      params,
    );
  }

  public async shutdown(): Promise<boolean> {
    await this.connection.sendRequest(lsp.ShutdownRequest.type.method, {});
    this.connection.dispose();
    return this.process.kill();
  }

}
