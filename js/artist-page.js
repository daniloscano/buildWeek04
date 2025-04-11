const ARTIST_API = 'https://striveschool-api.herokuapp.com/api/deezer/artist';
const MUSIC_API = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=';
const params = new URLSearchParams(location.search);
const artistNameParam = params.get('artist');
const id = params.get('id');

const artistContainer = document.getElementById('artistContainer');
const hidePopularButton = document.querySelector('.hide-popular-songs');
const firstPopularContainer = document.getElementById('firstPopularCtn');
const secondPopularContainer = document.getElementById('secondPopularCtn');

hidePopularButton.addEventListener('click', () => {
    const isTextShowLess = hidePopularButton.innerHTML === 'Show less';

    if (isTextShowLess) {
        hidePopularButton.innerHTML = 'See more';
        secondPopularContainer.classList.add('visually-hidden');
    } else {
        hidePopularButton.innerHTML = 'Show less';
        secondPopularContainer.classList.remove('visually-hidden');
    }
});

const getArtist = async () => {
    try {
        const response = await fetch(`${ARTIST_API}/${id}`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
};

const generateArtistHeader = data => {
    const { nb_fan: listeners, picture_xl: image } = data;

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
    artistName.innerText = artistNameParam;

    const monthlyListeners = document.createElement('p');
    monthlyListeners.setAttribute('class', 'monthly-listeners');
    monthlyListeners.innerText = `${listeners} monthly listeners`;

    detailsContainer.append(verified, artistName, monthlyListeners);
    coverContainer.append(cover, detailsContainer);
    artistContainer.prepend(coverContainer);
};

getArtist().then(results => generateArtistHeader(results));
getArtist().then(results => console.log(results));

// GENERATE TRACKLIST
const getArtistTracklist = async () => {
    try {
        const response = await fetch(`${MUSIC_API}${artistNameParam}`);
        return response.json();
    } catch (error) {
        console.log(error);
    }
};

const songDuration = time => {
    const minutes = Math.trunc(time / 60);
    const seconds = String(Math.trunc(time % 60)).padStart(2, 0);

    return `${minutes}:${seconds}`;
};

const generateFavoriteSongButton = () => {
    const plusIcon = '<i class="bi bi-plus-circle"></i>';
    const favoriteIcon = '<i class="bi bi-check-circle-fill added-icon"></i>';

    const icon = document.createElement('div');
    icon.setAttribute('class', 'plus-icon');
    icon.innerHTML = plusIcon;

    icon.addEventListener('click', () => {
        if (icon.innerHTML === favoriteIcon) {
            icon.innerHTML = plusIcon;
            icon.classList.remove('favorite');
        } else {
            icon.innerHTML = favoriteIcon;
            icon.classList.add('favorite');
        }
    });

    return icon;
};

const generateDropdownMenu = () => {
    const icon = document.createElement('i');
    icon.setAttribute('data-bs-toggle', 'dropdown');
    icon.setAttribute('class', 'bi bi-three-dots dots-icon dropdown');

    const ul = document.createElement('ul');
    ul.setAttribute('class', 'dropdown-menu');

    dropdownItems.forEach((item, i) => {
        const li = document.createElement('li');

        const a = document.createElement('a');
        a.href = '#';
        a.setAttribute('class', 'dropdown-item fst-normal');
        a.innerHTML = `<span>${dropdownIcons[i]}${item}</span>`;

        li.appendChild(a);
        ul.appendChild(li);
    });

    icon.appendChild(ul);
    return icon;
};

const generatePopularSongs = (data, i, appender) => {
    const { cover_big: cover, title } = data.album;
    const time = songDuration(data.duration);
    const plusIcon = generateFavoriteSongButton();
    const dropdownMenu = generateDropdownMenu();

    const listContainer = document.createElement('ul');
    listContainer.setAttribute('class', 'tracklist-container mb-0');

    const li = document.createElement('li');
    li.setAttribute('class', 'tracklist');
    document.addEventListener('click', e => {
        const isTargetTracklist = e.target === li;
        const isTargetOutsideTracklist = e.target !== li;
        const isTargetDropdown = e.target === dropdownMenu;

        if (isTargetTracklist || isTargetDropdown) {
            li.classList.add('bg-lighter');
            plusIcon.classList.add('show-icon');
            dropdownMenu.classList.add('show-icon');
        } else if (isTargetOutsideTracklist) {
            li.classList.remove('bg-lighter');
            plusIcon.classList.remove('show-icon');
            dropdownMenu.classList.remove('show-icon');
        }
    });

    const number = document.createElement('p');
    number.setAttribute('class', 'song-number mb-0');
    number.innerHTML = i.padStart(2, 0);

    const albumCover = document.createElement('img');
    albumCover.setAttribute('class', 'album-cover');
    albumCover.src = cover;
    albumCover.alt = title;

    const songTitle = document.createElement('a');
    songTitle.setAttribute('class', 'song-title');
    songTitle.innerText = title;

    const duration = document.createElement('p');
    duration.setAttribute('class', 'song-duration mb-0');
    duration.innerText = time;

    duration.prepend(plusIcon);
    duration.appendChild(dropdownMenu);
    li.append(number, albumCover, songTitle, duration);
    listContainer.appendChild(li);

    appender.appendChild(listContainer);
};

getArtistTracklist().then(results => {
    results.data.slice(0, 5).forEach((result, i) => {
        generatePopularSongs(result, `${i + 1}`, firstPopularContainer);
    });
    results.data.slice(5, 10).forEach((result, i) => {
        generatePopularSongs(result, `${i + 6}`, secondPopularContainer);
    });
});
