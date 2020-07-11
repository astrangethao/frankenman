import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";

function App() {
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      setGameState(data);
    });
  }, []);

  const gameStateString = JSON.stringify(gameState);

  return (
    <div className="App">
      <h1>Game State:</h1>
      <p>{gameStateString}</p>
    </div>
  );
}

export default App;
