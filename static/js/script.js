document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key (but allow Shift+Enter for new lines)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.innerHTML = '<div class="message-content"><p>Thinking...</p></div>';
        chatMessages.appendChild(loadingDiv);
        scrollToBottom();
        
        // Send message to server
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            // Remove loading indicator
            chatMessages.removeChild(loadingDiv);
            
            // Add bot response to chat
            if (data.response) {
                addMessage(data.response, 'bot');
            } else {
                addMessage('I apologize, but I couldn\'t generate a response. Please try again.', 'bot');
            }
        })
        .catch(error => {
            // Remove loading indicator
            chatMessages.removeChild(loadingDiv);
            
            // Show error message
            console.error('Error:', error);
            addMessage(`Sorry, there was an error: ${error.message}. Please try again.`, 'bot');
            
            // Add a retry button
            const retryDiv = document.createElement('div');
            retryDiv.className = 'message bot';
            retryDiv.innerHTML = `
                <div class="message-content">
                    <p>Would you like to try again?</p>
                    <button id="retry-button" class="retry-button">Retry</button>
                </div>
            `;
            chatMessages.appendChild(retryDiv);
            scrollToBottom();
            
            // Add event listener to retry button
            document.getElementById('retry-button').addEventListener('click', () => {
                chatMessages.removeChild(retryDiv);
                sendMessage();
            });
        });
    }
    
    // Function to add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Convert markdown-style formatting to HTML
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        contentDiv.innerHTML = `<p>${formattedText}</p>`;
        messageDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}); 