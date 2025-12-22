let name, age, month, season, stone, determiner, string;
const months= {3: "march", 4: "april", 5: "may", 6: "june", 7: "july", 8: "august", 9: "september", 10: "october", 11: "november", 12: "december", 1: "january", 2: "february"};
const birthStone = {
    january: "garnet",
    february: "amethyst",
    march: "aquamarine",
    april: "diamond",
    may: "emerald",
    june: "pearl",
    july: "ruby",
    august: "peridot",
    september: "sapphire",
    october: "opal",
    november: "topaz",
    december: "turquoise",
};
function greetings(){
    name = prompt("Please enter your name");
    while (name == null || name === ""){
        name = prompt("please enter a name");
    }
    age = prompt("Please enter your age");
    while (age == null || isNaN(parseInt(age)) || age.charAt(0) === "-" || age === ""){
        age = prompt("please provide a valid age number");
    }
    month = prompt("Please tell me your birth month (full name or number)");
    while (!Object.values(months).includes(month.toLowerCase()) && !Object.keys(months).includes(month)){
        month = prompt("please input correct month (full name or number)");
    }
    if (!isNaN(parseInt(month))){
        month = months[month];
    }
    let newMonths = Object.values(months);
    if (newMonths.slice(0,3).includes(month.toLowerCase())){
        season = "spring";
    }else if (newMonths.slice(3,6).includes(month.toLowerCase())){
        season = "summer";
    }else if (newMonths.slice(6,9).includes(month.toLowerCase())){
        season = "fall";
    }else if (newMonths.slice(-3).includes(month.toLowerCase())){
        season = "winter";
    }
    stone = birthStone[month.toLowerCase()];
    determiner = ["a", "e", "o"].includes(stone.charAt(0)) ? "an" : "a";
    string = "Hello " + name + ". You are " + age + " years old, and you were born in " + month.charAt(0).toUpperCase() + month.slice(1) + " which is in the " + season + " and your birthstone is " + determiner + " " + stone + ".";
    alert(string);
    return [name, age, month, season, determiner, stone];
}
window.onload = function () {
    let opening = document.getElementById("opening");
    let greeting = document.getElementById("greeting");
    let wrapper = document.getElementById("wrapper");
    let list = greetings();
    wrapper.style.opacity = 1;
    wrapper.style.transition = "opacity .5s ease-in-out";
    opening.innerHTML = "Dear " + list[0] + ",";
    greeting.innerHTML = "Congratulations on turning " + list[1] + " today!<br>May your special day be as radiant as " + list[4] + " " + list[5] + " in " + list[3] + "!";
}