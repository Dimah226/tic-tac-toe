let board = ["", "", "", "", "", "", "", "", ""];
let gameMode;
let difficultyLevel = "";
let player1 = { name: "", marker: "?", score: 0 ,pions:[],piecesOnBoard:0}; 
let player2 = { name: "", marker: "?", score: 0 ,pions:[],piecesOnBoard:0}; 
let positionNotUsable="";
const aiButton = document.querySelector(".playAi");
const friendButton = document.querySelector(".playFriend");
const begin = document.querySelector(".begin");
const pickSide = document.querySelector(".pick-side");
const onePlayer = document.querySelector(".one-player");
const twoPlayer = document.querySelector(".two-player");
const level = document.querySelector(".level-button");
const userChoose = document.querySelector("#current-player-name");
const chooseSide = document.querySelector(".choose-side");
const radioX = document.getElementById("pick-x");
const radioO = document.getElementById("pick-o");
const playerOne = document.getElementById("player-one");
const playerTwo = document.getElementById("player-two");
const Boardvisible = document.querySelector(".board");
const players = document.querySelector(".players");
const gamer1 = document.querySelector("#player-one");
const gamer2 = document.querySelector("#player-two");
const subCell = document.querySelectorAll(".sub-cell");
const winner = document.querySelector(".winner");
const quit = document.querySelector("#quit-game");

aiButton.addEventListener("click", () => {
    gameMode = "RAHAH";
    begin.style.display = "none";
    onePlayer.style.display = "flex";
});

level.addEventListener("click", () => {
    if (document.querySelector("#player-name").value!==""){
        event.preventDefault();
        player1.name = document.querySelector("#player-name").value;
        player2.name = "RAHAH";
        difficultyLevel = document.querySelector("#difficulty-level").value;
        userChoose.textContent = player1.name;
        onePlayer.style.display = "none";
        pickSide.style.display = "flex";
    }
});

chooseSide.addEventListener("click", (event) => {
    event.preventDefault();

    if (radioX.checked) {
        player1.marker = "X";
        player2.marker = "O";
    } else if (radioO.checked) {
        player1.marker = "O";
        player2.marker = "X";
    }

    playerOne.textContent = player1.name;
    playerTwo.textContent = player2.name;
    pickSide.style.display = "none";
    Boardvisible.style.display = "flex";
    startGame();
});

friendButton.addEventListener("click", () => {
    gameMode = "friend";
    begin.style.display = "none";
    twoPlayer.style.display = "flex";
});

players.addEventListener("click", () => {
    if (document.querySelector("#player-one-name").value!=="" && document.querySelector("#player-two-name").value!==""){
    event.preventDefault();
    player1.name = document.querySelector("#player-one-name").value;
    player2.name = document.querySelector("#player-two-name").value;
    console.log(difficultyLevel)
    userChoose.textContent = player1.name;
    twoPlayer.style.display = "none";
    pickSide.style.display = "flex";
    }
});

function isPositionAvailable(position) {
    return board[position] === "";
}

function isBoardFull() {
    return board.every(cell => cell !== "");
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function easy() {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            availableMoves.push(i);
        }
    }
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

function medium() {
    let move = -1;
    let availableMoves = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = player1.marker;
            if (checkWinner() === player1.marker) {
                move = i;
            }
            board[i] = "";
            board[i] = player2.marker;
            if (checkWinner() === player2.marker) {
                move = i;
            }
            board[i] = "";
            if (move !== -1) {
                return move;
            }
            availableMoves.push(i);
        }
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
    let winner = checkWinner();

    if (winner === player2.marker) return 10 - depth;
    if (winner === player1.marker) return depth - 10;
    if (isBoardFull()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = player2.marker;
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = player1.marker;
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = player2.marker;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function aiTurn() {
    let move;
    if (difficultyLevel === "Easy") {
        move = easy();
    } else if (difficultyLevel === "Medium") {
        move = medium();
    } else {
        move = getBestMove();
    }
    markerClass = player2.marker;
    const el = document.getElementById(`${move}`);
    const span = el.querySelector(`.${markerClass}`);
    if (span) {
        span.classList.add("active");
    }
    el.classList.add("use");
    playerTurn(player2, move);
}

function playerTurn(player, position) {
    position = parseInt(position);
    board[position] = player.marker;

    if (checkWinner() === player.marker) {
        player.score += 1;
        document.querySelector("#score").textContent = `${player1.score} - ${player2.score}`;
        document.querySelector(".win").textContent = `${player.name} wins the game!`;
        document.querySelector(".winner").style.display = 'flex';
        return;
    }

    if (isBoardFull()) {
        document.querySelector(".win").textContent = `It's a draw!`;
        document.querySelector(".winner").style.display = 'flex';
        return;
    }

    if (player === player1 && player2.name === "RAHAH") {
        aiTurn();
    } else if (player === player2) {
        gamer2.classList.remove("active");
        gamer1.classList.add("active");
    } else if (player === player1) {
        gamer1.classList.remove("active");
        gamer2.classList.add("active");
    }
}

function startGame() {
    board.fill("");
    gamer1.classList.add("active");
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    subCell.forEach(el => {
        const span = el.querySelectorAll(`span`);
        span.forEach(el2 => {
            if (el2.classList.contains("active")) {
                el2.classList.remove("active");
            }
        });
        el.classList.remove("use");
    });
    startGame();
}

window.addEventListener('resize', adjustBoardSize);

function adjustBoardSize() {
    const cells = document.querySelectorAll('.sub-cell');
    const newSize = Math.min(window.innerWidth, window.innerHeight) / 4;
    cells.forEach(cell => {
        cell.style.fontSize = `${newSize}px`;
    });
}

adjustBoardSize();


subCell.forEach(el => {
    el.addEventListener("click", () => {
        let markerClass;
        let player;
        

        if (gamer1.classList.contains("active")) {
            markerClass = player1.marker;
            player = player1;
        } else if (gamer2.classList.contains("active")) {
            markerClass = player2.marker;
            player = player2;
        }
    
        if (el.classList.contains("use") && player.pions.includes(parseInt(el.id))) {
            
            if (player.piecesOnBoard === 3) {
                
                if (player.pions.includes(parseInt(el.id))) {
                    console.log("yo2")
                    const span = el.querySelector(`.${markerClass}`);
                    if (span) {
                        span.classList.remove("active"); 
                    }
                    player.pions = player.pions.filter(pion => pion !== parseInt(el.id));
                    board[parseInt(el.id)] = ""; 
                    positionNotUsable = parseInt(el.id); 
                    el.classList.remove("use"); 
                    player.piecesOnBoard--; 
                    return; 
                }
            } else {
                return; 
            }
        }
        
        if (positionNotUsable === parseInt(el.id)) return;
        if (player.piecesOnBoard === 3)return;
        console.log("yo")
        if (!el.classList.contains("use")) {
            const span = el.querySelector(`.${markerClass}`);
            if (span) {
                span.classList.add("active"); 
            }

            el.classList.add("use");
            const position = parseInt(el.id);
            positionNotUsable = "";
            player.piecesOnBoard++;
            player.pions.push(position)
            console.log(player.name,player.piecesOnBoard,player.pions)
            playerTurn(player, position); 
            
        }

        
    });
});


winner.addEventListener("click", () => {
    winner.style.display = "none";
    resetGame();
});

quit.addEventListener("click",()=>{
    Boardvisible.style.display="none"
    player1.score=0
    player2.score=0
    resetGame()
    document.querySelector("#score").textContent ="0-0"
    begin.style.display="flex"
})
