import React from 'react';
import ReactDOM from 'react-dom';
import {useState, useEffect} from 'react';
import {getCompletedSequences} from './fibonacci.js'
import {animations} from './animations.js'
import './index.css';

const DEFAULTS = {
  rows: 50,
  cols: 50,
  threshold: 5
}

const Grid = () => {
  const [cellsArr, setCellsArr] = useState(() => buildCellsArr());
  const [lastActive, setLastActive] = useState([]);

  const handleClick = (index) => incrementCells(index, cellsArr, setCellsArr, setLastActive);

  useEffect(() => {
    const completedSequences = getCompletedSequences(lastActive, cellsArr);
    if (completedSequences.length > 0) resetCompletedSequences(completedSequences, cellsArr, setLastActive);
  });

  /* render */
  const cellsToRender = cellsArr.map(cur => Cell(cur, handleClick));
  return <div className="grid">{cellsToRender}</div>
}

const Cell = (props, handleClick) => {
  return (
    <button
      className={"cell"}
      id={"cell-" + props.index}
      key={props.index}
      onClick={() => handleClick(props.index)}
    >
      {props.value}
    </button>
  )
};

const buildCellsArr = () => {
  const defaults = DEFAULTS;
  let cells = [], i = 0;

  for (let r = 0; r < defaults.rows; r++) {
    for (let c = 0; c < defaults.cols; c++) {
      cells.push({
        index: i++,
        row: r,
        col: c,
        value: null
      });
    }
  }

  return cells;
}

const incrementCells = (index, cellsArr, setCellsArr, setLastActive) => {
  const cells = [...cellsArr];
  const cur = cells[index];
  const cellsToIncrement = removeDuplicatesFromArray([
                              ...getCellsInRow(cur.row, cells),
                              ...getCellsInColumn(cur.col, cells)
                            ]);

  cellsToIncrement.forEach(cur => {
    cells[cur.index].value = ++cur.value;
    animations().active(`cell-${cur.index}`);
  });

  setCellsArr(cells);
  setLastActive(cellsToIncrement);
}

const resetCompletedSequences = (completedSequences, cellsArr, setCellsArr) => {
  const cells = [...cellsArr];

  completedSequences.forEach(cur => {
    cells[cur].value = null;
    animations().reset(`cell-${cur}`);
  });

  setCellsArr(cells);
}

const getCellsInRow = (row, cells) => cells.filter(cell => cell.row === row);
const getCellsInColumn = (col, cells) => cells.filter(cell => cell.col === col);
const removeDuplicatesFromArray = (arr) => [...new Set(arr)];

ReactDOM.render(
  <Grid />,
  document.getElementById('root')
);

export {DEFAULTS}
