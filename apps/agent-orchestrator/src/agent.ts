import { GoogleGenAI, Type, type Content, type Part } from '@google/genai';
import type { Sandbox } from '@e2b/code-interpreter';
import { readFileDeclaration, runCommandDeclaration, writeFileDeclaration } from './type.js';
import { writeFileTool, readFileTool, runCommandTool } from './tools.js';

const ai = new GoogleGenAI({
  vertexai: true,
  location: 'asia-south1',
  project: 'project-98fab1fa-ee54-4a35-b60',
});

;

const tools = [
  { functionDeclarations: [writeFileDeclaration, readFileDeclaration, runCommandDeclaration] },
];

const SYSTEM_INSTRUCTION = `You are a coding agent that builds web projects inside a sandboxed
project directory. Use the writeFile, readFile, and runCommand tools to inspect, create, and
run the project. Work step by step: write files, then run commands (e.g. install deps, build,
or start the dev server) to verify things work. When the task is complete, respond with a final
plain-text summary and do not call any more tools.`;

const MAX_TURNS = 5;

export interface AgentResult {
  done: boolean;
  text: string;
  history: Content[];
}

export async function runAgent(sandbox: Sandbox, prompt: string): Promise<AgentResult> {
  const history: Content[] = [{ role: 'user', parts: [{ text: prompt }] }];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: { tools, systemInstruction: SYSTEM_INSTRUCTION },
    });

    const candidate = response.candidates?.[0];
    const parts: Part[] = candidate?.content?.parts ?? [];

    if (parts.length === 0) {
      return { done: false, text: 'Model returned an empty response.', history };
    }

    history.push({ role: 'model', parts });

    const functionCallParts = parts.filter((p) => !!p.functionCall);

    if (functionCallParts.length === 0) {
      const text = parts.map((p) => p.text ?? '').join('');
      return { done: true, text, history };
    }

    const functionResponseParts: Part[] = [];
    for (const part of functionCallParts) {
      const name = part.functionCall!.name!;
      const args = (part.functionCall!.args ?? {}) as Record<string, unknown>;

      let result: unknown;
      try {
        result = await executeTool(sandbox, name, args);
      } catch (error) {
        result = {
          success: false,
          error: error instanceof Error ? error.message : `Tool "${name}" threw an unknown error`,
        };
      }

      functionResponseParts.push({
        functionResponse: { name, response: result as Record<string, unknown> },
      });
    }

    history.push({ role: 'user', parts: functionResponseParts });
  }

  return { done: false, text: `Stopped after ${MAX_TURNS} turns without a final answer.`, history };
}

async function executeTool(sandbox: Sandbox, name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'writeFile':
      return writeFileTool(sandbox, args.path as string, args.content as string);
    case 'readFile':
      return readFileTool(sandbox, args.path as string);
    case 'runCommand':
      return runCommandTool(sandbox, args.command as string, {
        ...(args.timeoutMs !== undefined ? { timeoutMs: args.timeoutMs as number } : {}),
      });
    default:
      return { success: false, error: `Unknown tool: ${name}` };
  }
}