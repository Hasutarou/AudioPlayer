const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

// API для получения списка треков
app.get('/api/tracks', (req, res) => {
    const tracksDir = path.join(__dirname, 'tracks');

    fs.readdir(tracksDir, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка чтения папки' });
            return;
        }

        const mp3Files = files.filter(file => file.endsWith('.mp3'));
        res.json({ tracks: mp3Files });
    });
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});