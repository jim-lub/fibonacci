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
  }

  initializeCells({rows, cols}) {
    let cells = [], i = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          key: i++,
          row: r,
          col: c,
          value: 0,
          cssClass: null
        });
      }
    }

    return cells;
  }

  handleClick(cell) {
    this.incrementRowAndColumnn(cell);
  }

  /*
  * Incrementing rows and columns
  */
  incrementRowAndColumnn({row, col}) {
    const cellsArr = this.state.cells.slice();

    const cellsToIncrement = this.removeDuplicatesFromArray([...this.getKeysFromRow(row), ...this.getKeysFromColumn(col)]);

    cellsToIncrement.forEach(cell => {
      cellsArr[cell.key].value = ++cell.value;
      cellsArr[cell.key].cssClass = "cell-activated";
    });

    this.setState({cells: cellsArr});
  }

  getKeysFromRow(row) {
    return this.state.cells.filter(cell => cell.row === row);
  }

  getKeysFromColumn(col) {
    return this.state.cells.filter(cell => cell.col === col);
  }

  removeDuplicatesFromArray(arr) {
    return [...new Set(arr)];
  }

  /*
  * Fibonacci
  */


  /*
  * Render
  */
  render() {
    const cells = this.state.cells.map(cell => {
      return (
        <Cell
          key={cell.key}
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
