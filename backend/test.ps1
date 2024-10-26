# Test 1: Check if server is running
Write-Host "`nTest 1: GET /"
Invoke-RestMethod -Uri "http://localhost:3001/"

# Test 2: Send a chat message
Write-Host "`nTest 2: POST /api/chat"
$body = @{
    messages = @(
        @{
            role = "user"
            content = "Hello Giko! Who are you?"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/chat" -Method Post -Body $body -ContentType "application/json"
