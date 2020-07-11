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
    this.running = false; // toggled true when both game.playerCount are ready
    this.gameWinner = false; // toggled true when player reaches desired wins, this triggers a game restart
    this.completedRoundCount = 0; // incremented after a round has been won
    this.playerOneVictoryCount = 0;
    this.playerTwoVictoryCount = 0;
    this.readyPlayerOne = false;
    this.readyPlayerTwo = false;
    this.playerOneName = "";
    this.playerTwoName = "";
    this.playerCount = 0;
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
        all: [],
      },
      playerTwoGuesses: {
        hits: [],
        misses: [],
        all: [],
      },
      playerOneCompletionPercent: 0,
      playerTwoCompletionPercent: 0,
    };
  }

  /**
   * Restart the game instance
   */
  resetGameClass() {
    this.running = false; // toggled true when both game.playerCount are ready
    this.gameWinner = false; // toggled true when player reaches desired wins, this triggers a game restart
    this.completedRoundCount = 0; // incremented after a round has been won
    this.playerOneVictoryCount = 0;
    this.playerTwoVictoryCount = 0;
    this.readyPlayerOne = false;
    this.readyPlayerTwo = false;
    this.playerOneName = "";
    this.playerTwoName = "";
    this.playerCount = 0;
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
        all: [],
      },
      playerTwoGuesses: {
        hits: [],
        misses: [],
        all: [],
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

// variables
let interval;
let connections = 0;

// game instance
let game = new Game();

// client connection
io.on("connection", (socket) => {
  //   console.log(game);
  connections = socket.client.conn.server.clientsCount;
  console.log("a client has connected. count:", connections);

  let currentPlayer = 0; // this will be updated if the client joins the game (1 or 2)

  // interval handles updates
  interval = setInterval(() => emitGame(socket, game, currentPlayer), 15);

  //
  //#region Listeners
  //***************

  // on 'disconnect'
  socket.on("disconnect", (socket) => {
    connections = io.engine.clientsCount;
    console.log("a client has disconnected. count:", connections);
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

  // join a game
  // rejected if too many game.playerCount
  socket.on("join game", (playerName) => {
    console.log("join game hit", playerName);

    // check the current player count
    if (game.playerCount >= 2) {
      socket.emit("too many players");
      return;
    } else if (currentPlayer !== 0) {
      // check if player already joined
      socket.emit("already joined");
      return;
    }

    // increment the game.playerCount
    game.playerCount++;
    console.log(game.playerCount, "players");
    switch (game.playerCount) {
      case 1:
        currentPlayer = 1;
        game.playerOneName = playerName; // add player 1
        break;

      case 2:
        currentPlayer = 2;
        game.playerTwoName = playerName; // add player 2
        break;

      default:
        break; // don't do anything
    }
    socket.emit("you joined the game"); // tell the player they joined
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
 * @param {int} currentPlayer What player number is the client? 0(not playing) 1 or 2?
 */
const emitGame = (socket, game, currentPlayer) => {
  const response = { game, currentPlayer };
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
  game.resetGameClass();
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
