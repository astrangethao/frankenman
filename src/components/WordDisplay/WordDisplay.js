import React from "react";
import "./WordDisplay.css";
import Box from "../WordDisplay/Box";

function WordDisplay(props) {
  console.log("props hit", props.hitsArray);
  return (
    <div className="word-display-container">
      <div className="box-container">
        {props.wordCharArray.map((char, index) => {
          if (props.hitsArray.indexOf(char) !== -1) {
            return (
              <div className="letter-display">
                <h1>{char}</h1>
              </div>
            );
          } else {
            return <Box key={index} />;
          }
          // return <Box key={index} />;
        })}
      </div>
    </div>
  );
}

export default WordDisplay;
