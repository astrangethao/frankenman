import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import JoinGameField from "../JoinGameField/JoinGameField.js";
import WordDisplay from "../WordDisplay/WordDisplay";
import AlphaButtons from "../AlphaButton/AlphaButtons";
import Corpse from "../Corpse/Corpse";
import ReadyButton from "../ReadyButton/ReadyButton.js";

const socket = io(
  process.env.REACT_APP_SOCKET_SERVER || "http://localhost:5000/"
);

function App() {
  const [gameState, setGameState] = useState(false);
  const [displayReadyBtn, setDisplayReadyBtn] = useState(false); // show the button to ready up. Once both players have readied, start the game
  const [playerNum, setPlayerNum] = useState(0); // 0 = no, 1 = player1, 2 = player2
  const [wordCharArrayState, setWordCharArrayState] = useState([]); // getting wordCharArray for the round

  useEffect(() => {
    socket.on("FromAPI", (data) => {
      setGameState(data);

      if (!gameState) return;

      if (gameState.playerCount === 2) {
        switch (socket.id) {
          case gameState.playerOne.socketID:
            setPlayerNum(1);
            setDisplayReadyBtn(true);
            break;
          case gameState.playerTwo.socketID:
            setPlayerNum(2);
            setDisplayReadyBtn(true);
            break;
          default:
            break;
        }
      } else {
        setDisplayReadyBtn(false);
      }
      setWordCharArrayState(data.round.wordCharArr);
    });
  });

  socket.on("you joined the game", () => {
    socket.emit("refresh clients");
  });

  const handleClick = () => {
    socket.emit("test me");
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
      <p>PlayerNum: {playerNum}</p>
      <button onClick={handleClick}>Click</button>
      <button onClick={handleReset}>Reset Game</button>
      <JoinGameField socket={socket} />
      {displayReadyBtn && <ReadyButton socket={socket} playerNum={playerNum} />}
      <Corpse
        limbs={gameState.limbs}
        word={gameState.word}
        hits={gameState.hits}
      />
      <WordDisplay wordCharArray={wordCharArray} />
      <AlphaButtons socket={socket} />
    </div>
  );
}

export default App;
