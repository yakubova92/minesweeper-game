import React, { Component } from 'react';
import './App.css';

export default class MineField extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  // fires when user left-clicks a square. If square is a mine, game is over. If not a mine, counts towards a win is updated and square is revealed. If last square is clicked and user wins, alert.
  handleClick = function (event, sq, row, col){
    if (sq.display === 'revealed') return;
    if (sq.display === 'flagged'){
      let remainingMines = this.props.fieldInfo.remainingMines;
      remainingMines += 1;
      this.props.handleRightClick(remainingMines);
    }
    sq.display = 'revealed';
    if (sq.mine){
      sq.display = 'mine';
      this.props.revealAll();
      alert('You lose. Play again?')
    }else{
      let remaining = this.props.fieldInfo.remainingSquares;
      remaining -= 1;
      this.props.handleClick(remaining);
    }
    if (sq.count === 0){
      let minefield = this.props.fieldInfo.field
      let sqCoord = [row, col]
      this.props.findZeros(minefield, sqCoord)
    }
    if (this.props.fieldInfo.remainingMines === 0 && this.props.fieldInfo.remainingSquares <= 1){
      alert('You win! Play again?')
    }
    return;
  }

  // findZeros = function (minefield, zeroSqs){
  //   do {
  //     zeroSqs = findSurrounding(minefield, zeroSqs)
  //   } while (zeroSqs.length > 0)
  // }

  // fires when a user right-clicks a square. Square is flagged and counts towards a win is updated.
  handleRightClick = function (event, sq){
    event.preventDefault()
    if (sq.display === 'revealed' || sq.display === 'flagged') return;
    sq.display = 'flagged';
    let remainingMines = this.props.fieldInfo.remainingMines;
    remainingMines--;
    this.props.handleRightClick(remainingMines);
  }

  render (){
    let field = this.props.fieldInfo.field
    return (
      <div className="mine-field-container">
        <table>
          <tbody>
            {
              field.map((row, r) =>
                <tr key={r}>
                {
                  row.map((sq, c) =>
                    <td key={c} className="square"
                    onClick={ (event) => this.handleClick(event, sq, r, c)}
                    onContextMenu={(event) => this.handleRightClick(event, sq)}>
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
    )
  }
}
