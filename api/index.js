require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

// Initialize WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" }),
});

// Log QR Code
client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        console.log('Scan this QR Code:', url);
    });
});

// Log when client is ready
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Handle disconnections
client.on('disconnected', (reason) => {
    console.error('Client disconnected:', reason);
    process.exit(1);
});

// Start client initialization
client.initialize();

// Express-like API handler
module.exports = async (req, res) => {
    const { method, body } = req;

    if (method === 'POST' && req.url === '/send-message') {
        const { number, message } = body;

        // Validate request
        if (!number || !message) {
            return res.status(400).json({ success: false, error: 'Invalid request body' });
        }

        try {
            // Format the phone number and send the message
            const phoneNumber = `${number}@c.us`;
            await client.sendMessage(phoneNumber, message);
            return res.status(200).json({ success: true, message: 'Message sent successfully!' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    return res.status(404).json({ success: false, message: 'Endpoint not found' });
};
