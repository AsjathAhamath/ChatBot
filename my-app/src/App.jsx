import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there! 👋", sender: "bot" },
    {
      text: "I'm your friendly chatbot. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
    setInputValue("");

    // Simulate bot thinking
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: getBotResponse(inputValue),
          sender: "bot",
        },
      ]);
    }, 1000 + Math.random() * 1000); // Random delay for realism
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    if (input.includes("hello") || input.includes("hi")) {
      return "Hi again! What's on your mind?";
    } else if (input.includes("how are you")) {
      return "I'm just a bot, but I'm functioning perfectly! 😊";
    } else if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help with?";
    } else {
      const randomResponses = [
        "Interesting! Tell me more about that.",
        "I see. How does that make you feel?",
        "Thanks for sharing that with me!",
        "I'm learning from our conversation. Could you elaborate?",
        "That's fascinating! What else would you like to discuss?",
      ];
      return randomResponses[
        Math.floor(Math.random() * randomResponses.length)
      ];
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
      setTimeout(() => setIsMinimized(false), 300); // Wait for animation
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {!isOpen && (
        <button className="chatbot-launcher" onClick={toggleChat}>
          <span className="chat-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
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
              <span className="bot-avatar">🤖</span>
              <h2>Chat Assistant</h2>
            </div>
            <button className="close-btn">{isMinimized ? "↑" : "↓"}</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender} ${
                  index === messages.length - 1 ? "last" : ""
                }`}
              >
                {message.sender === "bot" && (
                  <span className="bot-avatar">🤖</span>
                )}
                <div className="message-content">{message.text}</div>
                {message.sender === "user" && (
                  <span className="user-avatar">👤</span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <div
              className="typing-indicator"
              style={{
                display:
                  messages[messages.length - 1]?.sender === "user"
                    ? "block"
                    : "none",
              }}
            >
              <span>Bot is typing</span>
              <div className="typing-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ""}
                className="send-btn"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
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
