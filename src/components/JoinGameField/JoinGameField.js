import React, { useState } from "react";

function JoinGameField(props) {
  const [name, setName] = useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleJoin = (event) => {
    props.socket.emit("join game", name);
    setName(""); // reset the name
  };
  return (
    <div>
      <input type="text" onChange={handleChange} value={name} />
      <p>{name}</p>
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}

export default JoinGameField;
