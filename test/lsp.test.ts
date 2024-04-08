import * as url from 'url';
import { LanguageClient } from '../src/services/lsp_client';

function prettyPrint(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

describe('LSP test typescript current project', () => {
  let client: LanguageClient;

  // initialize the language server with the current project
  beforeAll(async () => {
    const command = 'typescript-language-server';
    const args = ['--stdio'];
    client = new LanguageClient(command, args);
    console.log('language server started');

    const rootPath = process.cwd();

    console.log('rootPathUri', url.pathToFileURL(rootPath).href);

    // initialize the client
    const initResult = await client.initialize({
      processId: process.pid,
      workspaceFolders: [
        {
          // current project root absolute path file uri
          uri: url.pathToFileURL(rootPath).href,
          name: 'tambla',
        },
      ],
      capabilities: {
        textDocument: {
          documentSymbol: {
            dynamicRegistration: true,
            hierarchicalDocumentSymbolSupport: true,
            symbolKind: {
              valueSet: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
              ],
            },
          },
        },
      },
      initializationOptions: {
        tsserver: {
          logVerbosity: 'verbose',
        },
      },
      rootUri: null,
    });
    console.log('initResult', prettyPrint(initResult));
    await client.initialized();
    console.log('project initialized');
  });

  test('ls Workspace Symbols', async () => {
    const lsSymbols = await client.listWorkspaceSymbols({
      query: '',
    });

    console.log('lsSymbolsWS', prettyPrint(lsSymbols));
  });

  test('ls Document Symbols', async () => {
    const docPath = 'src/services/lsp_client.ts';
    const lsSymbols = await client.listDocumentSymbols({
      textDocument: {
        uri: docPath,
      },
    });

    console.log('lsSymbolsDC', prettyPrint(lsSymbols));
  });

  // close the language server
  afterAll(async () => {
    await client.shutdown();
    console.log('client destroyed');
  });
});
