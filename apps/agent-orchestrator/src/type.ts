import {GoogleGenAI, type FunctionDeclaration,Type} from '@google/genai';

export const writeFileDeclaration:FunctionDeclaration = {
    name:"wrtieFile",
    description:"Write content to a file at the givern path",
    parametersJsonSchema:{
        type:"object",
        properties:{
            filePath:{type:"string"},
            content:{type:"string"},
        },
        required:["filepath","content"]
    },
};

export const readFileDeclaration = {
  name: 'readFile',
  description: 'Read the contents of a file in the project.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: { type: Type.STRING, description: 'Path relative to the project root.' },
    },
    required: ['path'],
  },
};

export const runCommandDeclaration = {
  name: 'runCommand',
  description: 'Run a shell command in the project directory (e.g. npm install, npm run build).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: { type: Type.STRING, description: 'The shell command to run.' },
      timeoutMs: { type: Type.NUMBER, description: 'Optional timeout in milliseconds.' },
    },
    required: ['command'],
  },
};

