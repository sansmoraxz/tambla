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
    if (this.process.stdin !== null && this.process.stdout !== null) {
      this.connection = rpc.createMessageConnection(
        new rpc.StreamMessageReader(this.process.stdout),
        new rpc.StreamMessageWriter(this.process.stdin),
      );
      this.connection.listen();
    } else {
      throw new Error('Failed to create connection');
    }

  }

  public async initialize(req: lsp.InitializeParams): Promise<lsp.InitializeResult> {
    return this.connection.sendRequest<lsp.InitializeResult>(
      lsp.InitializeRequest.type.method,
      req);
  }

  public async hover(req: lsp.HoverParams): Promise<lsp.Hover> {
    return this.connection.sendRequest<lsp.Hover>(
      lsp.HoverRequest.type.method,
      req);
  }

  destroy() {
    this.process.kill();
  }
}
