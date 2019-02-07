import React from "react";

export const Cell = (props) => {
  const id = `cell-${props.index}`
  const onClick = () => props.onClick(props.index)

  return (
    <button className={"cell"} id={id} onClick={onClick}>
      {props.cell.value}
    </button>
  )
};
