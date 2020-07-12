import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import WordDisplay from "../WordDisplay/WordDisplay";
import AlphaButtons from "../AlphaButton/AlphaButtons";

const socket = socketIOClient("http://localhost:5000");

function App() {
  const [gameState, setGameState] = useState({});
  const [wordState, setWordState] = useState(""); // getting word for the round

  useEffect(() => {
    socket.on("FromAPI", (data) => {
      setGameState(data);
      setWordState(data.round.word);
    });
  }, []);

  const handleClick = () => {
    socket.emit("test me");
  };

  const handleStart = () => {
    socket.emit("start game");
  };

  const handleReset = () => {
    socket.emit("reset game");
  };

  const gameStateString = JSON.stringify(gameState);

  const word = wordState; //storing word for the round

  return (
    <div className="App">
      <h1>Game State:</h1>
      <p>{gameStateString}</p>
      <button onClick={handleClick}>Click</button>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleReset}>Reset Game</button>
      <WordDisplay word={word} />
      <AlphaButtons />
    </div>
  );
}

export default App;
