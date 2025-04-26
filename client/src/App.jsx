import React, { useState, useEffect } from 'react';
import dotenv from 'dotenv';

function OpenAIChatBot() {
  const API_KEY= import.meta.env.VITE_OPEN_API_KEY;
  
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: `test`
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = React.createRef();
  const inputRef = React.createRef();

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isTyping]);
  
  const chatData = async (userMessage) => {
    try {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [...messages, { role: "user", content: userMessage }],
            temperature: 0.7,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Oops! Something went wrong while processing your request.");
        
      }
  
      const responseData = await response.json();
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: responseData.choices[0].message.content,
        },
      ]);
    } catch (error) {
      console.error("Error while fetching chat data:", error);
      setIsTyping(false);
    }
  };

  const handleSendMessage = (messageContent) => {
    setIsTyping(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: messageContent },
    ]);
  //invoke chatData
    chatData(messageContent);
  };


    return (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <h1 className = "text-4xl font-bold text-center w-full text-white p-10 flex-box bg-blue-800">First Line Ortho</h1>
        {/* Main body of page */}
        <div className = "flex flex-col border-2 rounded-sm border-gray-300 p-4 flex-grow overflow-hidden">
          {/* Message container */}
          <div className="flex flex-col flex-grow overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="mb-4">
                <div className = "border-2 border-gray-300 p-2 rounded-xl">
                  <h3 className="text-xl font-bold border-b-1 border-gray-300"> {message.role}</h3>
                <p className = "text-l">{message.content}</p></div>
              </div>
            ))}
            {isTyping && <p>Bot is typing...</p>}
            <div ref={messagesEndRef} />
          </div>
          
        </div>
        {/* Chat input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.input.value;
            if (input.trim() !== "") {
              handleSendMessage(input);
              e.target.reset();
            }
          }}
          className="flex items-center gap-2 p-4 border-t border-gray-300"
        >
          <input
            type="text"
            name="input"
            placeholder="Type your message..."
            disabled={isTyping}
            ref={inputRef}
            className="flex-grow border border-gray-300 rounded p-2"
          />
          <button
            type="submit"
            disabled={isTyping}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </form>
      </div>
    );
}

export default OpenAIChatBot;