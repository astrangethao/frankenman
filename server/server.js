const express = require("express");
require("dotenv").config(); // env vars
const app = express();
const http = require("http").createServer(app); // create http server using express
const io = require("socket.io")(http); // setup sockets on top of ^^

app.use(express.static("build")); // serve the react frontend

const PORT = process.env.PORT || 5000; // port is 5000, or whatever the env var is

//
//#region Game
//***************

class Game {
  /**
   * A game of Frankenman
   */
  constructor() {
    this.running = false; // toggled true when both players are ready
    this.gameWinner = false; // toggled true when player reaches desired wins, this triggers a game restart
    this.completedRoundCount = 0; // incremented after a round has been won
    this.playerOneVictoryCount = 0;
    this.playerTwoVictoryCount = 0;
    this.readyPlayerOne = false;
    this.readyPlayerTwo = false;
    this.playerOne = "";
    this.playerTwo = "";
    this.pastRounds = []; // completed rounds get pushed here

    /**
     * A round of Frankenman.
     */
    this.round = {
      roundWinner: false, // true when a player has won
      winningPlayer: "", // player username
      roundNum: 1,
      word: "",
      wordCharArr: [],
      playerOneGuesses: {
        hits: [],
        misses: [],
      },
      playerTwoGuesses: {
        hits: [],
        misses: [],
      },
      playerOneCompletionPercent: 0,
      playerTwoCompletionPercent: 0,
    };
  }

  /**
   * Toggle a ready status of a player.
   * @param {number} playerNum Which player should be toggled? 1 or 2
   */
  readyPlayer(playerNum) {
    switch (playerNum) {
      case 1:
        this.readyPlayerOne = true;
        break;
      case 2:
        this.readyPlayerTwo = true;
        break;
      default:
        console.log("err, no player num given");
        break;
    }
  }
}

//***************
//#endregion Game
//

//
//#region Sockets
//***************

// socket connections
let clientCount = 0;

// interval
let interval;

// game instance
let game = new Game();

// client connection
io.on("connection", (socket) => {
  console.log(game);
  clientCount = io.engine.clientsCount; // update count
  console.log("user connected. Count:", clientCount);
  // interval handles updates
  interval = setInterval(() => emitGame(socket, game), 15);

  //
  //#region Listeners
  //***************

  // on disconnection
  socket.on("disconnect", () => {
    clientCount = io.engine.clientsCount;
    console.log("user disconnected. Count:", clientCount);
  });

  // on 'test emit'
  socket.on("test me", () => {
    console.log("test hit");
    testModifyGame(socket, game);
  });

  // on 'reset game'
  socket.on("reset game", () => {
    console.log("reset hit");
    resetGame(socket, game);
  });

  //***************
  //#endregion Listeners
  //
});

//
//#region Socket Emits
//***************

/**
 * Update all clients.
 * @param {Game} game An instance of Frankenman
 */
const emitGame = (socket, game) => {
  const response = game;
  io.emit("FromAPI", response);
};

/**
 * Modify the game state.
 * @param {Game} game An instance of Frankenman
 */
const testModifyGame = (socket, game) => {
  game.round.word = "Test Yeet.";
};

/**
 * Reset game to initial state.
 * This restarts the game to the beginning.
 */
const resetGame = (socket, game) => {
  game = new Game();
};

//***************
//#endregion Socket Emits
//

//***************
//#endregion Sockets
//

// listen
http.listen(PORT, () => {
  console.log("server listening on port", PORT);
});
