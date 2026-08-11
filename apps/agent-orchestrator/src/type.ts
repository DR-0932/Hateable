import {GoogleGenAI, type FunctionDeclaration} from '@google/genai';



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


export const readFileDeclaration:FunctionDeclaration = {
    name:"readFile",
    description:"Read the content of a file at the given path",
    parametersJsonSchema:{
        type:"object",
        properties:{
            filePath:{type:"string"}
        },
        required:["filePath"],
    },
};

export const runCommandDeclaration:FunctionDeclaration={
    name:"runCommand",
    description:"Run a shell command in the project directory",
    parametersJsonSchema:{
        type:"object",
        properties:{
            command:{type:"string"},
        },
        required:["command"],
    },
};

