import {Sandbox}  from "@e2b/code-interpreter";

const sandboxes = new Map<string,Sandbox>();

export async function getSandbox(sandboxId?:string){
    if(sandboxId && sandboxes.has(sandboxId)){
        return sandboxes.get(sandboxId)
    } 
    const sandbox = sandboxId 
    ? await Sandbox.connect(sandboxId)
    : await Sandbox.create({timeoutMs:15*60*1000});

    sandboxes.set(sandbox.sandboxId,sandbox);
    return sandbox;
}

