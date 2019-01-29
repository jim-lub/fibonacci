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
    this.lastActive = [];
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
    this.incrementRowAndColumnn(cell);
    this.findSequences();
  }

  removeActiveClassFromCells() {
    const cellsArr =this.state.cells.slice();

    this.lastActive.forEach(cell => {
      cellsArr[cell.index].cssClass = "";
    });

    this.lastActive = [];

    this.setState({cells: cellsArr});
  }

  /*
  * Incrementing rows and columns
  */
  incrementRowAndColumnn({row, col}) {
    const cellsArr = this.state.cells.slice();

    const cellsToIncrement = this.removeDuplicatesFromArray([...this.getIndexFromRow(row), ...this.getIndexFromColumn(col)]);

    cellsToIncrement.forEach(cell => {
      cellsArr[cell.index].value = ++cell.value;
      cellsArr[cell.index].cssClass = "cell-activated";
    });

    this.lastActive = cellsToIncrement;
    this.setState({cells: cellsArr});
  }

  getIndexFromRow(row) {
    return this.state.cells.filter(cell => cell.row === row);
  }

  getIndexFromColumn(col) {
    return this.state.cells.filter(cell => cell.col === col);
  }

  removeDuplicatesFromArray(arr) {
    return [...new Set(arr)];
  }

  /*
  * Fibonacci
  */
  findSequences() {
    let completed = [];

    const cellsArr = this.state.cells.slice();

    this.lastActive.forEach(cell => {
      completed = [...completed, ...this.horizontal(cellsArr[cell.index]),
                                  ...this.vertical(cellsArr[cell.index])];
    });

    console.log(completed);

    this.removeDuplicatesFromArray(completed).forEach(index => {
      cellsArr[index].value = 0;
      cellsArr[index].cssClass = "cell-reset";
    });
  }

  horizontal(cell, completed) {
    const cellsArr = this.state.cells.slice();
    let sequence = [];
    let sequence2 = [];

    this.forward(cell.index, cellsArr, sequence);
    this.backward(cell.index, cellsArr, sequence2);

    let array = this.removeDuplicatesFromArray([cell.index,...sequence, ...sequence2]);

    if (array.length >= 5) {
      return array;
    } else {
      return [];
    }
  }

  vertical(cell, completed) {
    const cellsArr = this.state.cells.slice();
    let sequence = [];
    let sequence2 = [];

    this.down(cell.index, cellsArr, sequence);
    this.up(cell.index, cellsArr, sequence2);

    let array = this.removeDuplicatesFromArray([cell.index,...sequence, ...sequence2]);

    if (array.length >= 5) {
      return array;
    } else {
      return [];
    }
  }

  forward(index, cellsArr, sequence) {
    let current = cellsArr[index].value;
    let next = this.getNextValue(index + 1);
    let nextnext = this.getNextNextValue(index + 2);

    if (!cellsArr[index] || current === 0 || next === 0 || nextnext === 0) return;

    if (current + next === nextnext) {
      sequence.push(index, index + 1, index + 2);
      this.forward(index + 1, cellsArr, sequence);
    }
    return sequence;

  }

  backward(index, cellsArr, sequence) {
    let current = cellsArr[index].value;
    let prev = this.getPrevValue(index - 1);
    let prevprev = this.getPrevPrevValue(index - 2);

    if (!cellsArr[index] || current === 0 || prev === 0 || prevprev === 0) return;

    if (current - prev === prevprev) {
      sequence.push(index, index - 1, index - 2);
      this.backward(index - 1, cellsArr, sequence);
    }
    return sequence;

  }

  down(index, cellsArr, sequence) {
    let current = cellsArr[index].value;
    let next = this.getNextValue(index + this.state.cols);
    let nextnext = this.getNextNextValue(index + (this.state.cols * 2));

    if (!cellsArr[index] || current === 0 || next === 0 || nextnext === 0) return;

    if (current + next === nextnext) {
      sequence.push(index, index + this.state.cols, index + (this.state.cols * 2));
      this.down(index + this.state.cols, cellsArr, sequence);
    }
    return sequence;

  }

  up(index, cellsArr, sequence) {
    let current = cellsArr[index].value;
    let prev = this.getPrevValue(index - this.state.cols);
    let prevprev = this.getPrevPrevValue(index - (this.state.cols * 2));

    if (!cellsArr[index] || current === 0 || prev === 0 || prevprev === 0) return;

    if (current - prev === prevprev) {
      sequence.push(index, index - this.state.cols, index - (this.state.cols * 2));
      this.up(index - this.state.cols, cellsArr, sequence);
    }
    return sequence;

  }

  getNextValue(index) {
    return (index >= this.state.cells.length) ? 0 : this.state.cells[index].value;
  }

  getNextNextValue(index) {
    return (index >= this.state.cells.length) ? 0 : this.state.cells[index].value;
  }

  getPrevValue(index) {
    return (index < 0) ? 0 : this.state.cells[index].value;
  }

  getPrevPrevValue(index) {
    return (index < 0) ? 0 : this.state.cells[index].value;
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
