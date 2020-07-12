import React, { Component } from "react";
import "./Corpse.css";

class Corpse extends Component {
  render() {
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
            // style={{
            //   backgroundImage: "url(" + randoHead + ")",
            // }}
          ></div>
        </div>
        <div id="mid-c">
          <div
            id="right-arm"
            // style={{
            //   backgroundImage: "url(" + randoRightArm + ")",
            // }}
          ></div>
          <div
            id="torso"
            // style={{
            //   backgroundImage: "url(" + randoTorso + ")",
            // }}
          ></div>
          <div
            id="left-arm"
            // style={{
            //   backgroundImage: "url(" + randoLeftArm + ")",
            // }}
          ></div>
        </div>
        <div id="low-c">
          <div
            id="right-leg"
            // style={{
            //   backgroundImage: "url(" + randoRightLeg + ")",
            // }}
          ></div>
          <div
          // id="left-leg"
          // style={{
          //   backgroundImage: "url(" + randoLeftLeg + ")",
          // }}
          ></div>
        </div>
      </div>
    );
  }
}

export default Corpse;
