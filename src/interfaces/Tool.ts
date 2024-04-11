import { XMLBuilder } from 'fast-xml-parser';
export interface ToolInputSchema {
  [key: string]: {
    type: string;
    description: string;
    exampleValue: string;
  };
}

export interface Tool {
  name: string;
  description: string;
  schema: ToolInputSchema;

  fn(inputs: any): string;

  getInputPrompt(): string;
}

export abstract class BaseTool implements Tool {
  name: string;

  description: string;

  schema: ToolInputSchema;

  constructor(name: string, description: string, schema: ToolInputSchema) {
    this.name = name;
    this.description = description;
    this.schema = schema;
  }

  abstract fn(inputs: any): string;

  getInputPrompt(): string {
    let xmlD = new XMLBuilder().build({
      action: {
        name: this.name,
        description: this.description,
        inputs: this.schema,
      },
    });
    return xmlD;
  }
}
