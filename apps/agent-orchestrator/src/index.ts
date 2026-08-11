import {GoogleGenAI, type FunctionDeclaration} from '@google/genai';
import { writeFileDeclaration } from './type.js';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
    vertexai:true,
    location:'asia-south1',
    project:'project-98fab1fa-ee54-4a35-b60'    
});



const tools = [
    {functionDeclaration:[writeFileDeclaration,]}
]

export async function runAgent(prompt:string) {
    const history: any[] = [
        {role:"user", parts:[{text:prompt}]}
    ];
  
    for(let i = 0; i<5; i++){
        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:history,
            config:{tools,systemInstruction:SYSTEM_INSTRUCTION},
        });
    }


}

