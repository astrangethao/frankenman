import React from "react";

function ReadyButton(props) {
  const handleReady = () => {
    props.socket.emit("ready player", props.playerNum);
  };
  return (
    <div>
      <button onClick={handleReady}>READY UP</button>
    </div>
  );
}

export default ReadyButton;
