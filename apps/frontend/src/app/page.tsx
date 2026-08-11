"use client";

import { useState } from "react";

export default function WorkspacePage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([
    { role: "agent", text: "Bzzzt! I am your AntColony worker. What frontend should we build today?" }
  ]);
  const [generatedCode, setGeneratedCode] = useState<string>(
    `// Initial Blank Canvas\nexport default function App() {\n  return <div className="p-8 text-center text-gray-500">Your generated app will live here...</div>\n}`
  );

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // 1. Add user message to chat UI
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    const currentPrompt = prompt;
    setPrompt("");

    // TODO: We will replace this with a real backend event stream in the next step
    setMessages((prev) => [...prev, { role: "agent", text: "Working on it..." }]);
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* LEFT COLUMN: The Control Center & Chat */}
      <div className="w-1/3 border-r border-zinc-800 flex flex-col justify-between h-full bg-zinc-900/50">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-xl font-bold tracking-tight text-amber-500">🐜 AntColony Workspace</h1>
        </div>

        {/* Chat Stream History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[85%] text-sm ${
                msg.role === "user"
                  ? "bg-amber-600 text-white ml-auto"
                  : "bg-zinc-800 text-zinc-200"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSendPrompt} className="p-4 border-t border-zinc-800 bg-zinc-900">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Build a glassmorphic dashboard header with smooth hover states..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-zinc-100 placeholder-zinc-500"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Build
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: The Interactive Live Preview Canvas */}
      <div className="w-2/3 h-full flex flex-col bg-zinc-950">
        <div className="p-3 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
          <span className="text-xs font-mono text-zinc-400">⚡ Live Sandboxed Canvas</span>
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
        </div>
        
        {/* Visual Preview Window */}
        <div className="flex-1 p-6 flex items-center justify-center bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="w-full h-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col justify-center items-center">
             {/* Raw Code View Placeholder until we add sandboxed runtime component */}
             <pre className="text-xs font-mono text-emerald-400 p-4 w-full h-full overflow-auto bg-zinc-950">
               {generatedCode}
             </pre>
          </div>
        </div>
      </div>
    </div>
  );
}