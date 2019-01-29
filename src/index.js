import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Cell extends React.Component {
  render() {
    return (
      <button className={"cell " + this.props.cssClass}
              onClick={() => this.props.onClick({value: this.props.value})}>
        {(this.props.value !== 0 ? this.props.value : "")}
      </button>
    );
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.props.rows,
      cols: this.props.cols,
      cells: this.initializeCells(this.props)
    };
    this.lastActiveCells = [];
    this.countRecursion = 0;
  }

  initializeCells({rows, cols}) {
    let cells = [], i = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          index: i++,
          row: r,
          col: c,
          value: 0,
          cssClass: null
        });
      }
    }

    return cells;
  }

  componentDidUpdate() {
  }

  handleClick(cell) {
    this.removeActiveClassFromCells();
    this.incrementRowAndColumn(cell);
    this.findFibonacciSequences();
  }

  removeActiveClassFromCells() {
    const cellsArr =this.state.cells.slice();

    this.lastActiveCells.forEach(cell => {
      cellsArr[cell.index].cssClass = "";
    });

    this.lastActiveCells = [];

    this.setState({cells: cellsArr});
  }

  /*
  * Incrementing rows and columns
  */
  incrementRowAndColumn({row, col}) {
    const cellsArr = this.state.cells.slice();

    const cellsToIncrement = this.removeDuplicatesFromArray([...this.getIndexFromRow(row), ...this.getIndexFromColumn(col)]);

    cellsToIncrement.forEach(cell => {
      cellsArr[cell.index].value = ++cell.value;
      cellsArr[cell.index].cssClass = "cell-activated";
    });

    this.lastActiveCells = cellsToIncrement;
    this.setState({cells: cellsArr});
  }

  getIndexFromRow(row) {
    return this.state.cells.filter(cell => cell.row === row);
  }

  getIndexFromColumn(col) {
    return this.state.cells.filter(cell => cell.col === col);
  }

  /*
  * Fibonacci
  */
  findFibonacciSequences() {
    const cellsArr = [...this.state.cells];
    let completedSequences = [];

    this.lastActiveCells.forEach(cur => {
      let cell = cellsArr[cur.index];

      completedSequences = [...completedSequences,
                            ...this.findHorizontalSequences(cell),
                            ...this.findVerticalSequences(cell)];
    });

    this.removeDuplicatesFromArray(completedSequences)
        .forEach(index => {
          let cell = cellsArr[index];

          cell.value = 0;
          cell.cssClass = "cell-reset";
        })
  }

  findHorizontalSequences({index}) {
    const cellsArr = [...this.state.cells];
    let sequence1 = [], sequence2 = [];

    this.findHorizontalSequences_loop('left', index, cellsArr, sequence1);
    this.findHorizontalSequences_loop('right', index, cellsArr, sequence2);

    let sequenceArr = this.removeDuplicatesFromArray([index, ...sequence1, ...sequence2]);

    return (sequenceArr.length >= 5) ? sequenceArr : [];
  }

  findHorizontalSequences_loop(direction, index, cellsArr, sequence) {
    let directionModifier = (direction === 'right') ? 1 : -1;

    let cur = cellsArr[index];
    let next = cellsArr[index + (1 * directionModifier)];
    let subsequent = cellsArr[index + (2 * directionModifier)];

    if (!cur || !next || !subsequent) return; // check for existence
    if (cur.value === 0 || next.value === 0 || subsequent.value === 0) return; // check if has a value
    if (cur.row !== next.row || cur.row !== subsequent.row) return; // check if on same row

    if (cur.value + (next.value * directionModifier) === subsequent.value) {
      sequence.push(cur.index, next.index, subsequent.index);

      this.findHorizontalSequences_loop(direction, index + (1 * directionModifier), cellsArr, sequence);
    }

    return sequence;
  }

  findVerticalSequences({index}) {
    const cellsArr = [...this.state.cells];
    let sequence1 = [], sequence2 = [];

    this.findVerticalSequences_loop('up', index, cellsArr, sequence1);
    this.findVerticalSequences_loop('down', index, cellsArr, sequence2);

    let sequenceArr = this.removeDuplicatesFromArray([index, ...sequence1, ...sequence2]);

    return (sequenceArr.length >= 5) ? sequenceArr : [];
  }

  findVerticalSequences_loop(direction, index, cellsArr, sequence) {
    let directionModifier = (direction === 'down') ? 1 : -1;
    let columns = this.state.cols;

    let cur = cellsArr[index];
    let next = cellsArr[index + (columns * directionModifier)];
    let subsequent = cellsArr[index + ((columns * 2) * directionModifier)];

    if (!cur || !next || !subsequent) return; // check for existence
    if (cur.value === 0 || next.value === 0 || subsequent.value === 0) return; // check if has a value
    if (cur.col !== next.col || cur.col !== subsequent.col) return; // check if on same column

    if (cur.value + (next.value * directionModifier) === subsequent.value) {
      sequence.push(cur.index, next.index, subsequent.index);

      this.findVerticalSequences_loop(direction, index + (columns * directionModifier), cellsArr, sequence);
    }

    return sequence;
  }


  /*
  *  Utils
  */
  removeDuplicatesFromArray(arr) {
    return [...new Set(arr)];
  }


  /*
  * Render
  */
  render() {
    const cells = this.state.cells.map(cell => {
      return (
        <Cell
          key={cell.index}
          value={cell.value}
          cssClass={cell.cssClass}
          onClick={() => this.handleClick(cell)}
        />
      );
    });

    return (
      <div className="grid">
        {cells}
      </div>
    );
  }
}

ReactDOM.render(
  <Grid rows={20} cols={20} />,
  document.getElementById('root')
);
