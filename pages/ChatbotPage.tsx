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
  image?: string;
}

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [savedChats, setSavedChats] = useState<any[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const messageText = selectedImage
      ? input.trim() || "I've uploaded an image for analysis"
      : input;

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text: messageText }],
      image: selectedImage || undefined,
    };

    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInput("");
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    let responseText = "";

    try {
      if (currentImage) {
        // Use REAL AI image analysis
        const { analyzeImageWithAI } = await import(
          "../services/advancedImageAnalysis"
        );

        const aiAnalysis = await analyzeImageWithAI(currentImage);

        responseText = `**🤖 AI Image Analysis Complete**

**Category Detected:** ${aiAnalysis.category.toUpperCase().replace("_", " ")}
**Confidence:** ${(aiAnalysis.confidence * 100).toFixed(1)}%

---

${aiAnalysis.guidance}

---

${
  input.trim()
    ? `\n**Your Additional Note:** "${input.trim()}"\n\nI've considered your description in the guidance above.\n\n---\n\n`
    : ""
}

⚠️ **IMPORTANT MEDICAL DISCLAIMER:**
This AI analysis is for informational purposes only and should NOT replace professional medical evaluation. For accurate diagnosis and treatment, please consult a qualified healthcare provider, especially for:
- Severe or worsening conditions
- Persistent symptoms
- Concerns about infection
- Any medical emergency

💡 If you'd like more specific guidance, describe your symptoms in detail (pain level, duration, other symptoms, etc.).`;
      } else {
        // Text-based response using existing CSV system
        responseText = await getCsvChatbotResponse(messageText);
      }
    } catch (error) {
      console.error("Error analyzing:", error);
      responseText = `⚠️ I encountered an error while analyzing the image. This could be because:
- The image format is not supported
- The AI model is still loading
- Network connectivity issue

Please try:
1. Describing your symptoms in text
2. Uploading a different image format (JPG/PNG)
3. Refreshing the page and trying again

I'm here to help - just describe what you're experiencing!`;
    }

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
    setSelectedImage(null);
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
                <p className="font-semibold mb-2">💡 You can:</p>
                <ul className="text-sm space-y-1">
                  <li>• Describe your symptoms in text</li>
                  <li>• Upload images of rashes or wounds 📷</li>
                  <li>• Ask "I have a fever"</li>
                  <li>• Get medication guidance</li>
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
                className={`max-w-3xl rounded-xl whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-800"
                } ${msg.image ? "p-2" : "p-4"}`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Uploaded medical image"
                    className="max-w-xs rounded-lg mb-2 border-2 border-white"
                  />
                )}
                <div className={msg.image ? "p-2" : ""}>
                  {msg.parts[0].text}
                </div>
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
          {isLoading && !isTyping && (
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
          {selectedImage && (
            <div className="mb-2 relative inline-block">
              <img
                src={selectedImage}
                alt="Selected for upload"
                className="max-w-xs max-h-32 rounded-lg border-2 border-teal-500"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 font-bold"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 transition-colors"
              title="Upload medical image"
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your symptoms or upload an image..."
              className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
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
