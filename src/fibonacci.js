import {DEFAULTS} from './index.js';

const getCompletedSequences = (lastActive, cellsArr) => {
  const defaults = DEFAULTS;
  let completedSequences = [];

  lastActive.forEach(cell => {
    let hor = removeDuplicatesFromArray([
                ...step('right', cell.index, cellsArr),
                ...center('horizontal', cell.index, cellsArr),
                ...step('left', cell.index, cellsArr)
              ]);

    let ver = removeDuplicatesFromArray([
                ...step('down', cell.index, cellsArr),
                ...center('vertical', cell.index, cellsArr),
                ...step('up', cell.index, cellsArr)
              ]);

    if (hor.length >= defaults.threshold) completedSequences = [...completedSequences, ...hor];
    if (ver.length >= defaults.threshold) completedSequences = [...completedSequences, ...ver];
  });

  return completedSequences;
}

const center = (direction, index, cellsArr) => {
  const current = cellsArr[index];
  const {previous, next} = getAdjacentCells(direction, index, cellsArr);

  if (!previous || !current || !next) return [...[]];

  if(!areInSameRow(current, next, previous) && !areInSameColumn(current, next, previous)) return [...[]];

  if (previous.value + current.value === next.value) {
    return [current.index,
            next.index,
            previous.index];
  }

  return [...[]];
}

const step = (direction, index, cellsArr) => {
  const directionModifier = (direction === 'right' || direction === 'down') ? 1 : -1;

  let current = cellsArr[index];
  let {next, subsequent} = getAdjacentCells(direction, index, cellsArr);

  if (!current || !next || !subsequent) return [...[]];

  if(!areInSameRow(current, next, subsequent) && !areInSameColumn(current, next, subsequent)) return [...[]];

  if (current.value + (next.value * directionModifier) === subsequent.value) {
    return [current.index,
            next.index,
            subsequent.index,
            ...step(direction, next.index, cellsArr)];
  }

  return [...[]];
}

const getAdjacentCells = (direction, index, cellsArr) => {
  const defaults = DEFAULTS;
  let previous, next, subsequent;

  switch (direction) {
    case 'right':
    case 'horizontal':
      previous = cellsArr[index - 1];
      next = cellsArr[index + 1];
      subsequent = cellsArr[index + 2];
      break;
    case 'left':
      previous = cellsArr[index + 1];
      next = cellsArr[index - 1];
      subsequent = cellsArr[index - 2];
      break;
    case 'down':
    case 'vertical':
      previous = cellsArr[index - defaults.cols];
      next = cellsArr[index + defaults.cols];
      subsequent = cellsArr[index + (defaults.cols * 2)];
      break;
    case 'up':
      previous = cellsArr[index + defaults.cols];
      next = cellsArr[index - defaults.cols];
      subsequent = cellsArr[index - (defaults.cols * 2)];
      break;
    default:
      previous = false;
      next = false;
      subsequent = false;
  }

  return {
    previous: (!previous || previous.value === 0) ? false : previous,
    next: (!next || next.value === 0) ? false : next,
    subsequent: (!subsequent || subsequent.value === 0) ? false : subsequent
  }
}

const areInSameRow = (current, next, subsequent) => (current.row === next.row && current.row === subsequent.row);
const areInSameColumn = (current, next, subsequent) => (current.col === next.col && current.col === subsequent.col);
const removeDuplicatesFromArray = (arr) => [...new Set(arr)];

export {getCompletedSequences};
