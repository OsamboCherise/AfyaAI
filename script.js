document.addEventListener('DOMContentLoaded', function() {
    // Create floating particles
    const particlesContainer = document.getElementById('particles');
    const particlesCount = 20;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 5;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animation = `
            float ${duration}s ease-in-out ${delay}s infinite alternate,
            opacityChange ${duration/2}s ease-in-out ${delay}s infinite alternate
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Chat functionality
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickReplies = document.querySelectorAll('.quick-reply');
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    
    // Sample responses for the chatbot
    const responses = {
        "hello": "Hello there! How are you feeling today?",
        "hi": "Hi! I'm Afya AI. What's on your mind?",
        "how are you": "I'm here and ready to support you. How are you feeling today?",
        "anxious": "I understand feeling anxious can be challenging. Let's try a quick breathing exercise: Breathe in for 4 seconds, hold for 4, exhale for 6. Repeat 3 times.",
        "stress": "Stress is a natural response, but we can manage it. Would you like to try a mindfulness exercise or talk about what's causing the stress?",
        "sad": "I'm sorry you're feeling sad. It's okay to feel this way. Would you like to talk about what's bothering you?",
        "mindfulness": "Mindfulness is about being present in the moment. A simple technique: focus on your breath for 60 seconds, noticing each inhale and exhale.",
        "coping": "Great that you're looking for coping strategies! Different techniques work for different people. Would you like to try breathing exercises, grounding techniques, or perhaps cognitive reframing?",
        "default": "I'm here to listen and support you. Could you tell me a bit more about what you're experiencing?"
    };
    
    // Function to add a message to the chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        const messageP = document.createElement('p');
        messageP.textContent = text;
        
        messageDiv.appendChild(messageP);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to generate bot response
    function getBotResponse(message) {
        message = message.toLowerCase();
        
        for (const [key, value] of Object.entries(responses)) {
            if (message.includes(key)) {
                return value;
            }
        }
        
        return responses["default"];
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('typing-dot');
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return typingDiv;
    }
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            const typingIndicator = showTypingIndicator();
            
            // Simulate bot thinking and response
            setTimeout(() => {
                typingIndicator.remove();
                const response = getBotResponse(message);
                addMessage(response, false);
            }, 1500);
        }
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick replies functionality
    quickReplies.forEach(reply => {
        reply.addEventListener('click', () => {
            const message = reply.getAttribute('data-message');
            userInput.value = message;
            sendMessage();
        });
    });
    
    // Emoji picker functionality
    emojiBtn.addEventListener('click', function() {
        emojiPicker.style.display = emojiPicker.style.display === 'grid' ? 'none' : 'grid';
    });
    
    // Add emoji to input when clicked
    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.addEventListener('click', function() {
            userInput.value += this.textContent;
            userInput.focus();
            emojiPicker.style.display = 'none';
        });
    });
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', function(e) {
        if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.style.display = 'none';
        }
    });
});