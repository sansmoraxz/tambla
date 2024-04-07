import * as path from 'path';
import * as lsclient from 'vscode-languageclient/node';

export function createClient(
  id: string,
  selector: lsclient.DocumentSelector | undefined,
): lsclient.LanguageClient {
  // tsserver
  const serverModule = path.join(
    __dirname,
    '..',
    '..',
    'node_modules',
    'typescript',
    'lib',
    'tsserver.js',
  );
  const serverOptions: lsclient.ServerOptions = {
    run: { module: serverModule, transport: lsclient.TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: lsclient.TransportKind.ipc,
      options: { execArgv: ['--nolazy', '--inspect=6014'] },
    },
  };

  const clientOptions: lsclient.LanguageClientOptions = {
    documentSelector: selector,
    synchronize: {},
    initializationOptions: {},
    middleware: {},
  };
  (clientOptions as { $testMode?: boolean }).$testMode = true;

  const result = new lsclient.LanguageClient(
    id,
    'Language Server',
    serverOptions,
    clientOptions,
  );
  result.registerProposedFeatures();
  return result;
}
