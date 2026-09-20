import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send, RotateCcw } from "lucide-react";
import { ChatMessage } from "../types";
import { getOrCreateSessionId, trackEvent } from "../utils/analytics";

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const renderInlineFormatting = (text: string): React.ReactNode[] => {
  const regex = /(\*\*(.*?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[2] !== undefined) {
      elements.push(
        <strong key={match.index} className="font-bold text-[#102A36]">
          {match[2]}
        </strong>
      );
    } else if (match[3] !== undefined) {
      elements.push(
        <code key={match.index} className="font-mono bg-black/5 px-1 py-0.5 rounded text-[11px]">
          {match[3]}
        </code>
      );
    } else if (match[4] !== undefined && match[5] !== undefined) {
      elements.push(
        <a
          key={match.index}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1268A3] underline hover:opacity-80"
        >
          {match[4]}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? elements : [text];
};

export const FormattedChatMessage: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const normalized = text.replace(/\r\n/g, "\n").replace(/\u2011/g, "-");
  const paragraphs = normalized.split(/\n\n+/);

  return (
    <div className="space-y-2 leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split("\n").filter((l) => l.trim().length > 0);
        const isList = lines.length > 0 && lines.every((l) => /^\s*[\-\*\•\d\.]+\s+/.test(l));

        if (isList) {
          return (
            <ul key={pIdx} className="space-y-1.5 my-1">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^\s*[\-\*\•\d\.]+\s+/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-1.5 text-xs">
                    <span className="text-[#1268A3] font-bold select-none">•</span>
                    <span className="flex-1">{renderInlineFormatting(cleanLine)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const bulletMatch = line.match(/^\s*[\-\*\•]\s+(.*)/);
              if (bulletMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 ml-1 my-0.5">
                    <span className="text-[#1268A3] font-bold select-none">•</span>
                    <span className="flex-1">{renderInlineFormatting(bulletMatch[1])}</span>
                  </div>
                );
              }

              return (
                <div key={lIdx} className={lines.length > 1 ? "mb-1" : ""}>
                  {renderInlineFormatting(line)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [chatSessionId, setChatSessionId] = useState<string>(
    () => `cs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "assistant",
      text: "Hello! I am **Bhava 2.0**, Bhavadharani's conversational digital twin. Ask me about backend architectures, projects like Dev Explain AI, open-source work, or engineering journey.",
      timestamp: "Just now",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What did you build?",
    "What's your strongest project?",
    "What technologies do you use?",
    "Tell me about your journey.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      trackEvent("chat_started", { chat_session_id: chatSessionId });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isLoading) return;

    const trimmedMsg = message.trim();
    const userMessageId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        role: "user",
        text: trimmedMsg,
        timestamp: "Now",
      },
    ];

    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    const sessionId = getOrCreateSessionId();
    trackEvent("chat_message", { chat_session_id: chatSessionId, message_length: trimmedMsg.length });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedMsg,
          session_id: sessionId,
          chat_session_id: chatSessionId,
          history: newMessages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: "assistant",
            text: "I've hit a temporary limit. Please wait a moment before asking another question.",
            timestamp: "Just now",
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      const replyText =
        data.reply && data.reply.trim()
          ? data.reply
          : "I don't have that information available right now.";

      if (data.chat_session_id) {
        setChatSessionId(data.chat_session_id);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: replyText,
          timestamp: "Just now",
        },
      ]);

      trackEvent("chat_response", { chat_session_id: chatSessionId, status: "success" });
    } catch (err) {
      console.error("Chat API call failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: "I'm temporarily unavailable. Please try asking again in a moment.",
          timestamp: "Just now",
        },
      ]);
      trackEvent("chat_response", { chat_session_id: chatSessionId, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const newChatId = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setChatSessionId(newChatId);
    setMessages([
      {
        id: "init-reset",
        role: "assistant",
        text: "Context refreshed. What would you like to know about Bhavadharani's software engineering background?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded State Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="mb-3 w-[92vw] sm:w-[390px] h-[520px] max-h-[82vh] bg-[#FFFDF7] border border-[#1268A3]/30 rounded-3xl shadow-[0_12px_40px_rgba(18,104,163,0.18)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#1268A3] text-white flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Sparkles className="w-4 h-4 text-[#FFD84A]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                    <span>Bhava 2.0</span>
                    <span className="text-[10px] font-mono font-normal bg-white/20 px-1.5 py-0.2 rounded">
                      TWIN
                    </span>
                  </h3>
                  <p className="text-[11px] text-white/80 font-normal">
                    Ask me about my work
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="reset-chat-btn"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  title="Reset conversation"
                  aria-label="Reset Conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  id="close-chat-btn"
                  onClick={onToggle}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F7F5EE]/40 text-xs">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        isUser
                          ? "bg-[#F4C928] text-[#102A36] font-medium rounded-br-xs shadow-2xs"
                          : "bg-[#FFFDF7] text-[#102A36] border border-[#D9DDD7] rounded-bl-xs shadow-2xs"
                      }`}
                    >
                      <FormattedChatMessage text={msg.text} />
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#FFFDF7] border border-[#D9DDD7] rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs text-[#61727A] flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1268A3] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1268A3] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1268A3] animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px] font-mono text-[#1268A3]">Reasoning...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions Carousel */}
            <div className="p-2.5 bg-[#FFFDF7] border-t border-[#D9DDD7]/80 flex gap-1.5 overflow-x-auto no-scrollbar">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  id={`suggested-q-${q.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-[#F7F5EE] hover:bg-[#F4C928]/30 text-[#102A36] border border-[#D9DDD7] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#FFFDF7] border-t border-[#D9DDD7]/80 flex items-center gap-2"
            >
              <input
                type="text"
                id="chatbot-input"
                placeholder="ask about Bhavadharani's works..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#F7F5EE] border border-[#D9DDD7] text-[#102A36] placeholder-[#61727A]/70 focus:outline-none focus:border-[#1268A3] focus:ring-1 focus:ring-[#1268A3] transition-all"
              />
              <button
                type="submit"
                id="chatbot-send-btn"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 rounded-xl bg-[#1268A3] text-white hover:bg-[#2388C5] disabled:opacity-40 transition-colors shadow-2xs"
                aria-label="Send message to Bhava 2.0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State Trigger */}
      <motion.button
        id="chatbot-collapsed-trigger"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1268A3] hover:bg-[#2388C5] text-white shadow-[0_6px_20px_rgba(18,104,163,0.35)] transition-all font-semibold text-xs sm:text-sm tracking-wide"
        aria-label="Toggle Bhava 2.0 Chatbot"
      >
        <Sparkles className="w-4 h-4 text-[#FFD84A] group-hover:rotate-12 transition-transform" />
        <span>✦ Bhava 2.0</span>
      </motion.button>
    </div>
  );
};
