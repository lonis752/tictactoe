const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return {
        renderMessage
    }
})();

const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    //Function to render the gameboard and add event listeners to every square.
    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    }

    //updates the values in the gameboard and rerenders the gameboard.
    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard
    }
})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", handleClick);
        })
    }

    const handleClick = (event) => {
        let index = parseInt(event.target.id.split("-")[1])

        if (Gameboard.getGameboard()[index] !== "") {
            return;
        }
        
        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} is the Winner!`);
        } else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage("It's a tie...");
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const reset = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
        document.querySelector("#message").innerHTML = "";
    }

    return {
        start,
        reset,
        handleClick
    }
})();

function checkForWin(board) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < winningCombos.length; i++) {
        const [a, b, c] = winningCombos[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== "");
}

const resetButton = document.querySelector("#reset-btn");
resetButton.addEventListener("click", () => {
    Game.reset();
});

const startButton = document.querySelector("#start-btn");
startButton.addEventListener("click", () => {
    Game.start();
});