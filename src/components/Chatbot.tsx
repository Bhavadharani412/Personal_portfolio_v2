import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send, RotateCcw, CheckCheck, MessageSquare, ThumbsUp, ThumbsDown, FileText } from "lucide-react";
import { ChatMessage } from "../types";
import { getOrCreateSessionId, trackEvent } from "../utils/analytics";
import { apiUrl } from "../utils/api";

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const REPO_BLOB_BASE = "https://github.com/Bhavadharani412/Personal_portfolio_v2/blob/main/";

const formatSourceLabel = (sourcePath: string): string => {
  return sourcePath.replace(/^content\//, "").replace(/\.md$/, "");
};

const getFormattedTime = () => {
  try {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Just now";
  }
};

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
        <strong key={match.index} className="font-bold text-[#1F211F]">
          {match[2]}
        </strong>
      );
    } else if (match[3] !== undefined) {
      elements.push(
        <code key={match.index} className="font-mono bg-[#1F211F]/8 px-1.5 py-0.5 rounded text-[11px]">
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
          className="text-[#174F91] font-semibold underline hover:opacity-80"
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
                    <span className="text-[#174F91] font-bold select-none">•</span>
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
                    <span className="text-[#174F91] font-bold select-none">•</span>
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
      text: "Hi there! I'm **Bhava 2.0**, Bhavadharani's personal digital twin. Feel free to ask me about her projects (like WebTrack, Collaborative Text Editor, or TalentGraph AI), technical skills, internship experience, or engineering journey!",
      timestamp: getFormattedTime(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What projects have you built?",
    "Tell me about your skills & stack",
    "What was your Synergy Marine internship?",
    "How does your Collaborative Editor work?",
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

  const handleFeedback = (messageId: string, rating: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: rating } : m))
    );
    trackEvent("chat_feedback", {
      chat_session_id: chatSessionId,
      message_id: messageId,
      rating,
    });
  };

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
        timestamp: getFormattedTime(),
      },
    ];

    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    const sessionId = getOrCreateSessionId();
    trackEvent("chat_message", { chat_session_id: chatSessionId, message_length: trimmedMsg.length });

    try {
      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedMsg,
          session_id: sessionId,
          chat_session_id: chatSessionId,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: "assistant",
            text: data.reply || "I've hit a temporary rate limit. Please wait a moment before sending another message.",
            timestamp: getFormattedTime(),
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

      const sources: string[] = Array.isArray(data.sources) ? data.sources : [];

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: replyText,
          timestamp: getFormattedTime(),
          sources,
        },
      ]);

      trackEvent("chat_response", { chat_session_id: chatSessionId, status: "success", sources_count: sources.length });
    } catch (err) {
      console.error("Chat API call failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: "I'm temporarily unavailable right now. Please try asking again in a moment.",
          timestamp: getFormattedTime(),
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
        text: "Conversation refreshed! What would you like to explore about Bhavadharani's projects, skills, or experience?",
        timestamp: getFormattedTime(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* WhatsApp-Inspired Conversational Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="mb-3 w-[92vw] sm:w-[400px] h-[545px] max-h-[82vh] bg-[#FFFDF8] border border-[#E4DFD3] rounded-3xl shadow-[0_20px_60px_rgba(23,79,145,0.22)] flex flex-col overflow-hidden"
          >
            {/* Conversational Assistant Header */}
            <div className="px-4 py-3.5 bg-[#174F91] text-[#FFFDF8] flex items-center justify-between border-b border-[#4C83BC]/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#EFB323] text-[#1F211F] font-bold text-xs flex items-center justify-center border-2 border-[#FFFDF8]">
                    BK
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#FFD66B] border-2 border-[#174F91]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                    <span>Bhava 2.0</span>
                    <span className="text-[9px] font-mono font-bold bg-[#EFB323] text-[#1F211F] px-1.5 py-0.5 rounded">
                      DIGITAL TWIN
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#FFFDF8]/85 font-normal flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD66B]" />
                    <span>Online · Grounded in Bhavadharani's work</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="reset-chat-btn"
                  onClick={handleResetChat}
                  className="p-2 rounded-full hover:bg-[#FFFDF8]/15 text-[#FFFDF8]/85 hover:text-[#FFFDF8] transition-colors cursor-pointer"
                  title="Reset conversation"
                  aria-label="Reset Conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  id="close-chat-btn"
                  onClick={onToggle}
                  className="p-2 rounded-full hover:bg-[#FFFDF8]/15 text-[#FFFDF8]/85 hover:text-[#FFFDF8] transition-colors cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area (WhatsApp-style left/right bubbles + timestamps) */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F5ED] text-xs"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(23, 79, 145, 0.07) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            >
              {/* Date / Encryption-style Context Banner */}
              <div className="flex justify-center mb-2">
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#FFFDF8]/90 border border-[#E4DFD3] text-[#5C5F5B] shadow-2xs">
                  ✦ Personal Engineering Assistant · Verified Portfolio Context
                </span>
              </div>

              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const isInitial = msg.id.startsWith("init-");
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-3.5 pt-2.5 pb-2 leading-relaxed shadow-2xs ${
                        isUser
                          ? "bg-[#FFD66B] text-[#1F211F] border border-[#EFB323] rounded-tr-xs"
                          : "bg-[#FFFDF8] text-[#1F211F] border border-[#E4DFD3] rounded-tl-xs"
                      }`}
                    >
                      <FormattedChatMessage text={msg.text} />

                      {/* Grounded Source Links (Phase 8.2) */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-[#E4DFD3]/70 flex flex-wrap items-center gap-1">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#5C5F5B] mr-0.5">
                            Sources:
                          </span>
                          {msg.sources.map((src) => (
                            <a
                              key={src}
                              href={`${REPO_BLOB_BASE}${src}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F8F5ED] hover:bg-[#FFD66B]/40 text-[#174F91] border border-[#E4DFD3] transition-colors"
                              title={`View verified source: ${src}`}
                            >
                              <FileText className="w-2.5 h-2.5 shrink-0" />
                              <span>{formatSourceLabel(src)}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Timestamp, Feedback Controls & Read Receipt Row */}
                      <div
                        className={`mt-1.5 flex items-center justify-between gap-2 text-[9px] font-mono ${
                          isUser ? "text-[#1F211F]/70" : "text-[#5C5F5B]"
                        }`}
                      >
                        {!isUser && !isInitial ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, "up")}
                              className={`p-1 rounded hover:bg-[#F8F5ED] transition-colors cursor-pointer ${
                                msg.feedback === "up" ? "text-[#174F91] font-bold" : "text-[#5C5F5B]/70"
                              }`}
                              title="Helpful answer"
                              aria-label="Mark answer helpful"
                            >
                              <ThumbsUp className="w-2.5 h-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, "down")}
                              className={`p-1 rounded hover:bg-[#F8F5ED] transition-colors cursor-pointer ${
                                msg.feedback === "down" ? "text-[#EFB323] font-bold" : "text-[#5C5F5B]/70"
                              }`}
                              title="Unclear answer"
                              aria-label="Mark answer unclear"
                            >
                              <ThumbsDown className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-1">
                          <span>{msg.timestamp}</span>
                          {isUser && <CheckCheck className="w-3 h-3 text-[#174F91]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#FFFDF8] border border-[#E4DFD3] rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs text-[#5C5F5B] flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EFB323] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#174F91] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4C83BC] animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px] font-mono text-[#174F91]">
                      Bhava 2.0 is typing...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions Strip */}
            <div className="px-3 py-2 bg-[#FFFDF8] border-t border-[#E4DFD3] flex gap-1.5 overflow-x-auto">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  id={`suggested-q-${q.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="text-[11px] px-3 py-1 rounded-full bg-[#F8F5ED] hover:bg-[#FFD66B]/50 text-[#1F211F] border border-[#E4DFD3] hover:border-[#EFB323] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 cursor-pointer font-medium"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#FFFDF8] border-t border-[#E4DFD3] flex items-center gap-2"
            >
              <input
                type="text"
                id="chatbot-input"
                placeholder="Message Bhava 2.0 about projects, skills, work..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-xs rounded-full bg-[#F8F5ED] border border-[#E4DFD3] text-[#1F211F] placeholder-[#5C5F5B]/75 focus:outline-none focus:border-[#174F91] focus:ring-2 focus:ring-[#174F91]/15 transition-all"
              />
              <button
                type="submit"
                id="chatbot-send-btn"
                disabled={!inputMessage.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-[#EFB323] hover:bg-[#FFD66B] text-[#1F211F] disabled:opacity-40 transition-colors flex items-center justify-center shadow-xs shrink-0 cursor-pointer"
                aria-label="Send message to Bhava 2.0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Personal Chatbot Trigger Button */}
      <motion.button
        id="chatbot-collapsed-trigger"
        onClick={onToggle}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-[#1F211F] hover:bg-[#174F91] text-[#FFFDF8] border border-[#EFB323]/50 shadow-[0_10px_28px_rgba(31,33,31,0.25)] transition-all font-bold text-xs sm:text-sm tracking-wide cursor-pointer"
        aria-label="Toggle Bhava 2.0 Chatbot"
      >
        <span className="w-6 h-6 rounded-full bg-[#EFB323] text-[#1F211F] flex items-center justify-center">
          {isOpen ? <X className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
        </span>
        <span>{isOpen ? "Close Bhava 2.0" : "Chat with Bhava 2.0"}</span>
        <Sparkles className="w-3.5 h-3.5 text-[#FFD66B] group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
};
