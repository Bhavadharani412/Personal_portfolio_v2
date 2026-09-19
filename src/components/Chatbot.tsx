import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send, CornerDownLeft, RotateCcw, MessageSquare } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "assistant",
      text: "Hello! I am **Bhava 2.0**, Bhavadharani's conversational digital twin. Ask me about my backend architectures, projects like Dev Explain AI, open-source work, or engineering journey.",
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
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        role: "user",
        text: message.trim(),
        timestamp: "Now",
      },
    ];

    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          history: newMessages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "I'm exploring that right now! Feel free to ask about Dev Explain AI or my tech stack.";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: replyText,
          timestamp: "Just now",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      // Graceful answer
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          text: "I build backend systems with Python, Java, and TypeScript, focusing on developer productivity tools like Dev Explain AI and practical AI grounding. Feel free to ask about my journey from B.Tech IT to McKinsey Forward!",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
                  onClick={() =>
                    setMessages([
                      {
                        id: "init-reset",
                        role: "assistant",
                        text: "Context refreshed. What would you like to know about Bhavadharani's software engineering background?",
                        timestamp: "Just now",
                      },
                    ])
                  }
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
                      <div className="whitespace-pre-line break-words">
                        {msg.text}
                      </div>
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

            {/* Suggested Questions Quick Carousel */}
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

            {/* Input Footer */}
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

      {/* Collapsed State: Small Blue Interaction Button */}
      <motion.button
        id="chatbot-collapsed-trigger"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1268A3] hover:bg-[#2388C5] text-white shadow-[0_6px_20px_rgba(18,104,163,0.35)] transition-all font-medium text-xs sm:text-sm tracking-wide"
        aria-label="Toggle Bhava 2.0 Chatbot"
      >
        <Sparkles className="w-4 h-4 text-[#FFD84A] group-hover:rotate-12 transition-transform" />
        <span className="font-semibold">✦ Bhava 2.0</span>
      </motion.button>
    </div>
  );
};
