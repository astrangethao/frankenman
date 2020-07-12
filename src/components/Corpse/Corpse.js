import React, { Component } from "react";
import "./Corpse.css";

class Corpse extends Component {
  state = {
    showLimb: true,
  };
  render() {
    const displayPercentages = () => {
      if (this.props.word) {
        return this.props.word.length / 6;
      }
    };

    if (!this.props.limbs) {
      return <div></div>;
    }
    const random = (max) => {
      return Math.floor(Math.random() * Math.floor(max));
    };

    const headArr = this.props.limbs.head;
    const torsoArr = this.props.limbs.torso;
    const rightArmArr = this.props.limbs.rightArm;
    const leftArmArr = this.props.limbs.leftArm;
    const rightLegArr = this.props.limbs.rightLeg;
    const leftLegArr = this.props.limbs.leftLeg;

    const randoHead = headArr[random(6)];
    const randoTorso = torsoArr[random(5)];
    const randoRightArm = rightArmArr[random(5)];
    const randoLeftArm = leftArmArr[random(5)];
    const randoRightLeg = rightLegArr[random(5)];
    const randoLeftLeg = leftLegArr[random(5)];

    // const divBackground = {
    //   backgroundImage: url(`+ ${imgUrl} +`),
    // };
    return (
      <div id="corpse-container">
        <div id="high-c">
          <div
            id="head"
            style={
              this.state.showLimb
                ? {
                    backgroundImage: "url(" + randoHead + ")",
                  }
                : null
            }
          ></div>
        </div>
        <div id="mid-c">
          <div
            id="right-arm"
            style={
              this.state.showLimb
                ? {
                    backgroundImage: "url(" + randoRightArm + ")",
                  }
                : null
            }
          ></div>
          <div
            id="torso"
            style={
              this.state.showLimb
                ? {
                    backgroundImage: "url(" + randoTorso + ")",
                  }
                : null
            }
          ></div>
          <div
            id="left-arm"
            style={
              this.state.showLimb
                ? {
                    backgroundImage: "url(" + randoLeftArm + ")",
                  }
                : null
            }
          ></div>
        </div>
        <div id="low-c">
          <div
            id="right-leg"
            style={
              this.state.showLimb
                ? {
                    backgroundImage: "url(" + randoRightLeg + ")",
                  }
                : null
            }
          ></div>
          <div
            id="left-leg"
            style={
              this.state.showLimb
                ? {
                    backgroundImage: "url(" + randoLeftLeg + ")",
                  }
                : null
            }
          ></div>
        </div>
      </div>
    );
  }
}

export default Corpse;
