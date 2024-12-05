import React, { useState } from "react";
import "./Chatbot.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = userInput; // Store input before clearing
    setUserInput(""); // Clear input immediately after sending

    try {
      const response = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      const botMessage = { text: data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Please try again.", sender: "bot" },
      ]);
    }
  };

  const handleClearChat = () => {
    setMessages([]); // Clear all messages
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Modal */}
      <div className={`chatbot-modal ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <h4>{isOpen ? "MovieBot" : "Open Chat"}</h4>
          <div className="chatbot-header-buttons">
            <button className="clear-btn" onClick={handleClearChat}>
              Clear Chat
            </button>
            <button className="close-btn" onClick={toggleChat}>
              {isOpen ? "Close" : "Open"}
            </button>
          </div>
        </div>
  
        {isOpen && (
          <div className="chatbot-body">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
  
            <div className="chatbot-input">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about movies..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
  
      {/* Button to toggle the chatbot */}
      <button className="open-chat-btn" onClick={toggleChat}>
  {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comments"></i>}
</button>
    </div>
  );
  
}

export default Chatbot;
