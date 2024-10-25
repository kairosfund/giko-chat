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

  // This would be your actual API call to Claude
  const getAIResponse = async (userMessage) => {
    setIsThinking(true);
    try {
      // This is where you would make the actual API call to your backend
      // const response = await fetch('your-backend-url/api/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     messages: [...messages, { type: 'user', text: userMessage }],
      //     character: 'giko',
      //   }),
      // });
      // const data = await response.json();
      // return data.response;

      // For now, returning a placeholder response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Simulate contextual responses based on keywords
      const input = userMessage.toLowerCase();
      if (input.includes('who are you') || input.includes('what are you')) {
        return "(｀・ω・´) I'm Giko! Born in the ancient halls of 2ch, I'm basically the great-grandfather of cat memes! Been sharing wisdom in ASCII form since before most social media was a thing nyaa~";
      }
      if (input.includes('ascii')) {
        return "( ´・ω・) ASCII art? That's my native language! Back in my day on the textboards, we had to make art with nothing but characters. No fancy emoji back then, just pure ASCII expression! Want me to show you some?";
      }
      if (input.includes('2ch') || input.includes('textboard')) {
        return "∧＿∧ Ahh, you know about 2ch? *ears perk up* That's where I was born! The golden age of internet culture, when everything was text and imagination. Those were the days... Want to hear some stories from back then?";
      }
      if (input.includes('hello') || input.includes('hi ')) {
        return "ᕙ(｀・ω・)ᕗ Yo! Welcome to my corner of the internet! Ready to dive into some oldschool net culture?";
      }
      if (input.includes('old') || input.includes('internet')) {
        return "(=｀・ω・) Old internet? *tail swishes nostalgically* Let me tell you about the days of dial-up modems and ASCII art... When the internet was more like a cozy bulletin board than a flashy shopping mall!";
      }

      return "(｀・ω・´) Nyaa~ That's an interesting perspective! Back in my 2ch days, we had lots of discussions about this. *adjusts ASCII whiskers thoughtfully*";

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