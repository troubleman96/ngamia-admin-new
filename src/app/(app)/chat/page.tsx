"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Send, Sparkles, User, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useModels, type CatalogModel } from "@/lib/api/hooks/models";
import { getAccessToken } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  timestamp: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function MessageBubble({
  message,
  streaming,
}: {
  message: ChatMessage;
  streaming?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "border bg-secondary"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[80%] space-y-2 rounded-2xl border px-4 py-2.5 text-sm",
          isUser
            ? "rounded-tr-sm border-primary/20 bg-primary/5"
            : "rounded-tl-sm border bg-card"
        )}
      >
        {message.model && (
          <p className="text-[11px] font-medium text-muted-foreground">{message.model}</p>
        )}
        <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-secondary prose-code:text-[12px]">
          {message.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            streaming && <span className="inline-flex gap-1"><Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /></span>
          )}
        </div>
      </div>
    </div>
  );
}

function ModelSelector({
  selected,
  onSelect,
  models,
}: {
  selected: string | null;
  onSelect: (model: string) => void;
  models?: CatalogModel[];
}) {
  const activeModel = models?.find((m) => m.model === selected);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 text-xs font-medium" />}>
      <Sparkles className="h-3.5 w-3.5 text-primary" />
      {activeModel?.display_name ?? "Select model"}
    </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-72 overflow-y-auto">
        <DropdownMenuLabel>Models</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {models?.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onSelect(model.model)}
            className="flex flex-col items-start"
          >
            <span className="text-[13px] font-medium">{model.display_name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{model.model}</span>
            <span className="text-[10px] text-muted-foreground">
              {model.context_window.toLocaleString()} ctx ·{" "}
              {Number(model.input_price_per_1k_credits).toFixed(2)} in /{" "}
              {Number(model.output_price_per_1k_credits).toFixed(2)} out per 1k tokens
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const SYSTEM_PROMPT = "You are Ngamia, a helpful AI assistant.";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { data: models } = useModels();
  const textModels = useMemo(
    () => models?.filter((m) => m.output_modalities.includes("text")) ?? [],
    [models]
  );
  const effectiveModel = selectedModel ?? textModels[0]?.model ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming || !effectiveModel) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      model: effectiveModel,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setError(null);
    setStreaming(true);

    const history = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content,
    }));
    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
    ];

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          model: effectiveModel,
          messages: apiMessages,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let errorMsg = `Request failed with status ${res.status}`;
        try {
          const body = await res.json();
          if (body.error?.message) errorMsg = body.error.message;
          if (body.message) errorMsg = body.message;
        } catch {
          /* ignore */
        }
        throw new Error(errorMsg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Stream not supported");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);

          if (payload === "[DONE]") continue;

          try {
            const chunk = JSON.parse(payload);
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: m.content + delta }
                    : m
                )
              );
            }
          } catch {
            /* ignore malformed chunk */
          }
        }
      }

      // final [DONE] processing
      buffer = buffer.trim();
      if (buffer.startsWith("data: ") && buffer !== "data: [DONE]") {
        try {
          const payload = buffer.slice(6);
          if (payload !== "[DONE]") {
            const chunk = JSON.parse(payload);
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: m.content + delta }
                    : m
                )
              );
            }
          }
        } catch {
          /* ignore */
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id && !m.content
              ? { ...m, content: "" }
              : m
          )
        );
      } else {
        setError(err instanceof Error ? err.message : "Failed to send message");
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming, effectiveModel, messages]);

  const stopStreaming = () => {
    abortRef.current?.abort();
  };

  const resetChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Chat</h1>
          <p className="text-sm text-muted-foreground">
            Test models from the Ngamia gateway.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector
            selected={effectiveModel}
            onSelect={setSelectedModel}
            models={textModels}
          />
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={resetChat} className="h-8 text-xs">
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold tracking-tight">Start a conversation</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Ask anything. This uses{" "}
                <span className="font-medium text-foreground">
                  {models?.find((m) => m.model === effectiveModel)?.display_name ??
                    "the selected model"}
                </span>{" "}
                via the Ngamia gateway.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 pb-6">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                streaming={streaming && m.role === "assistant" && m.id === messages[messages.length - 1]?.id}
              />
            ))}
            {error && <div className="callout callout-danger">{error}</div>}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t bg-background/80 pb-3 pt-3 backdrop-blur">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (streaming) stopStreaming();
                else sendMessage();
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="max-h-40 min-h-11 resize-none"
          />
          {streaming ? (
            <Button onClick={stopStreaming} size="icon" variant="outline" className="h-11 w-11 shrink-0">
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || !effectiveModel}
              size="icon"
              className="h-11 w-11 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Messages are billed to your Ngamia credit balance.
        </p>
      </div>
    </div>
  );
}