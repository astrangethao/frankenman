import React, { useState } from "react";
import io from "socket.io-client";
import JoinGameField from "../JoinGameField/JoinGameField.js";
import WordDisplay from "../WordDisplay/WordDisplay";
import AlphaButtons from "../AlphaButton/AlphaButtons";
import Corpse from "../Corpse/Corpse";
import ReadyButton from "../ReadyButton/ReadyButton.js";
import Footer from "../Footer/Footer";

const socket = io(
  process.env.REACT_APP_SOCKET_SERVER || "http://localhost:5000/"
);

function App() {
  const [gameState, setGameState] = useState(false);
  const [displayReadyBtn, setDisplayReadyBtn] = useState(false); // show the button to ready up. Once both players have readied, start the game
  const [playerNum, setPlayerNum] = useState(0); // 0 = no, 1 = player1, 2 = player2
  const [wordCharArrayState, setWordCharArrayState] = useState([]); // getting wordCharArray for the round
  const [hitState, setHitState] = useState([]); // getting hit status

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

    if (playerNum) {
      switch (playerNum) {
        case 1:
          setHitState(gameState.round.playerOneGuesses.hits);
          break;
        case 2:
          setHitState(gameState.round.playerTwoGuesses.hits);
          break;
        default:
          break;
      }
    }
  });

  const handleClick = () => {
    socket.emit("test me");
  };

  const handleReset = () => {
    socket.emit("reset game");
  };

  const gameStateString = JSON.stringify(gameState);
  console.log("hitstate", hitState);
  console.log("playnum", playerNum);

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
      <WordDisplay hitsArray={hitState} wordCharArray={wordCharArrayState} />
      <AlphaButtons socket={socket} />
      <Footer />
    </div>
  );
}

export default App;
