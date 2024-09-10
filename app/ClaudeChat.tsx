"use client";

import { useState } from "react";
import { streamMessage } from "./actions";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const ClaudeChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = `You: ${input}`;
    setChatHistory((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await streamMessage(input);
      setChatHistory((prev) => [...prev, `Claude: ${response}`]);
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
          <div key={index} className="mb-2">
            {message.startsWith("You: ") ? (
              <>
                <h3 className="font-bold text-lg">You:</h3>
                <p>{message.replace("You: ", "")}</p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg">Claude:</h3>
                <ReactMarkdown
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          // @ts-expect-error what is this?
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.replace("Claude: ", "")}
                </ReactMarkdown>
              </>
            )}
          </div>
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
