import React, { Component } from "react";
import "./AlphaButtons.css";

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

class AlphaButtons extends Component {
  render() {
    const handleClick = (letter) => () => {
      this.props.socket.emit("alpha button", letter);
    };
    return (
      <>
        <div className="btn-container">
          {alphabet.map((item, index) => {
            return (
              <button className="btn" onClick={handleClick(item)} key={index}>
                {item}
              </button>
            );
          })}
        </div>
      </>
    );
  }
}

export default AlphaButtons;
