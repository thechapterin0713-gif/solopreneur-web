"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { stripJsonBlock } from "@/lib/ai/parse-response";

interface ChatContainerProps {
  projectId: string;
  initialMessages?: Array<{ id: string; role: "user" | "assistant"; content: string }>;
  onPhaseUpdate?: () => void;
}

export function ChatContainer({ projectId, initialMessages = [], onPhaseUpdate }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new TextStreamChatTransport({ api: "/api/chat", body: { projectId } }),
    [projectId]
  );

  const { messages, sendMessage, status } = useChat({
    id: projectId,
    transport,
    messages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      parts: [{ type: "text" as const, text: m.content }],
    })),
    onFinish: () => {
      onPhaseUpdate?.();
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            새 프로젝트를 시작합니다. 잠시만 기다려주세요...
          </div>
        )}
        {messages.map((msg) => {
          const textContent = msg.parts
            ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join("") || "";
          return (
            <ChatMessage
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={stripJsonBlock(textContent)}
            />
          );
        })}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
              AI
            </div>
            <div className="bg-muted rounded-lg px-4 py-3 text-sm">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
              </span>
            </div>
          </div>
        )}
      </div>
      <ChatInput
        input={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
