import ChatPanel from "@/components/workspace/chat-panel/chat-panel";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params
  return (
    <div className="flex h-screen w-full">
      <ChatPanel projectId={projectId} />
    </div>
  )
}