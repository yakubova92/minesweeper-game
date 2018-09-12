import React, { Component } from 'react';
import OptionsBar from './OptionsBar';
import MineField from './MineField';
import './App.css';

export default class Container extends Component {
  constructor(props){
    super(props);
    this.state = {
      field: [],
      fieldWidth: 10,
      level: 'easy',
      numOfMines: 0,
      remainingMines: 0,
      remainingSquares: 0
    }
    this.addNearbyMineCounts = this.addNearbyMineCounts.bind(this);
    this.createLevel = this.createLevel.bind(this);
    this.findZeros = this.findZeros.bind(this);
    this.findSurrounding = this.findSurrounding.bind(this);
    this.handleFieldInfoChange = this.handleFieldInfoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.incrementCount = this.incrementCount.bind(this);
    this.makeEmptyField = this.makeEmptyField.bind(this);
    this.makeField = this.makeField.bind(this);
    this.makeMines= this.makeMines.bind(this);
    this.placeMines = this.placeMines.bind(this);
    this.revealAll = this.revealAll.bind(this);
    this.selectMines= this.selectMines.bind(this);
    this.squareClicked = this.squareClicked.bind(this);
    this.squareExists = this.squareExists.bind(this);
    this.squareFlagged = this.squareFlagged.bind(this);
  }

  // increments the count of all nearby squares for each mine
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

  // converts 1D array of mines to 2D array
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

  // determines number of mines for the game in response to user input: easy/medium/hard
  createLevel = function(level, fieldSize){
    let numOfMines;
    if (level === 'easy'){
      numOfMines = Math.floor(.1 * fieldSize)
    }else if (level === 'medium'){
      numOfMines = Math.floor(.25 * fieldSize)
    }else if (level === 'hard'){
      numOfMines = Math.floor(.4 * fieldSize)
    }
    return numOfMines;
  }

  findZeros = function(minefield, zeroSqs){
    console.log('tryina find them zeros')
    zeroSqs = [zeroSqs]
    console.log('zero coord', zeroSqs)
    do {
      zeroSqs = this.findSurrounding(minefield, zeroSqs)
      console.log('zeroSqs in findZeros func')
    } while (zeroSqs.length > 0)
  }
  findSurrounding = function (field, zeroSqs){
    let surroundingZeros = [];
    console.log('ZEROS', surroundingZeros)
    console.log('array of zeros in argument', zeroSqs)
    for (let idx = 0; idx < zeroSqs.length; idx++){
      let zeroSqRow = zeroSqs[idx][0];
      let zeroSqCol = zeroSqs[idx][1];

      let shiftRowBy = [-1, -1, -1, 0, 0, 1, 1, 1];
      let shiftColBy = [-1, 0, 1, -1, 1, -1, 0, 1];

      for (let sIdx = 0; sIdx < shiftRowBy.length; sIdx++){
        let nearbySqRow = zeroSqRow + shiftRowBy[sIdx];
        let nearbySqCol = zeroSqCol + shiftColBy[sIdx];
        if (this.squareExists(nearbySqRow, nearbySqCol, field)){
          let sq = field[nearbySqRow][nearbySqCol];
          if (sq.count === 0 && sq.display !== 'revealed' ){
            // if count is zero, do recursion
            surroundingZeros.push([nearbySqRow, nearbySqCol])
          }
          if (!sq.mine && sq.display !== 'revealed') {
            sq.display = 'revealed';
            console.log('revealed', [nearbySqRow, nearbySqCol])
          }

        }
      }
    }
    console.log('SurroundingZeros', surroundingZeros)
    return surroundingZeros
  }

  // updates state based on user input (width of minefield, level)
  handleFieldInfoChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // generates the clickable minefield when start is clicked
  handleSubmit(event) {
    event.preventDefault();
    this.makeField()
  }

  // helper function for addNearbyMineCounts: increments squares mineCount property
  incrementCount = function (square){
    let updatedSquare = {...square, count: square.count+1};
    return updatedSquare;
  }

  // generates a 2D array, where each element is an object describing the square.
  makeEmptyField = function (fieldWidth) {
    var field = new Array(fieldWidth);
    for (let i = 0; i < fieldWidth; i++) {
      field[i] = new Array(fieldWidth);
      for (let k = 0; k < fieldWidth; k++){
        field[i][k] = {mine: false, count: 0, display: 'hidden'};
      }
    }
    return field;
  }

  // generates a minefield with mines and mine counts for squares near mines
  makeField = function (){
    let fieldWidth = this.state.fieldWidth;
    let fieldSize = fieldWidth * fieldWidth;
    let level = this.state.level;
    let numOfMines = this.createLevel(level, fieldSize);
    let remainingMines = numOfMines;
    let remainingSquares = fieldSize - numOfMines;
    let field = this.makeEmptyField(fieldWidth);
    let mines = this.makeMines(numOfMines, fieldWidth, fieldSize);
    field = this.placeMines(field, mines);
    field = this.addNearbyMineCounts(field, mines);
    this.setState({field, numOfMines, remainingSquares, remainingMines})
  }

  // randomly selects mine locations using helper functions
  makeMines = function (numOfMines, fieldWidth, fieldSize){
    let mines = this.selectMines(fieldSize, numOfMines);
    mines = this.convertTo2D(mines, fieldWidth);
    return mines;
  }

  // updates the objects on the squares in the field to reflect that they have mines
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

  // called when mine is clicked and game is over, changes display property on all squares to 'revealed'
  revealAll = function (){
    let field = this.state.field;
    for (let row = 0; row < field.length; row++){
      for (let col = 0; col < field.length; col++){
        let sq = field[row][col];
        sq.display = 'revealed'
      }
    }
    this.setState({field})
  }

  // randomly selects mines based on the size of the minefield and the level of difficulty
  selectMines = function (fieldSize, numOfMines){
    let mineLocations = new Set();
    while (mineLocations.size < numOfMines){
      let mine = Math.floor(Math.random() * fieldSize);
      mineLocations.add(mine);
    }
    mineLocations = [...mineLocations];
    return mineLocations;
  }

  // fired when user left-clicks a square, updates the state to help determine when user won
  squareClicked = function (remainingSquares){
    this.setState({remainingSquares})
  }

  // determines if a square near a mine exists, so that it's mine count can be incremented by another helper function (incrementCount)
  squareExists = function (row, col, field){
    if (row >= 0 && row < field.length && col >= 0 && col < field.length){
      return true;
    }
  }

  // fired when user right-clicks a square, updates the state to help determine when user won as well as display remaining mine count
  squareFlagged = function (remainingMines){
    this.setState({remainingMines})
  }

  render() {
    console.log('STATE', this.state)
    return (
      <div>
        <OptionsBar fieldInfo={this.state} handleChange={this.handleFieldInfoChange} handleSubmit={this.handleSubmit} />

        <div>
          <p>Mines: {this.state.remainingMines} </p>
        </div>

        <MineField fieldInfo={this.state} handleClick={this.squareClicked} handleRightClick={this.squareFlagged} revealAll={this.revealAll} findZeros={this.findZeros}/>

      </div>
    );
  }
}



