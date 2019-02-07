export const getCellsInRow = (row, cells) => cells.filter(cell => cell.row === row);
export const getCellsInColumn = (col, cells) => cells.filter(cell => cell.col === col);
export const areInSameRow = (a, b, c) => (a.row === b.row && a.row === c.row);
export const areInSameColumn = (a, b, c) => (a.col === b.col && a.col === c.col);
export const removeDuplicatesFromArray = (arr) => [...new Set(arr)];