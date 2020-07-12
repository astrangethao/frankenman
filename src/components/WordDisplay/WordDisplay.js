import React from "react";
import "./WordDisplay.css";
import Box from "../WordDisplay/Box";

function WordDisplay(props) {
  const letter = props.word.split("");

  return (
    <div className="word-display-container">
      <div className="box-container">
        {letter.map((char) => (
          <Box />
        ))}
      </div>
    </div>
  );
}

export default WordDisplay;
