let p1, p2, gameBoard, scoreBoard, signs, turn, ctrl, players, msg, winCode, score, gameOver, wins, info, wrapper, win1,
    win2, score1, score2, score3, ties, tieSound, winSound;
window.onload = function (){
    wrapper = document.getElementById("container");
    scoreBoard = document.getElementById("score-board");
    gameBoard = document.getElementById("game");
    info = document.getElementById("player-info");
    ctrl = document.getElementById("start");
    win1 = document.getElementById("win-1");
    win2 = document.getElementById("win-2");
    ties = document.getElementById("ties");
    score1 = document.getElementById("score-1")
    score2 = document.getElementById("score-2")
    score3 = document.getElementById("score-3")
    tieSound = new Audio("sound/tie.mp3");
    winSound = new Audio("sound/win.mp3");
    wins = [0, 0, 0];
    winCode = [7, 56, 73, 84, 146, 273, 292, 448];
    msg = document.getElementById("msg");
    signs = ["<img src='img/001-circle.png' alt='O'/>", "<img src='img/002-cancel.png' alt='X'>"];
    turn = 0;
}
function steps(el, num){
    if (!gameOver) {
        el.innerHTML = signs[turn];
        score[turn] += num;
        if (win()) {
            msg.innerText = players[turn] + " Wins!";
            wins[turn] += 1;
            score1.innerText = wins[0];
            score2.innerText = wins[1];
            winSound.play();
            info.innerHTML = "<button id=\"start\" type=\"submit\" onclick=\"start();\">Play Again?</button>";
        }else if (gameOver){
            msg.innerText = "Tie!";
            wins[2] += 1;
            score3.innerText = wins[2];
            tieSound.play();
            info.innerHTML = "<button id=\"start\" type=\"submit\" onclick=\"start();\">Play Again?</button>";
        }
        else {
            turn = turn ? 0 : 1;
            el.removeAttribute("onclick");
            msg.innerText = players[turn] + '\'s Turn Now';
        }
    }
}
function start(){
    if (info.childElementCount === 3) {
        p1 = document.getElementById("p1").value ? document.getElementById("p1").value : "Player1";
        p2 = document.getElementById("p2").value ? document.getElementById("p2").value : "Player2";
        players = [p1, p2];
    }
    info.innerHTML = "";
    score = [0, 0];
    gameOver = false;
    turn = 0;
    msg.innerText = players[turn] + '\'s Turn Now';
    removeProperty();
    displayGameBoard();
}
function win(){
    for (let i = 0; i < winCode.length; i++){
        if ((score[turn] & winCode[i]) === winCode[i]){
            gameOver = true;
            return true;
        }
    }
    gameOver = score[0] + score[1] === 511;
    return false;
}
function displayGameBoard(){
    let bit = 1;
    let divs = "";
    gameBoard.innerHTML = divs;
    for (let i = 0; i < 3; i++){
        divs += "<div class=\"row\">";
        for (let j = 0; j < 3; j++){
            divs += "<div class=\"col\" onclick=\"steps(this, " + bit + ");\"></div>";
            bit *= 2;
        }
        divs += '</div>';
    }
    gameBoard.innerHTML = divs;
}
function removeProperty(){
    if (!scoreBoard.style.display){
        scoreBoard.style.display = "block";
        scoreBoard.style.gridColumn = "1 / 2";
        msg.style.gridColumn = "2 / 5";
        info.style.gridColumn = "5 / 6";
        info.style.width = "200px";
        win1.innerText = players[0];
        win2.innerText = players[1];
        score1.innerText = "0";
        score2.innerText = "0";
    }

}