// Previous code remains the same until getAIResponse function

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

// Rest of the code remains the same
