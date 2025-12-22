let right, bio;
let lastKnownScrollPosition = 0;
let ticking = false;

window.onload = function (){
    right = document.querySelector(".right");
    bio = document.createElement("img");
    bio.src = "../img/bio.jpeg";
    bio.alt = "bio";
    right.appendChild(bio);

    document.addEventListener("scroll", (event) => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                doSomething(lastKnownScrollPosition);
                ticking = false;
            });

            ticking = true;
        }
    });
}

function doSomething(scrollPos) {
    right.style.display = scrollPos > 0 ? "none" : "block";
}

