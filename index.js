const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

client.initialize();

app.use(express.json());

// Endpoint to send messages
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).send({ error: 'Number and message are required!' });
    }

    const chatId = `${number}@c.us`; // Format for WhatsApp number

    try {
        await client.sendMessage(chatId, message);
        res.send({ status: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to send message!', details: error });
    }
});

app.get('/', (req, res) => {
    res.send('WhatsApp API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
