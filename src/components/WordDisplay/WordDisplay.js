import React from "react";
import "./WordDisplay.css";
import Box from "../WordDisplay/Box";

function WordDisplay(props) {
  return (
    <div className="word-display-container">
      <div className="box-container">
        {props.wordCharArray.map((char, index) => (
          <Box key={index} />
        ))}
      </div>
    </div>
  );
}

export default WordDisplay;
