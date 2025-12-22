let left, bio;
let lastKnownScrollPosition = 0;
let ticking = false;

window.onload = function (){
    // left = document.querySelector(".left");
    // bio = document.createElement("img");
    // bio.src = "../img/avatar.gif";
    // bio.alt = "bio";
    // left.appendChild(bio);

    // document.addEventListener("scroll", (event) => {
    //     lastKnownScrollPosition = window.scrollY;
    //
    //     if (!ticking) {
    //         window.requestAnimationFrame(() => {
    //             doSomething(lastKnownScrollPosition);
    //             ticking = false;
    //         });
    //
    //         ticking = true;
    //     }
    // });
}

function doSomething(scrollPos) {
    left.style.display = scrollPos > 0 ? "none" : "block";
}

