"use client";

import { useState } from "react";
import { streamMessage } from "./actions";

const ClaudeChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setChatHistory((prev) => [...prev, `You: ${input}`]);
    setInput("");

    try {
      const response = await streamMessage(input);

      setChatHistory((prev) => [...prev.slice(0, -1), `Claude: ${response}`]);
    } catch (error: unknown) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        `Error: ${(error as Error)?.message ?? "Unable to get response"}`,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-grow overflow-auto p-4">
        {chatHistory.map((message, index) => (
          <p key={index} className="mb-2">
            {message}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border-2 p-2 rounded"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ClaudeChat;
