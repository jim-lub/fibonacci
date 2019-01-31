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

  componentDidUpdate() {}

  handleClick(cell) {
    this.removeActiveClassFromCells();
    this.incrementRowAndColumn(cell);
    this.findFibonacciSequences();
  }

  removeActiveClassFromCells() {
    const cellsArr = [...this.state.cells];

    this.lastActiveCells.forEach(cell => {
      cellsArr[cell.index].cssClass = "";
    });

    this.lastActiveCells = [];

    this.setState({cells: cellsArr});
  }

  /*
  * Incrementing values on rows and columns
  */
  incrementRowAndColumn({row, col}) {
    const cellsArr = [...this.state.cells];

    const cellsToIncrement = this.removeDuplicatesFromArray([...this.getIndexesFromRow(row), ...this.getIndexesFromColumn(col)]);

    cellsToIncrement.forEach(cell => {
      cellsArr[cell.index].value = ++cell.value;
      cellsArr[cell.index].cssClass = "cell-activated";
    });

    this.lastActiveCells = cellsToIncrement;
    this.setState({cells: cellsArr});
  }

  getIndexesFromRow(row) {
    return this.state.cells.filter(cell => cell.row === row);
  }

  getIndexesFromColumn(col) {
    return this.state.cells.filter(cell => cell.col === col);
  }

  /*
  * Fibonacci
  */
  findFibonacciSequences() {
    const cellsArr = [...this.state.cells];
    let completedSequences = [];

    this.lastActiveCells.forEach(cur => {

      let hor = [...this.step('right', cur.index, cellsArr),
                 ...this.step('left', cur.index, cellsArr)];

      let ver = [...this.step('down', cur.index, cellsArr),
                 ...this.step('up', cur.index, cellsArr)];

      ver = this.removeDuplicatesFromArray(ver);
      hor = this.removeDuplicatesFromArray(hor);

      if (hor.length >= 5) completedSequences = [...completedSequences, ...hor];
      if (ver.length >= 5) completedSequences = [...completedSequences, ...ver];
    });

    this.removeDuplicatesFromArray(completedSequences)
        .forEach(index => {
          let cell = cellsArr[index];

          cell.value = 0;
          cell.cssClass = "cell-reset";
        });
  }

  step(direction, index, cellsArr) {
    const directionModifier = (direction === 'right' || direction === 'down') ? 1 : -1;

    const current = cellsArr[index];
    const {next, subsequent} = this.getNextCells(direction, index, cellsArr);

    if (!current || !next || !subsequent) return [...[]];

    if (current.value + (next.value * directionModifier) === subsequent.value) {
      return [current.index,
              next.index,
              subsequent.index,
              ...this.step(direction, next.index, cellsArr)];
    }

    return [...[]]
  }

  getNextCells(direction, index, cellsArr) {
    let next, subsequent;

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
        next = cellsArr[index + this.state.cols];
        subsequent = cellsArr[index + (this.state.cols * 2)];
        break;
      case 'up':
        next = cellsArr[index - this.state.cols];
        subsequent = cellsArr[index - (this.state.cols * 2)];
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
  <Grid rows={50} cols={50} />,
  document.getElementById('root')
);
