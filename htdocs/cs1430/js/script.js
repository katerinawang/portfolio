let carousel = document.querySelectorAll(".carousel-item");
let quote = document.querySelector(".blockquote p")
let author = document.querySelector(".blockquote-footer")
randomQuotes();
carousel.forEach((item) =>{
    let minPerSlide = 3;
    let next = item.nextElementSibling;
    for (let i = 0; i<minPerSlide; i++){
        if (!next){
            next = carousel[0];
        }
        let cloneChild = next.cloneNode(true);
        item.appendChild(cloneChild.children[0]);
        next = next.nextElementSibling;
    }
});
function randomQuotes(){
    fetch("./js/quotes.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            let n = getRandomInt(data.quotes.length);
            let q = data.quotes[n]['quote'].toString();
            let a = data.quotes[n]['author'].toString();
            // console.log(data.quotes[101]['quote']);
            quote.innerHTML = q;
            author.innerHTML = a;
        });
}
function getRandomInt(max){
    return Math.floor(Math.random() * max);
}