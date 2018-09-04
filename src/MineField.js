import React, { Component } from 'react';
import './App.css';

export default class MineField extends Component {
  constructor(props){
    super(props);
    this.state = {
      fieldWidth: 4,
      numOfMines: 3,
      field: [],
      remainingSquares: 9
    }
    this.makeMines= this.makeMines.bind(this);
    this.selectMines= this.selectMines.bind(this);
    this.makeField = this.makeField.bind(this);
    this.makeEmptyField = this.makeEmptyField.bind(this);
    this.placeMines = this.placeMines.bind(this);
    this.addNearbyMineCounts = this.addNearbyMineCounts.bind(this);
    this.squareExists = this.squareExists.bind(this);
    this.incrementCount = this.incrementCount.bind(this);
  }
// later, this.makeField() will be call onClick 'GO' ONLY
  componentWillMount () {
    this.makeField();
  }

  makeMines = function (){
    let numOfMines = this.state.numOfMines;
    let fieldWidth = this.state.fieldWidth;
    let fieldSize = fieldWidth * fieldWidth;
    let mines = this.selectMines(fieldSize, numOfMines);
    mines = this.convertTo2D(mines, fieldWidth);
    return mines;
  }
  selectMines = function (fieldSize, numOfMines){
    let mineLocations = new Set();
    while (mineLocations.size < numOfMines){
      let mine = Math.floor(Math.random() * fieldSize);
      mineLocations.add(mine);
    }
    mineLocations = [...mineLocations];
    return mineLocations;
  }
  convertTo2D = function(mineList, fieldWidth) {
    let mines2D = [];
    for (let idx = 0; idx < mineList.length; idx++){
      let row = Math.floor(mineList[idx] / fieldWidth);
      let col = Math.floor(mineList[idx] % fieldWidth);
      let mineSquare = [row, col];
      mines2D.push(mineSquare);
    }
    return mines2D;
  }

  makeField = function (){
    let fieldWidth = this.state.fieldWidth;
    let field = this.makeEmptyField(fieldWidth);
    let mines = this.makeMines();
    field = this.placeMines(field, mines);
    field = this.addNearbyMineCounts(field, mines);
    this.setState({field})
  }
  makeEmptyField = function (fieldWidth) {
    var field = new Array(fieldWidth);
    for (let i = 0; i < fieldWidth; i++) {
      field[i] = new Array(fieldWidth);
      for (let k = 0; k < fieldWidth; k++){
        field[i][k] = {mine: false, count: 0};
      }
    }
    return field;
  }
  placeMines = function(field, mines){
    for (let mIdx = 0; mIdx < mines.length; mIdx++){
      let mineRow = mines[mIdx][0];
      let mineCol = mines[mIdx][1];
      let square = field[mineRow][mineCol];
      let updatedSquare = {...square, mine: true};
      field[mineRow][mineCol] = updatedSquare;
    }
    return field;
  }
  addNearbyMineCounts = function (field, mines){
    for (let mIdx = 0; mIdx < mines.length; mIdx++){
      let mineRow = mines[mIdx][0];
      let mineCol = mines[mIdx][1];

      let shiftRowBy = [-1, -1, -1, 0, 0, 1, 1, 1];
      let shiftColBy = [-1, 0, 1, -1, 1, -1, 0, 1];

      for (let sIdx = 0; sIdx < shiftRowBy.length; sIdx++){
        let nearbySqRow = mineRow + shiftRowBy[sIdx];
        let nearbySqCol = mineCol + shiftColBy[sIdx];
        if (this.squareExists(nearbySqRow, nearbySqCol, field)){
         field[nearbySqRow][nearbySqCol] = this.incrementCount(field[nearbySqRow][nearbySqCol]);
        }
      }
    }
    return field;
  }
  squareExists = function (row, col, field){
    if (row >= 0 && row < field.length && col >= 0 && col < field.length){
      return true;
    }
  }
  incrementCount = function (square){
    let updatedSquare = {...square, count: square.count+1};
    return updatedSquare;
  }

  render() {
    let field = this.state.field;
    return (
      <div className="mine-field-container">
        <table>
          <tbody>
            {
              field.map((row, i) =>
                <tr key={i}>
                {
                  row.map((sq, i) =>
                    <td key={i}>{sq.mine ? 'X' : sq.count}</td>
                  )
                }
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}



