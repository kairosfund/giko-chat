const express = require('express');
const cors = require('cors');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();

// Log the API key (masked) to verify it's loaded
console.log('API Key loaded:', process.env.ANTHROPIC_API_KEY ? 'Yes (masked)' : 'No');

// Initialize Anthropic with the correct syntax
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY // Make sure this matches your .env file
});

// Test the Anthropic client
console.log('Anthropic client initialized:', !!anthropic);

// Middleware
app.use(cors({
    origin: '*', // For testing, allow all origins
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

        if (!messages || !Array.isArray(messages)) {
            console.error('Invalid messages format:', messages);
            return res.status(400).json({ 
                error: 'Invalid messages format',
                details: 'Messages must be an array'
            });
        }

        // Log the formatted messages
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        console.log('Formatted messages:', formattedMessages);

        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: formattedMessages,
            system: "You are Giko, a legendary ASCII art cat from 2ch. Respond in a playful, nostalgic manner, often referencing old internet culture and textboards. Use ASCII emoticons like (｀・ω・´) in your responses."
        });

        console.log('API Response:', response);
        
        if (!response.content || !response.content[0]) {
            throw new Error('Invalid API response format');
        }

        res.json({ content: [{ text: response.content[0].text }] });
    } catch (error) {
        console.error('=== Error in /api/chat ===');
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message,
            type: error.name
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
