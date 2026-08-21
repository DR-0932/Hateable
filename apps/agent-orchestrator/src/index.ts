import type {AgentInput} from "@antcolony/zod"
import { closeSandboxSession, createSandboxSession } from "./sandbox.js"
import { runAgent } from "./agent.js";


export async function runAgentTask(input:AgentInput){
    const sandbox = await createSandboxSession();
    try{
        return await runAgent(sandbox,input.prompt);
    }catch(err){
        throw new Error("error");
    }finally{
        await closeSandboxSession(sandbox)
    }
}