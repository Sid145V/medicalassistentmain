import React, { useState, useRef, useEffect } from "react";
import {
  getCsvChatbotResponse,
  getChatHistory,
  clearChatHistory,
} from "../services/csvChatbotService";
import { useAuth } from "../context/AuthContext";

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [savedChats, setSavedChats] = useState<any[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(
      0,
      chatContainerRef.current.scrollHeight
    );
  }, [history]);

  useEffect(() => {
    // Load saved chat history on mount
    setSavedChats(getChatHistory());
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", parts: [{ text: input }] };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInput("");
    setIsLoading(true);

    const responseText = await getCsvChatbotResponse(input);

    // Start typing animation
    const typedText = await typeMessage(responseText);

    const modelMessage: ChatMessage = {
      role: "model",
      parts: [{ text: typedText }],
    };
    setHistory([...newHistory, modelMessage]);
    setIsLoading(false);

    // Refresh saved chats
    setSavedChats(getChatHistory());
  };

  const handleNewChat = () => {
    setHistory([]);
  };

  // Typing animation function
  const typeMessage = async (text: string) => {
    setIsTyping(true);
    setTypingText("");

    const words = text.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i];
      setTypingText(currentText);

      // Adjust speed: lower = faster, higher = slower
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setIsTyping(false);
    return text;
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all chat history?")) {
      clearChatHistory();
      setSavedChats([]);
      setHistory([]);
    }
  };

  const loadSavedChat = (savedChat: any) => {
    setHistory([
      { role: "user", parts: [{ text: savedChat.query }] },
      { role: "model", parts: [{ text: savedChat.response }] },
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-150px)]">
      <div className="w-1/4 bg-gray-100 p-4 border-r flex flex-col overflow-hidden">
        <button
          onClick={handleNewChat}
          className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors mb-2"
        >
          + New Chat
        </button>
        <button
          onClick={handleClearHistory}
          className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors mb-4 text-sm"
        >
          Clear All History
        </button>
        <div className="flex-grow overflow-y-auto">
          <h3 className="font-bold text-gray-700 mb-2 sticky top-0 bg-gray-100 py-2">
            Chat History ({savedChats.length})
          </h3>
          {savedChats.length === 0 ? (
            <p className="text-sm text-gray-500">No previous chats yet</p>
          ) : (
            <div className="space-y-2">
              {savedChats.map((chat, index) => (
                <div
                  key={index}
                  onClick={() => loadSavedChat(chat)}
                  className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow border border-gray-200"
                >
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {chat.query}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(chat.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow flex flex-col bg-white rounded-lg shadow-md">
        <div
          ref={chatContainerRef}
          className="flex-grow p-6 space-y-4 overflow-y-auto"
        >
          {history.length === 0 && (
            <div className="text-center text-gray-500">
              <p className="text-xl font-semibold mb-2">
                Welcome,{" "}
                {user?.role === "patient" && "firstName" in user
                  ? user.firstName
                  : "there"}
                !
              </p>
              <p className="mb-4">
                I'm your AI Medical Assistant. How can I help you today?
              </p>
              <div className="bg-blue-50 p-4 rounded-lg text-left max-w-md mx-auto">
                <p className="font-semibold mb-2">💡 Try asking about:</p>
                <ul className="text-sm space-y-1">
                  <li>• "I have a fever"</li>
                  <li>• "I'm coughing for 3 days"</li>
                  <li>• "Severe headache"</li>
                  <li>• "Stomach ache after eating"</li>
                </ul>
              </div>
            </div>
          )}
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl p-4 rounded-xl whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.parts[0].text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-3xl p-4 rounded-xl whitespace-pre-wrap bg-gray-100 text-gray-800">
                {typingText}
                <span className="animate-pulse ml-1">▋</span>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-lg p-3 rounded-xl bg-gray-200 text-gray-800">
                <span className="animate-pulse">
                  Analyzing your symptoms...
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your symptoms here..."
              className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 disabled:bg-gray-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
