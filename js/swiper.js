const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 0,

    breakpoints: {
        768: {
            slidesPerView: 3,
            spaceBetween: 0,
        },
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
