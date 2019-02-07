import {
  removeDuplicatesFromArray,
  areInSameRow,
  areInSameColumn
} from './helpers.js';

export const getCompletedSequences = (lastActive, cellsArr, gridSettings) => {
  let completedSequences = [];

  lastActive.forEach(cell => {
    let hor = removeDuplicatesFromArray([
      ...step('right', cell.index, cellsArr, gridSettings),
      ...center('horizontal', cell.index, cellsArr, gridSettings),
      ...step('left', cell.index, cellsArr, gridSettings)
    ]);

    let ver = removeDuplicatesFromArray([
      ...step('down', cell.index, cellsArr, gridSettings),
      ...center('vertical', cell.index, cellsArr, gridSettings),
      ...step('up', cell.index, cellsArr, gridSettings)
    ]);

    if (hor.length >= gridSettings.threshold) {
      completedSequences = [...completedSequences, ...hor];
    }

    if (ver.length >= gridSettings.threshold) {
      completedSequences = [...completedSequences, ...ver];
    }
  });

  return completedSequences;
};

const center = (direction, index, cellsArr, gridSettings) => {
  const current = cellsArr[index];
  const {previous, next} = getAdjacentCells(direction, index, cellsArr, gridSettings);

  if (!previous || !current || !next) {
    return [];
  }

  if (!areInSameRow(previous, current, next) && !areInSameColumn(previous, current, next)) {
    return [];
  }

  if (previous.value + current.value === next.value) {
    return [
      previous.index,
      current.index,
      next.index
    ];
  }

  return [];
};

const step = (direction, index, cellsArr, gridSettings) => {
  const directionModifier = (direction === 'right' || direction === 'down') ? 1 : -1;
  let current = cellsArr[index];
  let {next, subsequent} = getAdjacentCells(direction, index, cellsArr, gridSettings);

  if (!current || !next || !subsequent) {
    return [];
  }

  if (!areInSameRow(current, next, subsequent) && !areInSameColumn(current, next, subsequent)) {
    return [];
  }

  if (current.value + (next.value * directionModifier) === subsequent.value) {
    return [
      current.index,
      next.index,
      subsequent.index,
      ...step(direction, next.index, cellsArr, gridSettings)
    ];
  }

  return [];
};

const getAdjacentCells = (direction, index, cellsArr, gridSettings) => {
  switch (direction) {
    case 'right':
    case 'horizontal':
      return {
        previous: cellsArr[index - 1],
        next: cellsArr[index + 1],
        subsequent: cellsArr[index + 2]
      };
    case 'left':
      return {
        next: cellsArr[index - 1],
        subsequent: cellsArr[index - 2]
      };
    case 'down':
    case 'vertical':
      return {
        previous: cellsArr[index - gridSettings.cols],
        next: cellsArr[index + gridSettings.cols],
        subsequent: cellsArr[index + (gridSettings.cols * 2)]
      };
    case 'up':
      return {
        next: cellsArr[index - gridSettings.cols],
        subsequent: cellsArr[index - (gridSettings.cols * 2)]
      };
    default:
      return {
        previous: false,
        next: false,
        subsequent: false
      };
  }
};
