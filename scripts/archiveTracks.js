// scripts/library.js

async function loadLibrary() {
    const container = document.querySelector('.tracks-container');
    if (!container) return;

    const response = await fetch('/api/tracks');
    const { tracks } = await response.json();

    container.innerHTML = '';

    for (const track of tracks) {
        const audioResponse = await fetch(`tracks/${track}`);
        const blob = await audioResponse.blob();

        let coverUrl = 'media/covers/default.jpg';
        let trackName = track.replace('.mp3', '');

        // Извлекаем обложку через jsmediatags (глобальная переменная)
        await new Promise((resolve) => {
            window.jsmediatags.read(blob, {
                onSuccess: (tag) => {
                    if (tag.tags.title) {
                        trackName = tag.tags.title;  // ← замена названия
                    }

                    if (tag.tags.picture) {
                        const { data, format } = tag.tags.picture;
                        let base64 = '';
                        for (let i = 0; i < data.length; i++) {
                            base64 += String.fromCharCode(data[i]);
                        }
                        coverUrl = `data:${format};base64,${btoa(base64)}`;
                    }
                    resolve();
                },
                onError: () => resolve()
            });
        });

        const card = document.createElement('article');
        card.className = 'track-card';
        card.innerHTML = `
            <img class="track-card__image" src="${coverUrl}" alt="${trackName}">
            <footer class="track-card__content">
                <button type="button" class="track-card__play">
                    <svg class="player-controls__play-icon" viewBox="0 0 52.69 70.74">
                        <path d="M20.44,35.48l15.69,12.69V22.79l-15.69,12.69Zm32.25,28.98c0,3.47-3.47,6.28-7.75,6.28h-1.06c-.09,0-.19,0-.27,0-1.79,.05-3.6-.47-4.97-1.57L1.96,39.48C.58,38.38-.05,36.92,0,35.48c-.05-1.44,.58-2.9,1.95-4L37.44,2.77c1.38-1.67,3.75-2.77,6.43-2.77h1.06c4.28,0,7.75,2.81,7.75,6.27v58.19Zm-16.56-16.29V22.79l-15.69,12.69,15.69,12.69Z"/>
                    </svg>
                </button>
                <div class="track-card__title">${trackName}</div>
            </footer>
        `;

        container.appendChild(card);
    }
}

loadLibrary();