let currentCard = 0;
const cards = document.querySelectorAll('.card');
const cardContainer = document.querySelector('.card-container');
const newMainSection = document.querySelector('.new-main-section');
const restartIcon = document.getElementById('restartIcon');
const restartIconContainer = document.getElementById('restartIconContainer');
function switchCard() {
    if (currentCard === cards.length - 1) {
        // Last card, slide away card section and slide in new main section
        cardContainer.classList.add('slide-out');
        setTimeout(() => {
            cardContainer.style.display = 'none';
            showNewMainSection();
        }, 500); // Match this timeout with CSS transition duration
    } else {
        // Normal card switching logic
        cards[currentCard].classList.remove('active');
        currentCard = (currentCard + 1) % cards.length;
        cards[currentCard].classList.add('active');
    }
}
function showNewMainSection() {
    newMainSection.style.display = 'block'; // or 'flex'
    newMainSection.classList.add('slide-in');
    restartIconContainer.style.display = 'flex'; // Show the restart icon container
}

function restartCards() {
    // Hide the new main section and reset its classes
    if (newMainSection.style.display === 'block' || newMainSection.classList.contains('slide-in')) {
        newMainSection.style.display = 'none';
        newMainSection.classList.remove('slide-in');
        restartIconContainer.style.display = 'none'; // Hide the restart icon container
    }

    // Show the card container if it's not visible
    if (cardContainer.style.display === 'none' || cardContainer.classList.contains('slide-out')) {
        cardContainer.style.display = 'block';
        cardContainer.classList.remove('slide-out');
    }

    // Reset to the first card
    cards.forEach(card => card.classList.remove('active'));
    currentCard = 0;
    cards[currentCard].classList.add('active');
}

// Initially hide the restart icon container
restartIconContainer.style.display = 'none';