import React from "react";
import { useState, useEffect } from "react";
import {
  buildCellsArr,
  getIncremendtedCells,
  getCellsToIncrement,
  getCompletedSequences,
  getResettedCells
} from "../lib";
import { Cell } from "./Cell";


export const Grid = (props) => {
  const [cellsArr, setCellsArr] = useState(() => buildCellsArr(props));
  const [lastActive, setLastActive] = useState([]);

  const handleCellClick = (index) => {
    const incrementedCells = getIncremendtedCells(index, cellsArr);
    const lastActiveCells = getCellsToIncrement(index, cellsArr);
    setCellsArr(incrementedCells);
    setLastActive(lastActiveCells);
  }

  useEffect(() => {
    const completedSequences = getCompletedSequences(lastActive, cellsArr, props);

    if (completedSequences.length > 0) {
      const resettedCells = getResettedCells(completedSequences, cellsArr)
      setCellsArr(resettedCells)
    }
  });

  return <div className="grid">
    {cellsArr.map((cell, index) => {
        return <Cell key={index} index={index} cell={cell} onClick={handleCellClick} />
      }
    )}
  </div>
}
