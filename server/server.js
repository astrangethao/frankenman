const express = require("express");
require("dotenv").config(); // env vars
const app = express();
const http = require("http").createServer(app); // create http server using express
const io = require("socket.io")(http); // setup sockets on top of ^^

app.use(express.static("build")); // serve the react frontend

const PORT = process.env.PORT || 5000; // port is 5000, or whatever the env var is

const randomWord = require("random-word-by-length"); // setup random word generator

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
    this.playerOne = {
      name: "",
      socketID: null,
    };
    this.playerTwo = {
      name: "",
      socketID: null,
    };
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
    this.playerOne = {
      name: "",
      socketID: 0,
    };
    this.playerTwo = {
      name: "",
      socketID: 0,
    };
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

  // interval handles updates
  interval = setInterval(() => emitGame(socket, game), 15);

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

  // on 'start game'
  socket.on("start game", () => {
    console.log("start game");
    assignWord(socket, game); // get a random word for the round
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
    } else if (
      game.playerOne.socketID === socket.id ||
      game.playerOne.socketID === socket.id
    ) {
      socket.emit("you are already logged in");
      return;
    }

    // increment the game.playerCount
    game.playerCount++;
    console.log(game.playerCount, "players");
    switch (game.playerCount) {
      case 1:
        game.playerOne.name = playerName;
        game.playerOne.socketID = socket.id;
        break;

      case 2:
        game.playerTwo.name = playerName;
        game.playerTwo.socketID = socket.id;
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
  game.resetGameClass();
};

//***************
//#endregion Socket Emits
//

//***************
//#endregion Sockets
//

//
//#region Word Generator
//***************

/**
 * set a new word for the round
 */

const assignWord = (socket, game) => {
  switch (game.round.roundNum) {
    case 1:
      game.round.word = randomWord(5);
      break;
    case 2:
      game.round.word = randomWord(7);
      break;
    case 3:
      game.round.word = randomWord(9);
      break;
    default:
      break;
  }
};

//***************
//#endregion Word Generator
//

// listen
http.listen(PORT, () => {
  console.log("server listening on port", PORT);
});
