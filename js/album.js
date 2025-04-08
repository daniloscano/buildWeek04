const pageTitle = document.querySelector('title');

const albumSection = {
    recordType: document.getElementById('record-type'),
    albumCover: document.querySelector('.album-cover'),
    title: document.getElementById('album-title'),
    artistImg: document.getElementById('artist-cover'),
    artistName: document.getElementById('artist-name'),
    mainDetails: document.getElementById('main-details'),
    tracklist: document.getElementById('tracklist'),
    songs: document.getElementById('songs')
};

const ALBUM_ENDPOINT = 'https://striveschool-api.herokuapp.com/api/deezer/album/'; // wish you were here

const albumId = '12114242';

const getAlbumById = async (albumId) => {
    try {
        const response = await fetch(`${ALBUM_ENDPOINT}${albumId}`);
        return await response.json();
    } catch (error) {
        console.log(error)
    }
};

const renderAlbumDetails = (album) => {
    const { record_type, id, cover_medium: albumCover, title, release_date: released, nb_tracks: tracksNum, duration } = album;
    const { id: artistId, name: artistName, picture_small: artistImage } = album.artist;

    const formattedDuration = `${parseInt(duration / 60)} min ${duration - parseInt(duration/60) * 60} sec.`;
    
    const mainDetails = [
        released.slice(0, 4),
        (tracksNum === 1) ? `${tracksNum} brano` : `${tracksNum} brani`,
        formattedDuration
    ];

    albumSection.recordType.innerText = record_type[0].toUpperCase() + record_type.slice(1);
    albumSection.albumCover.src = albumCover;
    albumSection.title.innerText = title;
    albumSection.artistImg.src = artistImage;
    albumSection.artistName.textContent = artistName;
    albumSection.mainDetails.textContent = mainDetails.join(' - ');
};

const renderTracklist = (track, index) => {
    const { title, link, duration, explicit_lyrics: explicit } = track;
    const { name: artistName, tracklist: artistLink  } = track.artist

    const formattedDuration = `${parseInt(duration / 60)}:${String(duration - parseInt(duration/60) * 60).padStart(2, '0')}`;

    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.setAttribute('scope', 'row');
    th.innerText = index+1;

    const trackTd = document.createElement('td');
    const trackLink = document.createElement('a');
    trackLink.setAttribute('class', 'd-block');
    trackLink.href = link;
    trackLink.innerText = title;

    const trackInfo = document.createElement('a');
    trackInfo.href = artistLink;
    const explicitBadge = (explicit) ? `<i class="bi bi-explicit-fill"></i>` : '';
    trackInfo.innerHTML = `${explicitBadge} ${artistName}`;

    trackTd.append(trackLink, trackInfo);

    const durationTd = document.createElement('td');
    durationTd.setAttribute('class', 'text-end');
    durationTd.innerText = formattedDuration;
    
    tr.append(th, trackTd, durationTd);
    songs.appendChild(tr);
};

getAlbumById(albumId)
    .then((album) => {
        renderAlbumDetails(album);
        const songs = album.tracks.data;
        songs.forEach((song, index) => renderTracklist(song, index));
    });
