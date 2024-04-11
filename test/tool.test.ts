import { BaseTool } from '../src/interfaces/Tool';
class MockTool extends BaseTool {
  constructor() {
    super('MockTool', 'MockTool Description', {
      x: {
        type: 'number',
        description: 'Height of the rectangle',
        exampleValue: '1',
      },
      y: {
        type: 'number',
        description: 'Width of the rectangle',
        exampleValue: '1',
      },
    });
  }

  fn(inputs: any): string {
    if (!inputs) {
      throw new Error('No inputs provided');
    }
    const { x, y } = inputs;
    if (!x || !y) {
      throw new Error('Invalid inputs');
    }
    return (x * y).toString();
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

  it('should run the tool', () => {
    const tool = new MockTool();
    const resultSucc = tool.fn({ x: 2, y: 3 });
    expect(resultSucc).toBe('6');
    const resultFail = () => tool.fn({ x: 2 });
    expect(resultFail).toThrow('Invalid inputs');
    const resultFail2 = () => tool.fn(undefined);
    expect(resultFail2).toThrow('No inputs provided');
  });
  
});
