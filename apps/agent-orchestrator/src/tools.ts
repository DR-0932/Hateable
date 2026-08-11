import type {Sandbox} from "@e2b/code-interpreter";

export const PROJECT_ROOT = "/home/user/project";

const DEFAULT_COMMAND_TIMNEOUT = 60_000;

export interface ToolResult<T=unknown>{
    success: boolean;
    error?:string;
    data?:T;
}

export interface WriteFileResult{
    path:string;
    bytesWritten:number;

}


export interface ReadFileResult{
    path:string;
    content:string;
}

export interface RunCommandResult{
    command:string;
    stdout:string;
    stderr:string;
    exitCode:number;
}

function resolveProjectPath( relativePath:string ):string {
    
    const normalized = relativePath.replace( /^\/+/,"" );
    const fullPath = `${PROJECT_ROOT}/${normalized}`

    const collapsed = fullPath.split( "/" ).reduce< string[] >(( parts,segment )=>{
        
        if( segment ==="" || segment ==="." ) return parts;
        
        if(segment ===".."){
            parts.pop();
            return parts;
        }
        
        parts.push(segment);
        return parts;
    
    },[]);

    const resolved = "/"+ collapsed.join("/");

    if( !resolved ){
        throw new Error(`Path "${relativePath}" resolves outside the project directory`)
    }

    return resolved;
}


export async function writeFileTool(
  sandbox: Sandbox,
  filePath: string,
  content: string
): Promise<ToolResult<WriteFileResult>> {
  try {
    const fullPath = resolveProjectPath(filePath);
    await sandbox.files.write(fullPath, content);
 
    return {
      success: true,
      data: { path: filePath, bytesWritten: Buffer.byteLength(content, "utf-8") },
    };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function readFIleTool(
    sandbox:Sandbox,
    filePath:string
):Promise<ToolResult<ReadFileResult>>{
    try{
        const fullPath = resolveProjectPath(filePath);
        const content = await sandbox.files.read(fullPath);

        return {success:true,data:{path:filePath,content}};
    }catch(error){
        return{
            success:false,error:`File not found or unreadable:${filePath}`
        }
    }
}

export async function RunCommandTool(
    sandbox:SandBox,
    command:string,
    options?:{timeoutMs?: number; background?:boolean}:Promise<ToolResult<RunCommandResult>>{
        
    }
) {
    
}