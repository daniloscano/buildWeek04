const ENDPOINT = 'https://striveschool-api.herokuapp.com/api/deezer/artist';
const params = new URLSearchParams(location.search);
const id = params.get('id');

const artistContainer = document.getElementById('artistContainer');

const getArtist = async () => {
    try {
        const response = await fetch(`${ENDPOINT}/${79126582}`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
};

const generateArtistHeader = data => {
    const { name, nb_fan: listeners, picture_xl: image } = data;

    const coverContainer = document.createElement('header');
    coverContainer.setAttribute('class', 'position-relative border rounded-3');

    const cover = document.createElement('img');
    cover.setAttribute('class', 'artist-cover');
    cover.src = image;

    const detailsContainer = document.createElement('div');
    detailsContainer.setAttribute('class', 'artist-details-container');

    const verified = document.createElement('p');
    verified.setAttribute('class', 'verified');
    verified.innerHTML = `${verifiedIcon} Verified Artist`;

    const artistName = document.createElement('h1');
    artistName.setAttribute('class', 'artist-name');
    artistName.innerText = name;

    const monthlyListeners = document.createElement('p');
    monthlyListeners.setAttribute('class', 'monthly-listeners');
    monthlyListeners.innerText = `${listeners} monthly listeners`;

    detailsContainer.append(verified, artistName, monthlyListeners);
    coverContainer.append(cover, detailsContainer);
    artistContainer.prepend(coverContainer);
};

getArtist().then(results => generateArtistHeader(results));

getArtist().then(results => console.log(results));
