"use client"

import { useState } from "react"
import ChatMessage from "./chat-message"
import ChatInput from "./chat-input"

interface Message {
  role: "user" | "agent"
  content: string
  status?: "running" | "done" | "error"
}

interface ChatPanelProps {
  projectId: string
}

export default function ChatPanel({ projectId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isRunning, setIsRunning] = useState(false)

  async function handleSend(prompt: string) {
    setMessages((prev) => [...prev, { role: "user", content: prompt }])
    setMessages((prev) => [...prev, { role: "agent", content: "", status: "running" }])
    setIsRunning(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, prompt }),
      })
      const { jobId } = await res.json()

      pollStatus(jobId)
    } catch {
      updateLastAgentMessage("", "error")
      setIsRunning(false)
    }
  }

  function pollStatus(jobId: string) {
    const interval = setInterval(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent/status/${jobId}`)
      const data = await res.json()

      if (data.status === "done") {
        clearInterval(interval)
        updateLastAgentMessage(data.result ?? "Done.", "done")
        setIsRunning(false)
      } else if (data.status === "error") {
        clearInterval(interval)
        updateLastAgentMessage("", "error")
        setIsRunning(false)
      }
    }, 1500)
  }

  function updateLastAgentMessage(content: string, status: Message["status"]) {
    setMessages((prev) => {
      const updated = [...prev]
      updated[updated.length - 1] = { role: "agent", content, status }
      return updated
    })
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} status={msg.status} />
        ))}
      </div>
      <ChatInput onSend={handleSend} disabled={isRunning} />
    </div>
  )
}