import React from "react";

const ButtonRenderer = ({ value, data, onClick }) => {
  const handleClick = () => {
    onClick(data);
    alert("Sure");
  };

  return;

  <button onClick={handleClick}>{value}</button>;
};
export default ButtonRenderer;
