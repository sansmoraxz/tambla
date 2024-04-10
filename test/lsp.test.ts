import * as url from 'url';
import * as fs from 'fs';
import { LanguageClient } from '../src/services/lsp_client';

function prettyPrint(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

const DEFAULT_TEST_CLIENT_INITIALIZATION_OPTIONS =
  {
    hostInfo: 'vscode',
    plugins: [],
    preferences: {
      allowIncompleteCompletions: true,
      allowRenameOfImportPath: true,
      allowTextChangesInNewFiles: true,
      displayPartsForJSDoc: true,
      generateReturnInDocTemplate: true,
      includeAutomaticOptionalChainCompletions: true,
      includeCompletionsForImportStatements: true,
      includeCompletionsForModuleExports: true,
      includeCompletionsWithClassMemberSnippets: true,
      includeCompletionsWithInsertText: true,
      includeCompletionsWithSnippetText: true,
      jsxAttributeCompletionStyle: 'auto',
      providePrefixAndSuffixTextForRename: true,
    },
    tsserver: {
      // With default `auto`, due to dynamic routing, some requests would be routed to syntax server while the project
      // is loading and return incomplete results so force just a single server for tests.
      useSyntaxServer: 'never',
    },
  };


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
            hierarchicalDocumentSymbolSupport: true,
          },
        },
      },
      initializationOptions: DEFAULT_TEST_CLIENT_INITIALIZATION_OPTIONS,
      rootUri: null,
    });
    console.log('initResult', prettyPrint(initResult));
    await client.initialized();
    console.log('project initialized');
  });

  test('ls Workspace Symbols', async () => {
    const docPath = 'src/services/lsp_client.ts';
    const contents = fs.readFileSync(docPath, 'utf-8');
    const uri = url.pathToFileURL(docPath).href;
    await client.openFile({
      textDocument: {
        uri,
        languageId: 'typescript',
        version: 1,
        text: contents,
      },
    });
    const lsSymbols = await client.listWorkspaceSymbols({
      query: '',
    });

    console.log('lsSymbolsWS', prettyPrint(lsSymbols));
  });

  test('ls Document Symbols', async () => {
    const docPath = 'src/services/lsp_client.ts';
    const contents = fs.readFileSync(docPath, 'utf-8');
    const uri = url.pathToFileURL(docPath).href;
    await client.openFile({
      textDocument: {
        uri,
        languageId: 'typescript',
        version: 1,
        text: contents,
      },
    });
    const lsSymbols = await client.listDocumentSymbols({
      textDocument: {
        uri,
      },
    });
    await client.closeFile({
      textDocument: {
        uri,
      },
    });

    console.log('lsSymbolsDC', prettyPrint(lsSymbols));
  });

  test('hover', async () => {
    const docPath = 'src/index.ts';
    const contents = fs.readFileSync(docPath, 'utf-8');
    const uri = url.pathToFileURL(docPath).href;
    console.log('uri', uri);
    await client.openFile({
      textDocument: {
        uri,
        languageId: 'typescript',
        version: 1,
        text: contents,
      },
    });
    const hover = await client.hover({
      textDocument: {
        uri,
      },
      position: {
        line: 3,
        character: 7,
      },
    });
    await client.closeFile({
      textDocument: {
        uri,
      },
    });

    console.log('hover', prettyPrint(hover));
  });

  // close the language server
  afterAll(async () => {
    await client.shutdown();
    console.log('client destroyed');
  });
});
