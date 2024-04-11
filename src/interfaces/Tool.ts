import { XMLBuilder } from 'fast-xml-parser';
export interface ToolInputSchema {
  [key: string]: {
    type: string;
    description: string;
    exampleValue: string;
  };
}

export interface Tool<T> {
  name: string;
  description: string;
  schema: ToolInputSchema;

  fn<R>(inputs: T): R;

  getInputPrompt(): string;
}

export abstract class BaseTool<T> implements Tool<T> {
  name: string;

  description: string;

  schema: ToolInputSchema;

  constructor(name: string, description: string, schema: ToolInputSchema) {
    this.name = name;
    this.description = description;
    this.schema = schema;
  }

  abstract fn<R>(inputs: T): R;

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
