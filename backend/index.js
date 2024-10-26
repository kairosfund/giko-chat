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
    origin: '*',  // Allow all origins in production
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type']
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
        
        // Validate messages format
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Messages must be an array');
        }

        // Format messages correctly for Claude
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        console.log('Sending to Claude:', formattedMessages);

        // Make the API call
        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: formattedMessages,
            system: "You are Giko, a legendary ASCII art cat from 2ch. Respond in a playful, nostalgic manner, often referencing old internet culture and textboards. Use ASCII emoticons like (｀・ω・´) in your responses.",
            temperature: 0.7
        });

        console.log('Claude response:', response);

        // Send response back
        res.json({
            content: [{
                text: response.content[0].text
            }]
        });
    } catch (error) {
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Send a more specific error message
        res.status(500).json({
            error: 'Chat error',
            details: error.message,
            type: error.name
        });
    }
});

// Add this test route
app.get('/api/test', async (req, res) => {
    try {
        console.log('Testing Anthropic connection...');
        console.log('API Key:', process.env.ANTHROPIC_API_KEY ? 'Present (masked)' : 'Missing');
        
        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: [{ role: "user", content: "Say hello!" }],
            system: "You are Giko, respond with a simple hello."
        });

        res.json({ 
            success: true, 
            message: 'Anthropic connection successful',
            response: response.content[0].text 
        });
    } catch (error) {
        console.error('Anthropic test error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            stack: error.stack
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
