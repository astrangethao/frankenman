const express = require("express");
require("dotenv").config(); // env vars
const app = express();
const http = require("http").createServer(app); // create http server using express
const io = require("socket.io")(http); // setup sockets on top of ^^
const onChange = require("on-change");

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
    this.gameMaxStrikes = 10; // this maximum number of incorrect guesses a player can make per round
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

    this.limbs = {
      head: [
        "images/h1.png",
        "images/h2.png",
        "images/h3.png",
        "images/h4.png",
        "images/h5.png",
        "images/h6.png",
      ],
      torso: [
        "images/t1.png",
        "images/t2.png",
        "images/t3.png",
        "images/t4.png",
        "images/t5.png",
      ],
      rightArm: [
        "images/ar1.png",
        "images/ar2.png",
        "images/ar3.png",
        "images/ar4.png",
        "images/ar5.png",
      ],
      leftArm: [
        "images/al1.png",
        "images/al2.png",
        "images/al3.png",
        "images/al4.png",
        "images/al5.png",
      ],
      rightLeg: [
        "images/lr1.png",
        "images/lr2.png",
        "images/lr3.png",
        "images/lr4.png",
        "images/lr5.png",
      ],
      leftLeg: [
        "images/ll1.png",
        "images/ll2.png",
        "images/ll3.png",
        "images/ll4.png",
        "images/ll5.png",
      ],
    };
  }

  /**
   * Restart the game instance
   */
  resetGameClass() {
    this.running = false; // toggled true when both game.playerCount are ready
    this.gameWinner = false; // toggled true when player reaches desired wins, this triggers a game restart
    this.gameMaxStrikes = 10; // this maximum number of incorrect guesses a player can make per round
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
let connections = 0;

// game instance
const unwatchedGame = new Game();
const game = onChange(unwatchedGame, () => {
  emitGame(null, game);
});

// client connection
io.on("connection", (socket) => {
  //   console.log(game);
  connections = socket.client.conn.server.clientsCount;
  console.log("a client has connected. count:", connections);
  emitGame(null, game); // someone joined, refresh clients

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

  // on 'alpha button'
  socket.on("alpha button", (letter) => {
    console.log("button clicked", letter);
    switch (socket.id) {
      case game.playerOne.socketID:
        game.round.playerOneGuesses.all.push(letter);
        hitOrMiss(socket, game, letter);
        break;
      case game.playerTwo.socketID:
        game.round.playerTwoGuesses.all.push(letter);
        hitOrMiss(socket, game, letter);
        break;
      default:
        socket.emit("default player");
        break; // don't do anything
    }
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

  // on 'ready player'
  socket.on("ready player", (playerNum) => {
    console.log("ready player hit. playerNum:", playerNum);
    game.readyPlayer(playerNum);

    // start the game if both players are ready
    if (game.readyPlayerOne && game.readyPlayerTwo) {
      game.running = true;
      console.log("start game");
      assignWord(socket, game); // get a random word for the round
    }
  });

  // refresh clients
  socket.on("refresh clients", () => {
    emitGame(null, game);
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
//#region Game Operator
//***************

/**
 * check if the guessed char is hit or miss
 * @param {*} socket
 * @param {*} game
 * @param {*} letter
 */

const hitOrMiss = (socket, game, letter) => {
  if (socket.id === game.playerOne.socketID) {
    let isHit = game.round.wordCharArr.indexOf(letter) !== -1;
    if (isHit) {
      game.round.playerOneGuesses.hits.push(letter);
    } else {
      game.round.playerOneGuesses.misses.push(letter);
    }
  } else if (socket.id === game.playerTwo.socketID) {
    let isHit = game.round.wordCharArr.indexOf(letter) !== -1;
    if (isHit) {
      game.round.playerTwoGuesses.hits.push(letter);
    } else {
      game.round.playerTwoGuesses.misses.push(letter);
    }
  }
};

//
//#region Word Generator
//***************

/**
 * set a new word for the round
 */

const assignWord = (socket, game) => {
  switch (game.round.roundNum) {
    case 1:
      game.round.word = randomWord(5); // max length 5
      game.round.wordCharArr = game.round.word.split(""); // store char of the word in array
      break;
    case 2:
      game.round.word = randomWord(7); // max length 7
      game.round.wordCharArr = game.round.word.split(""); // store char of the word in array
      break;
    case 3:
      game.round.word = randomWord(9); // max length 9
      game.round.wordCharArr = game.round.word.split(""); // store char of the word in array

      break;
    default:
      break;
  }
};

//***************
//#endregion Word Generator
//

//***************
//#endregion Game Operator
//

// listen
http.listen(PORT, () => {
  console.log("server listening on port", PORT);
});
