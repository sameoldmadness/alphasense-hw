import express from 'express';
import path from 'path';

const {
    PORT = '8080',
} = process.env;

const storage = {
    general: [],
    random: [],
};

const app = express();

app.get('/api/channels', (_, res) => {
    const channels = Object.keys(storage);

    res.json({ channels });
});

app.get('/api/messages/:channel', (req, res) => {
    const { channel } = req.params;
    const messages = storage[messages];

    if (!messages) {
        return res.sendStatus(404);
    }

    res.json({ messages });
});

// TODO: this one should be POST
app.put('/api/:channel', express.json(), (req, res) => {
    const messages = storage[mesages];
    const { message } = req.body;

    if (!messages) {
        return res.sendStatus(403);
    }

    messages.push(message);
    res.sendStatus(201);
});

app.use(express.static('dist'));
app.get('/*', (_, res) => res.sendFile(path.resolve('./dist/index.html')));

app.listen(PORT, _ => console.log(`Server is running on port ${PORT}`));
