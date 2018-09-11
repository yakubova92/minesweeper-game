import React, { Component } from 'react';
import OptionsBar from './OptionsBar';
import './App.css';

export default class Container extends Component {
  constructor(props){
    super(props);
    this.state = {
      fieldWidth: 10,
      level: 'easy',
      numOfMines: 0,
      field: [],
      remainingSquares: 0,
      remainingMines: 0
    }
    this.handleFieldInfoChange = this.handleFieldInfoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createLevel = this.createLevel.bind(this);
    this.makeMines= this.makeMines.bind(this);
    this.selectMines= this.selectMines.bind(this);
    this.makeField = this.makeField.bind(this);
    this.makeEmptyField = this.makeEmptyField.bind(this);
    this.placeMines = this.placeMines.bind(this);
    this.addNearbyMineCounts = this.addNearbyMineCounts.bind(this);
    this.squareExists = this.squareExists.bind(this);
    this.incrementCount = this.incrementCount.bind(this);
    this.revealAll = this.revealAll.bind(this);
  }

  handleFieldInfoChange(event) {
    console.log('hi from the Container handleFieldInfoChange func')
    console.log('event.target.name', event.target.name)
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.makeField()
  }

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

  makeMines = function (numOfMines, fieldWidth, fieldSize){
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

  squareClicked = function (event, sq){
    sq.display = 'revealed';
    if (sq.mine){
      sq.display = 'mine';
      this.revealAll();
      alert('You lose. Play again?')
    }else{
      let remaining = this.state.remainingSquares;
      remaining--;
      this.setState({remainingSquares: remaining});
    }
    if (this.state.remainingMines === 0 && this.state.remainingSquares <= 1){
      alert('You win! Play again?')
    }
    return;
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

  squareFlagged = function (event, sq){
    event.preventDefault()
    sq.display = 'flagged';
    let remainingMines = this.state.remainingMines;
    remainingMines--;
    this.setState({remainingMines})
  }

  render() {
    let field = this.state.field;
    console.log('STATE', this.state)
    return (
      <div>
        <OptionsBar handleChange={this.handleFieldInfoChange} handleSubmit={this.handleSubmit} fieldInfo={this.state}/>
        {/* <div className="options">
          <form onSubmit={this.handleSubmit}>
            <label>
              Minefield Width:
              <input type="number" name="fieldWidth" defaultValue={this.state.fieldWidth} onChange={this.handleChange} />
            </label>
            <label>
              Level:
              <select name="level" value={this.state.level} onChange={this.handleChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div> */}

        <div>
          <p>Mines: {this.state.remainingMines} </p>
        </div>

        <div className="mine-field-container">
          <table>
            <tbody>
              {
                field.map((row, i) =>
                  <tr key={i}>
                  {
                    row.map((sq, i) =>
                      <td key={i} className="square"
                      onClick={ (event) => this.squareClicked(event, sq)}
                      onContextMenu={(event) => this.squareFlagged(event, sq)}>
                      <button className={sq.display}> {sq.mine ? 'X' : sq.count} </button>
                      </td>
                    )
                  }
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}



