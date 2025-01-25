import React, { useState, useEffect, useRef } from "react";
import MatchedSymptoms from "../../components/MatchedSymptoms";
import { Send } from "lucide-react";
import { Bot } from "lucide-react";
import { CircleUserRound } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([{sender: "Bot", text:"Hey👋, how can i help you?"}]);
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const userMessage = { sender: "User", text: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });
      const data = await response.json();

      const botMessage = { sender: "Bot", text: data.output };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    
      if (Array.isArray(data.matched_symptoms)) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "Bot", type: "symptoms", symptoms: data.matched_symptoms },
        ]);
      }
    } catch (error) {
      console.error("Error communicating with the server:", error);
      const errorMessage = {
        sender: "Bot",
        text: "An error occurred. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setUserInput("");
  };

  const handleSymptomClick = async (symptom) => {
    const selectedSymptom = { sender: "User", text: symptom };

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected: symptom }),
      });
      const data = await response.json();
      const botMessage = { sender: "Bot", text: data.output };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending symptom:", error);
      const errorMessage = {
        sender: "Bot",
        text: "An error occurred. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-violet-300">
      <div className="text-center bg-white shadow-lg rounded-lg w-full max-w-2xl px-12 py-8">
        <h1 className="text-3xl font-bold text-violet-600 mb-8">Chatbot</h1>
        <div ref={chatContainerRef} className="border border-gray-300 rounded-md p-2 w-full mx-auto max-h-96 overflow-y-auto bg-white shadow-md">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                message.sender === "User" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "User" ? (
                <div className="flex items-start">
                  <span className="text-gray-500 text-right font-serif">
                    {message.text}
                  </span>
                  <CircleUserRound className="w-8 h-5 shrink-0 text-gray-600 ml-1" />
                </div>
              ) : message.type === "symptoms" ? (
                <MatchedSymptoms
                  symptoms={message.symptoms}
                  onSymptomClick={handleSymptomClick}
                />
              ) : (
                <div className="flex items-start">
                  <Bot className="w-10 h-6 shrink-0 text-violet-600 mr-1" />
                  <span className="text-gray-500 text-left font-serif">
                    {message.text}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 mb-4 flex justify-center items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="px-4 py-2 text-zinc-600 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2  bg-violet-600 text-white rounded-xl hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
