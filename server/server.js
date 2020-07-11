const express = require("express");
require("dotenv").config(); // env vars
const app = express();
const http = require("http").createServer(app); // create http server using express
const io = require("socket.io")(http); // setup sockets on top of ^^

app.use(express.static("build")); // serve the react frontend

const PORT = process.env.PORT || 5000; // port is 5000, or whatever the env var is

//
//#region Sockets
//***************

// socket connections
let clientCount = 0;

// interval
let interval;

// game state
let game = {
  // TEST OBJECT
  word: "test",
  playerNum: 2,
  roundNum: 3,
  // END TEST OBJECT
};

// client connection
io.on("connection", (socket) => {
  clientCount = io.engine.clientsCount; // update count
  console.log("user connected. Count:", clientCount);
  // interval handles updates
  interval = setInterval(() => emitGame(socket), 15);
  emitGame(socket);

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
    testModifyGame();
  });

  // on 'reset game'
  socket.on("reset game", () => {
    console.log("reset hit");
    resetGame();
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
 */
const emitGame = (socket) => {
  const response = game;
  io.emit("FromAPI", response);
};

/**
 * Modify the game state.
 */
const testModifyGame = (socket) => {
  game.word = "test modified";
};

/**
 * Reset game to initial state.
 * This restarts the game to the beginning.
 */
const resetGame = (socket) => {
  game = {
    word: "test",
    playerNum: 2,
    roundNum: 3,
  };
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
