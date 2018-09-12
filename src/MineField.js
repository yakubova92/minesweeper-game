import React, { Component } from 'react';
import './App.css';

export default class MineField extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  // fires when user left-clicks a square. If square is a mine, game is over. If not a mine, counts towards a win is updated and square is revealed. If last square is clicked and user wins, alert.
  handleClick = function (event, sq){
    if (sq.display === 'revealed') return;
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
      console.log('you found a zero square and youre gonna clear a whole section!');
    }
    if (this.props.fieldInfo.remainingMines === 0 && this.props.fieldInfo.remainingSquares <= 1){
      alert('You win! Play again?')
    }
    return;
  }

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
              field.map((row, i) =>
                <tr key={i}>
                {
                  row.map((sq, i) =>
                    <td key={i} className="square"
                    onClick={ (event) => this.handleClick(event, sq)}
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
