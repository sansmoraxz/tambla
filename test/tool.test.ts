import { BaseTool } from '../src/interfaces/Tool';
class MockTool<T> extends BaseTool<T> {
  constructor() {
    super('MockTool', 'MockTool Description', {
      'x': {
        'type': 'number',
        'description': 'Height of the rectangle',
        'exampleValue': '1',
      },
      'y': {
        'type': 'number',
        'description': 'Width of the rectangle',
        'exampleValue': '1',
      },
    });

  }

  fn<R>(): R {
    return '' as R;
  }
}

describe('Tool', () => {
  it('should create a tool', () => {
    const tool = new MockTool();
    expect(tool.name).toBe('MockTool');
    expect(tool.description).toBe('MockTool Description');
  });

  it('should generate an input prompt', () => {
    const tool = new MockTool();
    let xmlD = tool.getInputPrompt();
    console.log(xmlD);
  });
});
