import React, { Component } from "react";
import "./Corpse.css";

class Corpse extends Component {
  render() {
    return (
      <div id="corpse-container">
        <div id="high-c">
          <div id="head"></div>
        </div>
        <div id="mid-c">
          <div id="right-arm"></div>
          <div id="torso"></div>
          <div id="left-arm"></div>
        </div>
        <div id="low-c">
          <div id="right-leg"></div>
          <div id="left-leg"></div>
        </div>
      </div>
    );
  }
}

export default Corpse;
