import PQueue from "p-queue";
import {randomUUID} from "crypto";

type JobStatus = "queued" | "running" | "completed" | "failed";

interface Job<T = unknown> {
    id:string;
    userId:string;
    status:JobStatus;
    result?:T;
    error?:string;
    createdAt:number;
    updatedAt:number;
}

const jobs = new Map<string,Job>();


const sandboxQueue = new PQueue({concurrency:3});


export function getJob(jobId:string):Job | undefined{
    return jobs.get(jobId);
}

export function enqueuJob<T>(userId:string,task:()=>Promise<T>):string{
    const jobId =randomUUID();
    const now = Date.now();

    const job:Job<T> ={
        id:jobId,
        userId,
        status:"queued",
        createdAt:now,
        updatedAt:now,
    };
    jobs.set(jobId,job);

    sandboxQueue.add(async ()=>{
        job.status = "completed";
        job.updatedAt =Date.now();

        try{
            const result = await task();
            job.status = "completed";
            job.result = result;
        }catch(err){
            job.status = "failed";
            job.error = err instanceof Error ? err.message : "unknown error";
            console.error(`Job ${jobId} failed:`,err);
        }finally{
            job.updatedAt = Date.now();
        }
    });

    return jobId;
}


export function queueStats(){
    return {
        pending:sandboxQueue.pending,
        size: sandboxQueue.size
    }
}