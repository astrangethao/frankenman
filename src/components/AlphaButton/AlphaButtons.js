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
  state = {
    disabledButton: new Array(alphabet.length).fill(false),
  };

  render() {
    console.log(this.state.disabledButton);

    const handleClick = (letter, index) => () => {
      this.setState(
        (oldState) => {
          const newDisabledButtons = [...oldState.disabledButton];
          newDisabledButtons[index] = true;
          return {
            disabledButton: newDisabledButtons,
          };
        },
        () => {
          console.log("emit", letter);

          this.props.socket.emit("alpha button", letter);
        }
      );
    };
    return (
      <>
        <div className="btn-container">
          {alphabet.map((item, index) => {
            return (
              <button
                className="btn"
                onClick={handleClick(item, index)}
                key={index}
                disabled={this.state.disabledButton[index]}
                style={
                  this.state.disabledButton[index]
                    ? {
                        background: "white",
                        border: "solid 2px black",
                        color: "black",
                      }
                    : null
                }
              >
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
