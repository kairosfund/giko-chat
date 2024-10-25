import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const GikoAvatar = () => {
  const [messages, setMessages] = useState([
    { type: 'giko', text: "∧＿∧ Yo! I'm Giko, the original ASCII cat! (｀・ω・´) I've been around since the early days of 2ch and textboards. What's on your mind?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const gikoArt = `∧＿∧
（｡・ω・｡）
|  ⊃／(＿＿＿
/  └-(＿＿＿／`;

  const getAIResponse = async (userMessage) => {
    setIsThinking(true);
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { type: 'user', text: userMessage }],
        }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "( ; ω ; ) Nyaa... seems like my ASCII circuits are glitching. Can you try again?";
    } finally {
      setIsThinking(false);
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = async () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = inputValue;
    const updatedMessages = [
      ...messages,
      { type: 'user', text: userMessage }
    ];
    setMessages(updatedMessages);
    setInputValue('');

    // Get and add AI response
    const aiResponse = await getAIResponse(userMessage);
    setMessages([
      ...updatedMessages,
      { type: 'giko', text: aiResponse }
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="bg-white p-4 rounded-lg mb-4 font-mono text-center">
        <pre className="text-xs leading-none">
          {gikoArt}
        </pre>
        <h2 className="text-lg font-bold mt-2">Giko</h2>
        <p className="text-sm text-gray-500">ASCII Art Pioneer • 2ch Legend</p>
      </div>

      <div className="h-96 overflow-y-auto bg-white p-4 rounded-lg mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 font-mono'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center space-x-2 font-mono text-gray-500">
            <span className="animate-pulse">∧＿∧</span>
            <span className="animate-pulse">thinking...</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
          placeholder="Talk to Giko..."
          className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          onClick={handleClick}
          disabled={isThinking}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GikoAvatar;
