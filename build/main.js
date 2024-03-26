"use strict";
(async () => {
    const MUTEX = new Map();
    const sleep = (ms) => new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
    let geoip;
    const geo = async () => {
        if (MUTEX.get(geo))
            return;
        MUTEX.set(geo, true);
        try {
            geoip =
                geoip ??
                    (await (await fetch('https://malus.carapax.net/geoip.json')).json());
        }
        catch { }
        MUTEX.set(geo, false);
    };
    const proxied = () => geoip?.country?.iso_code === 'CN';
    const vibe = () => navigator?.vibrate?.(1);
    let booster = () => { };
    const audioURL = `https://kexp.streamguys1.com/${(() => {
        switch (new URLSearchParams(location.search).get('format')?.toLowerCase()) {
            case 'aac':
            case 'aache':
            case 'aac-he':
            case 'aac_he': {
                return 'kexp64.aac';
            }
            case 'aaclc':
            case 'aac-lc':
            case 'aac_lc': {
                return 'kexp160.aac';
            }
            case 'mp3-128':
            case 'mp3_128':
            case '128': {
                return 'kexp128.mp3';
            }
            case 'mp3':
            case 'mp3-320':
            case 'mp3_320':
            case '320': {
                return 'kexp320.mp3';
            }
            default: {
                return navigator?.connection?.saveData
                    ? 'kexp64.aac'
                    : 'kexp320.mp3';
            }
        }
    })()}`;
    let audio;
    const play = async () => {
        if (MUTEX.get(play))
            return;
        MUTEX.set(play, true);
        try {
            audio = audio ?? new Audio(audioURL);
            await audio.play();
            $init.remove();
        }
        catch {
            audio = null;
        }
        MUTEX.set(play, false);
    };
    const { body, head } = document;
    const $style = document.createElement('style');
    head.append($style);
    const $cover = document.createElement('img');
    const $info = document.createElement('div');
    const $init = document.createElement('div');
    body.append($cover, $info, $init);
    const $show = document.createElement('div');
    const $artist = document.createElement('div');
    const $song = document.createElement('div');
    const $album = document.createElement('div');
    const $label = document.createElement('div');
    const $release = document.createElement('div');
    const $comment = document.createElement('div');
    const $tagline = document.createElement('div');
    const $type = document.createElement('div');
    $info.append($show, $artist, $song, $album, $label, $release, $comment, $tagline, $type);
    $style.sheet?.insertRule('* { box-sizing: border-box; }');
    $style.sheet?.insertRule('@media (orientation: landscape) { body { flex-direction: row; justify-content: space-evenly; } }');
    $style.sheet?.insertRule('@media (orientation: portrait) { body { flex-direction: column; justify-content: center; } }');
    body.style.margin = '0px';
    body.style.minHeight = '100vh';
    body.style.display = 'flex';
    body.style.alignItems = 'center';
    body.style.backgroundPosition = 'center';
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundColor = 'black';
    body.style.backdropFilter = 'blur(16px) brightness(0.5)';
    body.style.color = 'white';
    body.style.fontFamily = 'monospace';
    body.style.textAlign = 'center';
    body.style.lineHeight = '1.5';
    body.style.padding = '10px';
    body.style.gap = '8px';
    body.style.overflowX = 'hidden';
    $cover.style.maxWidth = 'min(calc(100vw - 20px), calc(100vh - 20px))';
    $cover.style.maxHeight = 'min(calc(100vw - 20px), calc(100vh - 20px))';
    $cover.style.aspectRatio = '1 / 1';
    $cover.style.objectFit = 'cover';
    $info.style.overflowWrap = 'anywhere';
    $show.style.fontSize = 'smaller';
    $artist.style.fontWeight = 'bold';
    $song.style.fontStyle = 'italic';
    $song.style.fontWeight = 'bold';
    $album.style.fontStyle = 'italic';
    $label.style.fontSize = 'x-small';
    $release.style.fontSize = 'x-small';
    $comment.style.fontSize = 'xx-small';
    $tagline.style.fontSize = 'xx-small';
    $type.style.fontSize = 'xx-small';
    $type.style.opacity = '0.5';
    $init.textContent = '▶️';
    $init.style.display = 'flex';
    $init.style.justifyContent = 'center';
    $init.style.alignItems = 'center';
    $init.style.position = 'fixed';
    $init.style.top = '0px';
    $init.style.right = '0px';
    $init.style.bottom = '0px';
    $init.style.left = '0px';
    $init.style.background = 'rgba(0, 0, 0, 0.5)';
    $init.style.overflow = 'hidden';
    $init.style.userSelect = 'none';
    $init.style.pointerEvents = 'none';
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            booster();
        }
    });
    body.addEventListener('click', () => {
        booster();
        vibe();
        play();
    });
    for (let boost;; boost = new Promise((resolve) => {
        booster = resolve;
    }),
        await Promise.race([sleep(30000), boost])) {
        try {
            geo();
            const play = (await (await fetch(`https://api.kexp.org/v2/plays/?expand=show&format=json&limit=1&ordering=-airdate&airdate_before=${new Date().toISOString()}`)).json())?.results?.[0];
            if (!play)
                throw new Error('nil');
            const imageURL = play.image_uri || play.thumbnail_uri || play.show?.image_uri;
            const url = imageURL && proxied()
                ? `https://malus.carapax.net/x?${new URLSearchParams({
                    url: imageURL,
                })}`
                : imageURL;
            body.style.backgroundImage = `url(${url})`;
            $cover.src = `${url}`;
            $show.textContent = play.show
                ? `${play.show.program_name ?? ''}${play.show.host_names?.length
                    ? ` with ${play.show.host_names.join(' & ')}`
                    : ''}`
                : null;
            $artist.textContent = play.artist ?? null;
            $song.textContent = play.song ?? null;
            $album.textContent = play.album ?? null;
            $label.textContent = play.labels?.join(' & ') ?? null;
            $release.textContent = play.release_date ?? null;
            $comment.textContent = play.comment ?? null;
            $tagline.textContent = play.show?.tagline ?? null;
            $type.textContent = play.play_type ?? null;
        }
        catch {
            await sleep(1000);
            continue;
        }
    }
})();
//# sourceMappingURL=main.js.map