import React from "react";
import "./WordDisplay.css";
import Box from "../WordDisplay/Box";

function WordDisplay(props) {
  const letter = props.word.split("");
  console.log(letter);

  return (
    <div className="word-display-container">
      <Box />
    </div>
  );
}

export default WordDisplay;
