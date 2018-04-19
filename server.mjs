import express from 'express';

const {
    PORT = '8080',
} = process.env;

const storage = {
    general: [],
    random: [],
};

const app = express();

app.get('/channels', (_, res) => {
    const channels = Object.keys(storage);

    res.json({ channels });
});

app.get('/messages/:channel', (req, res) => {
    const { channel } = req.params;
    const messages = storage[messages];

    if (!messages) {
        return res.sendStatus(404);
    }

    res.json({ messages });
});

app.put('/:channel', express.json(), (req, res) => {
    const messages = storage[mesages];
    const { message } = req.body;

    if (!messages) {
        return res.sendStatus(403);
    }

    messages.push(message);
    res.sendStatus(201);
});

app.listen(PORT, _ => console.log(`Server is running on port ${PORT}`));
