let typedInstance = null;
let swiperInstance = null;

async function renderHome() {
    if (!main) return;

    const raw = await fetchHtmlAsText("/portfolio/home.html");
    const content = htmlToFragment(raw);

    main.replaceChildren(content);
    playMainAnimation();

    initHomeEffects();
}

function initHomeEffects() {
    const typedEl = document.querySelector("#typed");
    const stringsEl = document.querySelector("#typed-desc");
    const swiper = document.querySelector(".marquee");

    if (!typedEl || !stringsEl || typeof Typed === "undefined") return;

    if (typedInstance) typedInstance.destroy();

    typedInstance = new Typed("#typed", {
        stringsElement: "#typed-desc",
        typeSpeed: 50,
        loop: true,
        loopCount: Infinity,
    });

    if (!swiper || typeof Swiper === "undefined") return;
    if (swiperInstance) swiperInstance.destroy();
    swiperInstance = new Swiper(".marquee", {
        slidesPerView: 'auto',
        loop: true,
        speed: 5000,
        allowTouchMove: false,
        autoplay: {
            delay: 0,
            disableOnInteraction: false
        }
    });
}

function destroyHomeEffects() {
    if (typedInstance) {
        typedInstance.destroy();
        typedInstance = null;
    }
    if (swiperInstance) {
        swiperInstance.destroy();
        swiperInstance = null;
    }
}
