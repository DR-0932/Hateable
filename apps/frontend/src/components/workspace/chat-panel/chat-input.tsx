interface ChatMessageProps {
  role: "user" | "agent"
  content: string
  status?: "running" | "done" | "error"
}

export default function ChatMessage({ role, content, status }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-100"
        }`}
      >
        {status === "running" ? (
          <span className="animate-pulse text-gray-400">Thinking…</span>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
        {status === "error" && (
          <p className="mt-1 text-xs text-red-400">Something went wrong.</p>
        )}
      </div>
    </div>
  )
}