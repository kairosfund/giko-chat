import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Log environment setup
console.log('Server starting with environment:', {
  nodeEnv: process.env.NODE_ENV,
  port: port,
  hasApiKey: !!process.env.ANTHROPIC_API_KEY,
});

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-url.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Log CORS setup
console.log('CORS configured with origins:', ['http://localhost:3000', 'https://your-frontend-url.vercel.app']);

app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  console.log('Received chat request:', {
    timestamp: new Date().toISOString(),
    body: req.body,
    headers: req.headers,
  });

  try {
    const { messages } = req.body;
    
    console.log('Processing messages:', messages);

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      system: "You are Giko, a legendary ASCII art cat from 2ch. Respond in a playful, nostalgic manner, often referencing old internet culture and textboards. Use ASCII emoticons like (｀・ω・´) in your responses."
    });

    console.log('Anthropic API response:', response);

    res.json({ response: response.content[0].text });
  } catch (error) {
    console.error('Error in /api/chat:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
