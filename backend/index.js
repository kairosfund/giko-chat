const express = require('express');
const cors = require('cors');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();

// Initialize Anthropic with the correct syntax
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Log initialization status
console.log('API Key loaded:', process.env.ANTHROPIC_API_KEY ? 'Yes (masked)' : 'No');
console.log('Anthropic client initialized:', !!anthropic);

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://giko-chat.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    console.log('=== /api/chat Request Received ===');
    console.log('Request body:', req.body);
    
    try {
        const { messages } = req.body;
        console.log('Processing messages:', messages);

        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: messages,
            system: "You are Giko, a legendary ASCII art cat from 2ch. Respond in a playful, nostalgic manner, often referencing old internet culture and textboards. Use ASCII emoticons like (｀・ω・´) in your responses."
        });

        console.log('API Response:', response);
        res.json({ content: [{ text: response.content[0].text }] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
