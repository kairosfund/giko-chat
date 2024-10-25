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
      // Get the API URL from environment or use the deployed backend URL
      const apiUrl = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app';
      console.log('Current API URL:', apiUrl);
      console.log('Current environment:', process.env.NODE_ENV);
      
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { type: 'user', text: userMessage }],
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      if (!data.response) {
        console.error('Unexpected API response format:', data);
        throw new Error('API response missing expected data');
      }

      return data.response;
    } catch (error) {
      console.error('Detailed error in getAIResponse:', {
        error: error.message,
        stack: error.stack,
        apiUrl: process.env.REACT_APP_API_URL,
        environmentVars: {
          nodeEnv: process.env.NODE_ENV,
          apiUrl: process.env.REACT_APP_API_URL
        }
      });
      
      // Add the error message to the chat
      setMessages(prev => [...prev, {
        type: 'giko',
        text: `( ; ω ; ) Error: ${error.message}`
      }]);
      
      return null; // Return null so we don't add another message
    } finally {
      setIsThinking(false);
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = async () => {
    if (inputValue.trim() === '') return;

    try {
      // Add user message
      const userMessage = inputValue;
      console.log('User input:', userMessage);
      
      const updatedMessages = [
        ...messages,
        { type: 'user', text: userMessage }
      ];
      setMessages(updatedMessages);
      setInputValue('');

      // Get and add AI response
      console.log('Requesting AI response...');
      const aiResponse = await getAIResponse(userMessage);
      console.log('Received AI response:', aiResponse);
      
      if (aiResponse) { // Only add AI response if we got one
        setMessages(prev => [...prev, {
          type: 'giko',
          text: aiResponse
        }]);
      }
    } catch (error) {
      console.error('Error in handleClick:', error);
      setMessages(prev => [...prev, {
        type: 'giko',
        text: "( ; ω ; ) Something went wrong while processing your message..."
      }]);
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
