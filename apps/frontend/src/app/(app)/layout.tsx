import {notFound} from "next/navigation";


interface ProjectPageProps{
    params:{
        projectId:string
    }
}

async function getProject(projectId:string){
    const res =await fetch(`${process.env.API_URL}/project/${projectId}`,{
        cache:"no-store"
    })
    if(!res.ok) return null
    return res.json()
}


export default async function ProjectPage({params}:ProjectPageProps){
    const {projectId} = params
    const project = await getProject(projectId)

    if(!project){
        notFound()
    }

    return(
        <div className="flex h-screen w-full">
            
        </div>
    )
}