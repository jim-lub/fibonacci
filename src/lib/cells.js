import _ from "lodash";

import {
  removeDuplicatesFromArray,
  getCellsInRow,
  getCellsInColumn
} from "./helpers";

import {
  activateAnimationDirectlyOnTheDom,
  resetAnimationDirectlyOnTheDom
} from "./animations";

export const getCellsToIncrement = (index, cellsArr) => {
  const currentCell = cellsArr[index];
  const cellsToIncrement = removeDuplicatesFromArray([
    ...getCellsInRow(currentCell.row, cellsArr),
    ...getCellsInColumn(currentCell.col, cellsArr)
  ]);

  return cellsToIncrement;
};

export const getIncremendtedCells = (index, cellsArr) => {
  const cells = _.cloneDeep(cellsArr);

  getCellsToIncrement(index, cells)
    .forEach(cell => {
      cells[cell.index].value = ++cell.value;
      activateAnimationDirectlyOnTheDom(`cell-${cell.index}`);
    });

  return cells
};

export const getResettedCells = (completedSequences, cellsArr) => {
  const cells = _.cloneDeep(cellsArr);

  completedSequences.forEach(index => {
    cells[index].value = null;
    resetAnimationDirectlyOnTheDom(`cell-${index}`);
  });

  return cells;
};

export const buildCellsArr = (gridSettings) => {
  let cells = [], i = 0;

  for (let r = 0; r < gridSettings.rows; r++) {
    for (let c = 0; c < gridSettings.cols; c++) {
      cells.push({
        index: i++,
        row: r,
        col: c,
        value: null
      });
    }
  }

  return cells;
};
