#!/bin/bash

echo "Testing backend server..."

# Test 1: Check if server is running
echo -e "\nTest 1: GET /"
curl http://localhost:3001/

# Test 2: Send a chat message
echo -e "\n\nTest 2: POST /api/chat"
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello Giko! Who are you?"
      }
    ]
  }'
