const pageTitle = document.querySelector('title');

const albumSection = {
    content: document.getElementById('album-details'),
    loader: document.getElementById('album-details-loader'),
    error: document.getElementById('album-details-error'),
    recordType: document.getElementById('record-type'),
    albumCover: document.querySelector('.album-cover'),
    title: document.getElementById('album-title'),
    artistImg: document.getElementById('artist-cover'),
    artistName: document.getElementById('artist-name'),
    mainDetails: document.getElementById('main-details'),
    tracklist: document.getElementById('tracklist'),
    songs: document.getElementById('songs')
};

const ALBUM_ENDPOINT = 'https://striveschool-api.herokuapp.com/api/deezer/album/'; // dark side of the moon

const albumId = '12114240';

const getAlbumById = async (albumId) => {
    loadingHandler(albumSection.loader, albumSection.content);
    try {
        const response = await fetch(`${ALBUM_ENDPOINT}${albumId}`);
        return await response.json();
    } catch (error) {
        throw new Error('Impossibile recuperare le informazioni richieste! Riprovare più tardi.')
    } finally {
        loadingHandler(albumSection.loader, albumSection.content);
    }
};

const renderAlbumDetails = (album) => {
    const { record_type, id, cover_medium: albumCover, title, release_date: released, nb_tracks: tracksNum, duration } = album;
    const { id: artistId, name: artistName, picture_small: artistImage } = album.artist;

    const formattedDuration = `${parseInt(duration / 60)} min ${duration - parseInt(duration/60) * 60} sec.`;
    
    const mainDetails = [
        released.slice(0, 4),
        (tracksNum === 1) ? `${tracksNum} brano` : `${tracksNum} brani`
    ];

    albumSection.recordType.innerText = record_type[0].toUpperCase() + record_type.slice(1);
    albumSection.albumCover.src = albumCover;
    albumSection.title.innerText = title;
    albumSection.artistImg.src = artistImage;
    albumSection.artistName.textContent = artistName;
    albumSection.mainDetails.innerHTML = mainDetails.map(detail => `&#183; ${detail}`) + ` ${formattedDuration}`;
};

const renderTracklist = (track, index) => {
    const { title, link, duration, explicit_lyrics: explicit } = track;
    const { name: artistName, tracklist: artistLink  } = track.artist

    const formattedDuration = `${parseInt(duration / 60)}:${String(duration - parseInt(duration/60) * 60).padStart(2, '0')}`;

    const tr = document.createElement('tr');
    tr.setAttribute('class', 'align-middle');

    const th = document.createElement('th');
    th.setAttribute('scope', 'row');
    th.innerText = index+1;

    const trackTd = document.createElement('td');
    const trackLink = document.createElement('a');
    trackLink.setAttribute('class', 'd-block');
    trackLink.href = link;
    trackLink.innerText = title;

    const trackInfo = document.createElement('a');
    trackInfo.setAttribute('class', 'track-artist');
    trackInfo.href = artistLink;
    const explicitBadge = (explicit) ? `<i class="bi bi-explicit-fill"></i>` : '';
    trackInfo.innerHTML = `${explicitBadge} ${artistName}`;

    trackTd.append(trackLink, trackInfo);

    const durationTd = document.createElement('td');
    durationTd.setAttribute('class', 'text-end duration-text');
    durationTd.innerText = formattedDuration;
    
    tr.append(th, trackTd, durationTd);
    songs.appendChild(tr);
};

const errorHandler = (alert, content, error) => {
    alert.classList.toggle('d-none');
    content.classList.toggle('d-none');
    alert.textContent = error.message;
};

const loadingHandler = (loader, content) => {
    loader.classList.toggle('d-flex');
    loader.classList.toggle('d-none');
    content.classList.toggle('d-none');
};

getAlbumById(albumId)
    .then((album) => {
        renderAlbumDetails(album);
        const songs = album.tracks.data;
        songs.forEach((song, index) => renderTracklist(song, index));
    })
    .catch(error => errorHandler(albumSection.error, albumSection.content, error));
