let pair;
function checkClass(cls){
    let warn = document.getElementsByClassName("warning");
    warn[0].style.animationName = "none";
    requestAnimationFrame(() => {
        setTimeout(() => {
            warn[0].style.animationName = "";
        }, 0);
    });
    if (cls.classList.contains("lotto")){
        cls.classList.remove("lotto");
    }
}
function lottoGen() {
    pair = Number(prompt("please input an integer from 1 to 7"));
    while (Number.isNaN(pair) || !Number.isInteger(pair) || pair > 7 || pair < 1) {
        if (pair === 0) break;
        pair = Number(prompt("please input a valid integer from 1 to 7"));
    }
    lottoReRoll();
}
function lottoReRoll() {
    let lotto = document.getElementById("lotto");
    if (pair === undefined || pair === 0) {
        lotto.innerHTML = "Please input an integer from 1-7 to generate.";
        lotto.classList.add("warning");
        checkClass(lotto);
    } else {
        lotto.classList.remove("warning");
        let numbers = [];
        let lottoString = "";
        for (let i = 0; i < pair; i++) {
            let num = Math.floor(Math.random() * 99 + 1);
            numbers.push(num < 10 ? "0" + num : num);
        }
        for (let n of numbers) lottoString += n + "-";
        lotto.classList.add("lotto");
        lotto.innerHTML = lottoString.slice(0, -1);
    }
}