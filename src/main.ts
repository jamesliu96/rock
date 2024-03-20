type Optional<T> = {
  [P in keyof T]?: T[P] | null;
};

type Play = Optional<{
  next: string;
  previous: string;
  results: Optional<{
    id: number;
    uri: string;
    airdate: string;
    show: Optional<{
      id: number;
      uri: string;
      program: number;
      program_uri: string;
      hosts: number[];
      host_uris: string[];
      program_name: string;
      program_tags: string;
      host_names: string[];
      tagline: string;
      image_uri: string;
      start_time: string;
    }>;
    show_uri: string;
    image_uri: string;
    thumbnail_uri: string;
    song: string;
    track_id: string;
    recording_id: string;
    artist: string;
    artist_ids: string[];
    album: string;
    release_id: string;
    release_group_id: string;
    labels: string[];
    label_ids: string[];
    release_date: string;
    rotation_status: string;
    is_local: boolean;
    is_request: boolean;
    is_live: boolean;
    comment: string;
    play_type: string;
  }>[];
}>;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const main = async () => {
  let booster = () => {};
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      booster();
    }
  });
  const { body, head } = document;
  body.addEventListener('click', () => {
    booster();
  });
  let path: string;
  switch (new URLSearchParams(location.search).get('format')?.toLowerCase()) {
    case 'aac':
    case 'aache':
    case 'aac-he':
    case 'aac_he': {
      path = 'kexp64.aac';
      break;
    }
    case 'aaclc':
    case 'aac-lc':
    case 'aac_lc': {
      path = 'kexp160.aac';
      break;
    }
    case 'mp3-128':
    case 'mp3_128':
    case '128': {
      path = 'kexp128.mp3';
      break;
    }
    case 'mp3':
    case 'mp3-320':
    case 'mp3_320':
    case '320': {
      path = 'kexp320.mp3';
      break;
    }
    default: {
      path = (
        navigator as typeof navigator & { connection?: { saveData?: boolean } }
      ).connection?.saveData
        ? 'kexp64.aac'
        : 'kexp320.mp3';
      break;
    }
  }
  body.style.margin = '0px';
  body.style.minHeight = '100vh';
  body.style.display = 'flex';
  body.style.flexDirection = 'column';
  body.style.justifyContent = 'center';
  body.style.alignItems = 'center';
  body.style.backgroundPosition = 'center';
  body.style.backgroundSize = 'cover';
  body.style.backgroundRepeat = 'no-repeat';
  body.style.backdropFilter = 'blur(16px) brightness(0.5)';
  body.style.color = 'white';
  body.style.fontFamily = 'monospace';
  body.style.textAlign = 'center';
  body.style.lineHeight = '1.5';
  body.style.padding = '10px';
  const $style = document.createElement('style');
  head.append($style);
  $style.sheet?.insertRule('* { box-sizing: border-box; }');
  const $cover = document.createElement('img');
  const $show = document.createElement('div');
  const $artist = document.createElement('div');
  const $song = document.createElement('div');
  const $album = document.createElement('div');
  const $label = document.createElement('div');
  const $release = document.createElement('div');
  const $comment = document.createElement('div');
  const $tagline = document.createElement('div');
  const $type = document.createElement('div');
  body.append(
    $cover,
    $show,
    $artist,
    $song,
    $album,
    $label,
    $release,
    $comment,
    $tagline,
    $type
  );
  $cover.style.border = '1px solid #ccc';
  $cover.style.maxWidth = '100%';
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
  const $init = document.createElement('div');
  body.append($init);
  $init.textContent = '⏵';
  $init.style.width = '100%';
  $init.style.height = '100%';
  $init.style.display = 'flex';
  $init.style.justifyContent = 'center';
  $init.style.alignItems = 'center';
  $init.style.position = 'fixed';
  $init.style.top = '0px';
  $init.style.left = '0px';
  $init.style.fontSize = 'calc(min(100vw, 100vh))';
  $init.style.lineHeight = '1';
  $init.style.background = 'rgb(0 0 0 / 50%)';
  $init.style.overflow = 'hidden';
  $init.style.userSelect = 'none';
  $init.style.pointerEvents = 'none';
  const handle = () => {
    body.removeEventListener('click', handle);
    $init.remove();
    new Audio(`https://kexp.streamguys1.com/${path}`).play();
  };
  body.addEventListener('click', handle);
  for (
    let boost: Promise<void>;
    ;
    boost = new Promise<void>((resolve) => {
      booster = resolve;
    }),
      await Promise.race([sleep(30000), boost])
  ) {
    const play = (
      (await (
        await fetch(
          `https://api.kexp.org/v2/plays/?expand=show&format=json&limit=1&ordering=-airdate&airdate_before=${new Date().toISOString()}`
        )
      ).json()) as Play | undefined
    )?.results?.[0];
    if (!play) return;
    const url = play.image_uri || play.thumbnail_uri || play.show?.image_uri;
    body.style.backgroundImage = `url(${url})`;
    $cover.src = `${url}`;
    const hosts = play.show?.host_names?.join(' & ');
    $show.textContent = `${play.show?.program_name ?? ''}${
      hosts ? ` with ${hosts}` : ''
    }`;
    $artist.textContent = play.artist ?? '';
    $song.textContent = play.song ?? '';
    $album.textContent = play.album ?? '';
    $label.textContent = play.labels?.join(' & ') ?? '';
    $release.textContent = play.release_date ?? '';
    $comment.textContent = play.comment ?? '';
    $tagline.textContent = play.show?.tagline ?? '';
    $type.textContent = play.play_type ?? '';
  }
};

main();
