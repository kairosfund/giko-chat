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
    console.log('=== getAIResponse Started ===');
    console.log('Current messages:', messages);
    console.log('New user message:', userMessage);
    
    setIsThinking(true);
    try {
        const messagePayload = [...messages, { type: 'user', text: userMessage }].map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));
        
        console.log('Formatted messages for API:', messagePayload);
        
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messagePayload
            }),
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.details || 'API request failed');
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            throw new Error('Invalid response format from API');
        }

        return data.content[0].text;
    } catch (error) {
        console.error('Error in getAIResponse:', error);
        return `( ; ω ; ) Error: ${error.message}`;
    } finally {
        setIsThinking(false);
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = async () => {
    console.log('=== handleClick Started ===');
    console.log('Current input value:', inputValue);
    
    if (inputValue.trim() === '') {
      console.log('Empty input, returning early');
      return;
    }

    try {
      const userMessage = inputValue;
      console.log('Processing user message:', userMessage);
      
      const updatedMessages = [
        ...messages,
        { type: 'user', text: userMessage }
      ];
      console.log('Updated messages array:', updatedMessages);
      
      setMessages(updatedMessages);
      setInputValue('');

      console.log('Requesting AI response...');
      const aiResponse = await getAIResponse(userMessage);
      console.log('Received AI response:', aiResponse);
      
      if (aiResponse) {
        console.log('Adding AI response to messages');
        setMessages(prev => {
          const newMessages = [...prev, {
            type: 'giko',
            text: aiResponse
          }];
          console.log('New messages state:', newMessages);
          return newMessages;
        });
      }
    } catch (error) {
      console.error('=== Error in handleClick ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      setMessages(prev => [...prev, {
        type: 'giko',
        text: "( ; ω ; ) Something went wrong while processing your message..."
      }]);
    } finally {
      console.log('=== handleClick Completed ===');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  // Log when component mounts
  React.useEffect(() => {
    console.log('GikoAvatar mounted with API URL:', process.env.REACT_APP_API_URL);
  }, []);

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
