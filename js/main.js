const MUSIC_API = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=';

const artistContainer = document.getElementById('artistContainer');

const getMusic = async artist => {
    try {
        const response = await fetch(`${MUSIC_API}${artist}`);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

const generatePopularArtist = data => {
    const { name, picture } = data.artist;
    const { id } = data;

    const slide = document.createElement('div');
    slide.setAttribute('class', 'swiper-slide');

    const a = document.createElement('a');
    a.setAttribute('class', 'artist-link');
    a.href = `./artist-page.html?id=${id}&artist=${name}`;

    const albumCover = document.createElement('div');
    albumCover.setAttribute('class', 'position-relative');

    const cover = document.createElement('img');
    cover.setAttribute('class', 'img-fluid rounded-circle');
    cover.src = picture;
    cover.alt = name;

    const playButton = document.createElement('button');
    playButton.setAttribute('class', 'play-btn');
    playButton.innerHTML = '<i class="bi bi-play-fill"></i>';

    albumCover.append(cover, playButton);

    const artistName = document.createElement('p');
    artistName.innerHTML = name;

    const category = document.createElement('small');
    category.innerText = 'Artist';

    a.append(albumCover, artistName, category);
    slide.appendChild(a);
    artistContainer.appendChild(slide);
};

getMusic('metallica').then(results => generatePopularArtist(results.data[0]));
getMusic('u2').then(results => generatePopularArtist(results.data[0]));
getMusic('johncoltrane').then(results =>
    generatePopularArtist(results.data[0])
);
getMusic('tycho').then(results => generatePopularArtist(results.data[0]));
getMusic('queen').then(results => generatePopularArtist(results.data[0]));
getMusic('thebrothersnylon').then(results =>
    generatePopularArtist(results.data[0])
);

getMusic('metallica').then(results => console.log(results.data));
