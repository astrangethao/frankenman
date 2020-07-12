import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import WordDisplay from "../WordDisplay/WordDisplay";
import AlphaButtons from "../AlphaButton/AlphaButtons";

const socket = socketIOClient("http://localhost:5000");

function App() {
  const [gameState, setGameState] = useState({});
  const [wordCharArrayState, setWordCharArrayState] = useState([]); // getting wordCharArray for the round

  useEffect(() => {
    socket.on("FromAPI", (data) => {
      setGameState(data);
      setWordCharArrayState(data.round.wordCharArr);
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

  const wordCharArray = wordCharArrayState; //storing word for the round

  return (
    <div className="App">
      <h1>Game State:</h1>
      <p>{gameStateString}</p>
      <button onClick={handleClick}>Click</button>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleReset}>Reset Game</button>
      <WordDisplay wordCharArray={wordCharArray} />
      <AlphaButtons />
    </div>
  );
}

export default App;
