import type {NextFunction, Request,Response} from "express";
import { enqueuJob,getJob } from "../jobQueue.js";
import { agentInputSchema } from "@antcolony/zod";

export async function submitAgentTask(req:Request,res:Response):Promise<void>{
    const parsed = agentInputSchema.safeParse(req.body);
    if(!parsed.success){
        res.status(400).json({error:"invalid data"});
        return;
    }

    const userId = req.user!.id;

    const jobId = enqueuJob(userId,async ()=>{
        throw new Error("not implemented");
    });

    res.status(202).json({jobId});
}

export function getAgentTaskStatus(req:Request,res:Response):void{
    const {jobId} = req.params;

    if(!jobId || typeof jobId !=="string"){
        res.status(400).json({error:"invalid job id"});
        return;
    }

    const job = getJob(jobId);

    if(!job){
        res.status(404).json({error:"job not found"});
        return;
    }

    if(job.userId !== req.user!.id){
        res.status(403).json({error:"forbidden"});
        return;
    }

    res.status(200).json({
        status:job.status,
        result:job.result,
        error:job.error,
    });
}