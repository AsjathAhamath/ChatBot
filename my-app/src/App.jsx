import { useState, useRef, useEffect } from "react";
import "./App.css";
import geminiService from "./geminiService";

function App() {
  // State declarations
  const [messages, setMessages] = useState([
    { text: "Hello there! 👋", sender: "bot" },
    {
      text: "I'm your AI assistant powered by Gemini. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const botResponse = await geminiService.generateResponse(inputValue);
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      setApiKeyError(false); // Reset error state on successful response
    } catch (error) {
      console.error("Error:", error);

      // Check if it's an API key error
      if (error.message.includes("API key is not configured")) {
        setApiKeyError(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          text:
            error.message ||
            "Sorry, something went wrong. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (!willOpen && !isMinimized) {
      setIsMinimized(true);
      setTimeout(() => setIsMinimized(false), 300);
    }
  };

  // Check API key on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("API Key:", apiKey ? "Loaded" : "Missing");

    if (!apiKey) {
      setApiKeyError(true);
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file and restart the server.",
          sender: "bot",
        },
      ]);
    }
  }, []);

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {!isOpen && (
        <button
          className="chatbot-launcher"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <span className="chat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
          </span>
          <span className="notification-badge">1</span>
        </button>
      )}

      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? "minimized" : ""}`}>
          <div className="chatbot-header" onClick={toggleChat}>
            <div className="chatbot-title">
              <span className="bot-avatar" role="img" aria-label="Bot">
                🤖
              </span>
              <h2>Gemini Assistant</h2>
            </div>
            <button
              className="close-btn"
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? "↑" : "↓"}
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`msg-${index}`}
                className={`message ${message.sender} ${
                  index === messages.length - 1 ? "last" : ""
                }`}
              >
                {message.sender === "bot" && (
                  <span className="bot-avatar" role="img" aria-label="Bot">
                    🤖
                  </span>
                )}
                <div className="message-content">{message.text}</div>
                {message.sender === "user" && (
                  <span className="user-avatar" role="img" aria-label="User">
                    👤
                  </span>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <span className="bot-avatar" role="img" aria-label="Bot">
                  🤖
                </span>
                <div className="message-content typing-indicator">
                  <div className="typing-dots">
                    {[...Array(3)].map((_, i) => (
                      <div key={`dot-${i}`} className="dot" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          <div className="chatbot-input-area">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  apiKeyError ? "API key required..." : "Type your message..."
                }
                aria-label="Type your message"
                disabled={isTyping || apiKeyError}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping || apiKeyError}
                className="send-btn"
                aria-label="Send message"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M2,21L23,12L2,3V10L17,12L2,14V21Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
