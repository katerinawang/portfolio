function checkWord(word){
    let url = 'https://wordsapiv1.p.rapidapi.com/words/' + word;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '15e581bf4dmshe7d035a2b5074acp166781jsn862a82015f44',
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };
    try {
        return fetch(url, options).then(async (data) => {
            if (!data.ok) {
                return 0;
            } else {
                data = await data.json();
                let speech = [];
                for (let i = 0; i < data['results'].length; i++) {
                    speech.push(data['results'][i]['partOfSpeech']);
                }
                return speech;
            }
        });
    } catch (error) {
        console.log(error);
    }
}
function storyGen(arr){
    content.innerHTML = "";
    let title = document.createElement('h2');
    let str = 'Once upon a time, a ' + arr[5] + ' ' + pluralize.singular(arr[0]) + ' and a ' + arr[6] + ' ' + pluralize.singular(arr[1]) + ' ventured into a mysterious forest. They ' + f(arr[2]) + ' through enchanting paths, surrounded by towering trees and colorful flowers. Birds ' + f(arr[3]) + ' melodiously as sunlight filtered through the leaves. They ' + f(arr[4]) + ' in awe, experiencing nature\'s wonders firsthand. Joyful and grateful, they cherished the magical moments forever.';
    let story = document.createElement('p');
    story.setAttribute('id', 'story');
    title.innerHTML = 'The Magical Forest';
    story.innerHTML = str;
    content.appendChild(title);
    content.appendChild(story);
}
function madLibs(){
    let wordList = {
        n1: "",
        n2: "",
        v1: "",
        v2: "",
        v3: "",
        a1: "",
        a2: ""
    }
    wordList.n1 = document.getElementById("word-noun-1").value;
    wordList.n2 = document.getElementById("word-noun-2").value;
    wordList.v1 = document.getElementById("word-verb-1").value;
    wordList.v2 = document.getElementById("word-verb-2").value;
    wordList.v3 = document.getElementById("word-verb-3").value;
    wordList.a1 = document.getElementById("word-adj-1").value;
    wordList.a2 = document.getElementById("word-adj-2").value;
    if (Object.values(wordList).includes('')){
        content.getElementsByTagName('p')[0].innerHTML = "please input all field in order to generate!";
    }else {
        let err = false;
        for (let word of Object.values(wordList).slice(0, 2)) {
            checkWord(word).then((res) => {
                if (!res){
                    content.getElementsByTagName('p')[0].innerHTML = "no such word called " + word + "!"
                    err = true;
                }
                if (!res.includes('noun')) {
                    content.getElementsByTagName('p')[0].innerHTML = word + " is not proper part of speech!";
                    err = true;
                }
            });
        }
        for (let word of Object.values(wordList).slice(2, 5)) {
            checkWord(word).then((res) => {
                if (!res){
                    content.getElementsByTagName('p')[0].innerHTML = "no such word called " + word + "!"
                    err = true;
                }
                if (!res.includes('verb')) {
                    content.getElementsByTagName('p')[0].innerHTML = word + " is not proper part of speech!";
                    err = true;
                }
            });
        }
        for (let word of Object.values(wordList).slice(5)) {
            checkWord(word).then((res) => {
                if (!res){
                    content.getElementsByTagName('p')[0].innerHTML = "no such word called " + word + "!"
                    err = true;
                }
                if (!res.includes('adjective')) {
                    content.getElementsByTagName('p')[0].innerHTML = word + " is not proper part of speech!";
                    err = true;
                }
            });
        }
        setTimeout(() => {
            if (!err) {
                storyGen(Object.values(wordList));
            }
        }, 500);
    }
}
function randomWords(){
    let n1 = document.getElementById("word-noun-1");
    let n2 = document.getElementById("word-noun-2");
    let v1 = document.getElementById("word-verb-1");
    let v2 = document.getElementById("word-verb-2");
    let v3 = document.getElementById("word-verb-3");
    let a1 = document.getElementById("word-adj-1");
    let a2 = document.getElementById("word-adj-2");
    n1.value = animals[randInt(0, animals.length - 1)].toLowerCase();
    n2.value = animals[randInt(0, animals.length - 1)].toLowerCase();
    randomWord('verb').then(res => v1.value = res);
    randomWord('verb').then(res => v2.value = res);
    randomWord('verb').then(res => v3.value = res);
    randomWord('adjective').then(res => a1.value = res);
    randomWord('adjective').then(res => a2.value = res);
}
function randomWord(p){
    let url = 'https://random-words-api.vercel.app/word/' + p;
    return fetch(url, {
        method: 'GET'
    }).then(async (res) => {
        res = await res.json();
        return res[0]['word'].toLowerCase();
    });
}
function randInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function f(x){return x.replace(/([^aeiouy])y$/,'$1i').replace(/([^aeiouy][aeiou])([^aeiouy])$/,'$1$2$2').replace(/e$/,'')+'ed'}