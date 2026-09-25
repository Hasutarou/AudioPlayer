async function loadLibrary() {
    const container = document.querySelector('.tracks-container');
    if (!container) return;

    try {
        const response = await fetch('/api/tracks');
        const data = await response.json();
        const tracks = data.tracks || [];

        const trackItems = [];

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const fileName = typeof track === 'string' ? track : (track.fileName || '');
            const src = typeof track === 'string' ? 'tracks/' + encodeURIComponent(fileName) : (track.src || 'tracks/' + encodeURIComponent(fileName));
            let coverUrl = typeof track === 'object' ? (track.cover || 'media/logotype/logo-test.png') : 'media/logotype/logo-test.png';
            let title = typeof track === 'object' ? (track.title || fileName.replace(/\.mp3$/i, '')) : fileName.replace(/\.mp3$/i, '');
            let artist = typeof track === 'object' ? (track.artist || '') : '';
            let album = typeof track === 'object' ? (track.album || '') : '';

            trackItems.push({
                fileName: fileName,
                src: src,
                title: title,
                artist: artist,
                album: album,
                cover: coverUrl
            });

            const card = document.createElement('article');
            card.className = 'track-card';
            card.setAttribute('data-track-index', String(i));

            const img = document.createElement('img');
            img.className = 'track-card__image';
            img.src = coverUrl;
            img.alt = title;
            img.onerror = function() { this.src = 'media/logotype/logo-test.png'; };

            const footer = document.createElement('footer');
            footer.className = 'track-card__content';

            const playBtn = document.createElement('button');
            playBtn.type = 'button';
            playBtn.className = 'track-card__play';
            playBtn.setAttribute('data-track-index', String(i));
            playBtn.setAttribute('aria-label', 'Играть ' + title);

            const playSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            playSvg.setAttribute('class', 'player-controls__play-icon');
            playSvg.setAttribute('viewBox', '0 0 52.69 70.74');
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', 'M20.44,35.48l15.69,12.69V22.79l-15.69,12.69Zm32.25,28.98c0,3.47-3.47,6.28-7.75,6.28h-1.06c-.09,0-.19,0-.27,0-1.79,.05-3.6-.47-4.97-1.57L1.96,39.48C.58,38.38-.05,36.92,0,35.48c-.05-1.44,.58-2.9,1.95-4L37.44,2.77c1.38-1.67,3.75-2.77,6.43-2.77h1.06c4.28,0,7.75,2.81,7.75,6.27v58.19Zm-16.56-16.29V22.79l-15.69,12.69,15.69,12.69Z');
            playSvg.appendChild(pathEl);
            playBtn.appendChild(playSvg);

            playBtn.addEventListener('click', function() {
                window.dispatchEvent(new CustomEvent('player:play-track', { detail: { index: i } }));
            });

            footer.appendChild(playBtn);

            const titleDiv = document.createElement('div');
            titleDiv.className = 'track-card__title';
            titleDiv.textContent = title;
            footer.appendChild(titleDiv);

            card.appendChild(img);
            card.appendChild(footer);
            container.appendChild(card);
        }

        const collectionCard = container.querySelector('.track-card--collection');
        if (collectionCard) {
            container.appendChild(collectionCard);
        }

        if (container) {
            window.dispatchEvent(new CustomEvent('player:library-ready', { detail: { tracks: trackItems } }));
        }
    } catch (e) {
        window.dispatchEvent(new CustomEvent('player:library-ready', { detail: { tracks: [] } }));
    }
}

;(function() {
    var audio = new Audio();
    audio.preload = 'metadata';
    var tracks = [];
    var currentIndex = -1;
    var pendingIndex = null;
    var playBtnEl = document.querySelector('.player-controls__play');
    var prevBtnEl = document.querySelector('.player-controls__prev');
    var nextBtnEl = document.querySelector('.player-controls__next');
    var progressBarEl = document.querySelector('.player-controls__progress-bar');
    var timeCurrentEl = document.querySelector('.player-controls__time-current');
    var timeEndEl = document.querySelector('.player-controls__time-end');
    var coverImgEl = document.querySelector('.track-metadata__img');
    var captionEl = document.querySelector('.track-metadata__caption');
    var trackTitleEl = document.querySelector('.player-controls__track-title');
    var trackArtistEl = document.querySelector('.player-controls__track-artist');
    var trackAlbumEl = document.querySelector('.player-controls__track-album');

    function formatTime(s) {
        if (!isFinite(s)) return '0:00';
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return String(m) + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function setActiveCard(idx, on) {
        var cards = document.querySelectorAll('.track-card');
        for (var ci = 0; ci < cards.length; ci++) {
            var c = cards[ci];
            if (c.getAttribute('data-track-index') === String(idx)) {
                c.classList.add('track-card--active');
                var pb = c.querySelector('.track-card__play');
                if (pb) {
                    pb.setAttribute('aria-pressed', String(on));
                    pb.setAttribute('aria-label', on ? 'Пауза' : 'Играть ' + (tracks[parseInt(c.getAttribute('data-track-index'))] ? (tracks[parseInt(c.getAttribute('data-track-index'))].title || '') : ''));
                }
            } else {
                c.classList.remove('track-card--active');
                var pb2 = c.querySelector('.track-card__play');
                if (pb2) {
                    pb2.setAttribute('aria-pressed', 'false');
                    pb2.setAttribute('aria-label', 'Играть ' + (tracks[parseInt(c.getAttribute('data-track-index'))] ? (tracks[parseInt(c.getAttribute('data-track-index'))].title || '') : ''));
                }
            }
        }
    }

    function updateAria(on) {
        if (playBtnEl) {
            playBtnEl.setAttribute('aria-label', on ? 'Пауза' : 'Играть');
            playBtnEl.setAttribute('aria-pressed', String(on));
            playBtnEl.classList.toggle('player-controls__play--paused', !on);
        }
        if (currentIndex >= 0 && currentIndex < tracks.length) {
            setActiveCard(currentIndex, on);
        }
    }

    function updateTrackInfo(t) {
        if (coverImgEl && t) {
            coverImgEl.src = t.cover || 'media/logotype/logo-test.png';
            coverImgEl.alt = t.title || 'Обложка';
            coverImgEl.onerror = function() { this.src = 'media/logotype/logo-test.png'; };
        }
        if (captionEl && t) {
            captionEl.textContent = t.title || t.fileName.replace(/\.mp3$/i, '');
        }
        if (trackTitleEl) {
            trackTitleEl.textContent = t && t.title ? t.title : 'Название трека';
        }
        if (trackArtistEl) {
            trackArtistEl.textContent = t && t.artist ? t.artist : 'Исполнитель';
        }
        if (trackAlbumEl) {
            trackAlbumEl.textContent = t && t.album ? t.album : 'Альбом';
        }
    }

    function loadTrack(idx, shouldPlay) {
        if (shouldPlay === undefined) shouldPlay = true;
        if (!isFinite(idx) || idx < 0 || idx >= tracks.length) return;
        currentIndex = idx;
        var t = tracks[idx];
        if (!t) return;
        updateTrackInfo(t);
        if (audio.getAttribute('src') !== t.src) {
            audio.pause();
            audio.src = t.src;
        }
        setActiveCard(idx, false);
        if (progressBarEl) {
            progressBarEl.value = 0;
            progressBarEl.max = 0;
        }
        if (timeCurrentEl) timeCurrentEl.textContent = '0:00';
        if (timeEndEl) timeEndEl.textContent = '0:00';
        if (shouldPlay) {
            audio.play().catch(function() {});
        }
    }

    audio.addEventListener('play', function() {
        updateAria(true);
    });

    audio.addEventListener('pause', function() {
        updateAria(false);
    });

    audio.addEventListener('loadedmetadata', function() {
        if (progressBarEl && isFinite(audio.duration)) {
            progressBarEl.max = audio.duration;
        }
        if (timeEndEl) {
            timeEndEl.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('timeupdate', function() {
        if (progressBarEl && isFinite(audio.duration)) {
            progressBarEl.value = audio.currentTime;
        }
        if (timeCurrentEl) {
            timeCurrentEl.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('ended', function() {
        if (tracks.length === 0) return;
        var nextIdx = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
        loadTrack(nextIdx);
    });

    if (playBtnEl) {
        playBtnEl.addEventListener('click', function() {
            if (tracks.length === 0) return;
            if (currentIndex < 0) {
                loadTrack(0, true);
                return;
            }
            if (audio.paused) {
                audio.play().catch(function() {});
            } else {
                audio.pause();
            }
        });
    }

    if (prevBtnEl) {
        prevBtnEl.addEventListener('click', function() {
            if (tracks.length === 0) return;
            var prevIdx = currentIndex < 0 ? 0 : (currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1);
            loadTrack(prevIdx);
        });
    }

    if (nextBtnEl) {
        nextBtnEl.addEventListener('click', function() {
            if (tracks.length === 0) return;
            var nextIdx = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
            loadTrack(nextIdx);
        });
    }

    if (progressBarEl) {
        progressBarEl.addEventListener('input', function(e) {
            e.stopPropagation();
        });
        progressBarEl.addEventListener('change', function() {
            if (isFinite(audio.duration)) {
                audio.currentTime = progressBarEl.value;
            }
        });
        progressBarEl.addEventListener('click', function(e) {
            if (!isFinite(audio.duration) || !progressBarEl.getBoundingClientRect().width) return;
            var rect = progressBarEl.getBoundingClientRect();
            var ratio = (e.clientX - rect.left) / rect.width;
            ratio = Math.max(0, Math.min(1, ratio));
            audio.currentTime = ratio * audio.duration;
        });
        progressBarEl.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (isFinite(audio.duration)) audio.currentTime = Math.max(0, audio.currentTime - 5);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (isFinite(audio.duration)) audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
            } else if (e.key === 'Home') {
                e.preventDefault();
                if (isFinite(audio.duration)) audio.currentTime = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                if (isFinite(audio.duration)) audio.currentTime = audio.duration;
            }
        });
    }

    window.addEventListener('player:library-ready', function(e) {
        tracks = e.detail.tracks || [];
        if (pendingIndex !== null) {
            loadTrack(pendingIndex, true);
            pendingIndex = null;
        } else if (tracks.length > 0) {
            loadTrack(0, false);
        }
    });

    window.addEventListener('player:play-track', function(e) {
        var idx = e.detail.index;
        if (tracks.length > 0 && isFinite(idx)) {
            if (idx >= 0 && idx < tracks.length) {
                loadTrack(idx, true);
            }
        } else {
            pendingIndex = idx;
        }
    });
})();

loadLibrary();