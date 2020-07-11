import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import JoinGameField from "../JoinGameField/JoinGameField.js";

const socket = io("http://localhost:3000/");

function App() {
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    socket.on("FromAPI", (data) => {
      setGameState(data);
    });
  }, []);

  const handleClick = () => {
    socket.emit("test me");
  };

  const handleReset = () => {
    socket.emit("reset game");
  };

  const gameStateString = JSON.stringify(gameState);

  return (
    <div className="App">
      <h1>Game State:</h1>
      <p>{gameStateString}</p>
      <button onClick={handleClick}>Click</button>
      <button onClick={handleReset}>Reset Game</button>
      <JoinGameField socket={socket} />
    </div>
  );
}

export default App;
