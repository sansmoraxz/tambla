import * as url from 'url';
import { LanguageClient } from '../src/services/lsp_client';

describe('LSP test typescript current project', () => {
  let client: LanguageClient;

  // initialize the language server with the current project
  beforeAll(async () => {
    const command = 'typescript-language-server';
    const args = ['--stdio'];
    client = new LanguageClient(command, args);
    console.log('language server started');

    const rootPath = process.cwd();

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
      capabilities: {},
      initializationOptions: {
        tsserver: {
          logVerbosity: 'verbose',
        },
      },
      rootUri: null,
    });
    console.log('initResult', JSON.stringify(initResult));
    await client.initialized();
    console.log('project initialized');
  });

  test('lsSymbols', async () => {
    const lsSymbols = await client.listSymbols({
      query: '',
    });

    console.log('lsSymbols', JSON.stringify(lsSymbols));
  });

  // close the language server
  afterAll(async () => {
    await client.shutdown();
    console.log('client destroyed');
  });
});
