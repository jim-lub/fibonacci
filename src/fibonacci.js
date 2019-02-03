const getCompletedSequences = (defaults, lastActive, cellsArr) => {
  const cells = [...cellsArr];
  let completedSequences = [];

  lastActive.forEach(cell => {
    let hor = [...step('right', cell.index, cells),
               ...step('left', cell.index, cells)];

    let ver = [...step('down', cell.index, cells),
               ...step('up', cell.index, cells)];

    ver = removeDuplicatesFromArray(ver);
    hor = removeDuplicatesFromArray(hor);

    if (hor.length >= defaults.threshold) completedSequences = [...completedSequences, ...hor];
    if (ver.length >= defaults.threshold) completedSequences = [...completedSequences, ...ver];
  });

  return completedSequences;
}

const step = (direction, index, cells) => {
  const directionModifier = (direction === 'right' || direction === 'down') ? 1 : -1;

  const current = cells[index];
  const {next, subsequent} = getNextCells(direction, index, cells);

  if (!current || !next || !subsequent) return [...[]];
  if(!areInSameRow(current, next, subsequent) && !areInSameColumn(current, next, subsequent)) return [...[]];

  if (current.value + (next.value * directionModifier) === subsequent.value) {
    return [current.index,
            next.index,
            subsequent.index,
            ...step(direction, next.index, cells)];
  }

  return [...[]];
}

const getNextCells = (direction, index, cellsArr) => {
  let next, subsequent;
  let columns = 50;

  switch (direction) {
    case 'right':
      next = cellsArr[index + 1];
      subsequent = cellsArr[index + 2];
      break;
    case 'left':
      next = cellsArr[index - 1];
      subsequent = cellsArr[index - 2];
      break;
    case 'down':
      next = cellsArr[index + columns];
      subsequent = cellsArr[index + (columns * 2)];
      break;
    case 'up':
      next = cellsArr[index - columns];
      subsequent = cellsArr[index - (columns * 2)];
      break;
    default:
      next = false;
      subsequent = false;
  }

  return {
    next: (!next || next.value === 0) ? false : next,
    subsequent: (!subsequent || subsequent.value === 0) ? false : subsequent
  }
}

const areInSameRow = (current, next, subsequent) => (current.row === next.row && current.row === subsequent.row);
const areInSameColumn = (current, next, subsequent) => (current.col === next.col && current.col === subsequent.col);
const removeDuplicatesFromArray = (arr) => [...new Set(arr)];

export {getCompletedSequences};
