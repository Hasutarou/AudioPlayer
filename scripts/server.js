const express = require('express');
const fs = require('fs');
const path = require('path');
const mmetadata = require('music-metadata');
const app = express();
const rootDir = path.join(__dirname, '..');

app.use(express.static(rootDir));

app.get('/api/tracks', async (req, res) => {
    const tracksDir = path.join(rootDir, 'tracks');
    try {
        const files = await fs.promises.readdir(tracksDir);
        const mp3Files = files.filter(file => file.endsWith('.mp3'));
        const tracks = [];
        for (const fileName of mp3Files) {
            const filePath = path.join(tracksDir, fileName);
            const encodedSrc = '/tracks/' + encodeURIComponent(fileName);
            try {
                const metadata = await mmetadata.parseFile(filePath);
                const common = metadata.common || {};
                let cover = null;
                if (common.picture && common.picture.length > 0) {
                    const pic = common.picture[0];
                    if (pic && pic.format && pic.data) {
                        cover = 'data:' + pic.format + ';base64,' + Buffer.from(pic.data).toString('base64');
                    }
                }
                tracks.push({
                    fileName: fileName,
                    src: encodedSrc,
                    title: common.title || fileName.replace(/\.mp3$/i, ''),
                    artist: common.artist || '',
                    album: common.album || '',
                    cover: cover
                });
            } catch (e) {
                tracks.push({
                    fileName: fileName,
                    src: encodedSrc,
                    title: fileName.replace(/\.mp3$/i, ''),
                    artist: '',
                    album: '',
                    cover: null
                });
            }
        }
        res.json({ tracks: tracks });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка чтения папки' });
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
