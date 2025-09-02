require('dotenv').config(); // Load environment variables
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const dialogflow = require('@google-cloud/dialogflow');

// Initialize Dialogflow session client
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, 'serviceAccountKey.json')
});
const projectId = process.env.DIALOGFLOW_PROJECT_ID;

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for messages from the client
    socket.on('send_message', async (data) => {
        const { message } = data;

        // Create a Dialogflow session
        const sessionPath = sessionClient.projectAgentSessionPath(projectId, socket.id);

        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: 'en',
                },
            },
        };

        try {
            // Send request to Dialogflow and get response
            const responses = await sessionClient.detectIntent(request);
            const result = responses[0].queryResult;
            const botReply = result.fulfillmentText;

            // Send the bot's reply back to the client
            socket.emit('bot_reply', { reply: botReply });

        } catch (error) {
            console.error('Dialogflow Error:', error);
            socket.emit('bot_reply', { reply: "Sorry, I'm having trouble right now." });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});