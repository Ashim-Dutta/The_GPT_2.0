import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  Zap,
  Clock,
  MessageSquare,
  Shield,
  Brain,
  ChevronRight,
} from "lucide-react";

      import DarkVeil from "../components/DarkVeil";

const Home = () => {
  // Simulate login status (replace with actual auth later)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Sample chat messages for demonstration
  const [chatMessages, setChatMessages] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newUserMessage = {
      id: chatMessages.length + 1,
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newUserMessage]);
    setMessage("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        text: "I understand. Let me help you with that. Could you provide more details about your requirements?",
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">

      <div className="absolute z-0  h-[100vh] w-[100%]">
        <DarkVeil />
      </div>


      <div className="min-h-screen text-gray-100 flex flex-col absolute z-10 w-full ">
        {/* If logged in → Chat UI */}
        {isLoggedIn ? (
          <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Zap size={20} className="text-white" />
                  </div>
                  <h1 className="text-xl font-semibold">GPT 2.0</h1>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors cursor-pointer bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 hover:border-green-500"
                >
                  Sign Out
                </button>
              </div>
            </header>

            {/* Chat Messages */}
            <main className="flex-1 overflow-y-auto px-6 py-4">
              <div className="max-w-4xl mx-auto">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto">
                      <div className="p-3 bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={28} className="text-green-500" />
                      </div>
                      <h2 className="text-xl font-medium mb-2">
                        Start a conversation
                      </h2>
                      <p className="text-gray-400">
                        Ask questions, explore ideas, and get instant answers
                        powered by AI.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 py-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            msg.isUser
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 rounded-br-md"
                              : "bg-gray-800 rounded-bl-md"
                          }`}
                        >
                          <p className="text-white">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.isUser ? "text-emerald-200" : "text-gray-400"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </main>

            {/* Chat Input */}
            <footer className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-green-500 transition-colors"
                >
                  <input
                    type="text"
                    placeholder="Send a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                  >
                    <Send size={18} className="text-white" />
                  </button>
                </form>
                <p className="text-xs text-center text-gray-500 mt-3">
                  GPT 2.0 may produce inaccurate information about people,
                  places, or facts.
                </p>
              </div>
            </footer>
          </div>
        ) : (
          <>
            {/* Landing UI */}
            <header className="flex flex-col items-center justify-center text-center flex-1 px-6 py-16">
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-6">
                  <Zap size={18} className="text-green-500" />
                  <span className="text-sm font-medium">
                    Introducing GPT 2.0
                  </span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent leading-tight mb-4">
                  Intelligent Conversations
                  <br />
                  <span className="text-white">Powered by AI</span>
                </h1>
                <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                  Your professional AI chat assistant — ask questions, explore
                  ideas, and get accurate answers powered by advanced artificial
                  intelligence.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all duration-200 text-center"
                >
                  Get Started
                  <ChevronRight size={18} className="ml-1" />
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-lg border border-gray-600 hover:border-green-500 hover:text-green-400 transition-colors duration-200 text-center"
                >
                  Create Account
                </Link>
              </div>
            </header>

            {/* Features */}
            <main className="px-6 pb-20 max-w-6xl mx-auto w-full">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Enterprise-Grade Features
              </h2>
              <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
                Designed for professionals who need reliable AI assistance
              </p>
            </main>

            
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
