import React, { Component } from 'react';
import './App.css';

export default class MineField extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    //this.revealAll = this.revealAll.bind(this);
  }

  handleClick = function (event, sq){
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
    if (this.props.fieldInfo.remainingMines === 0 && this.props.fieldInfo.remainingSquares <= 1){
      alert('You win! Play again?')
    }
    return;
  }
  handleRightClick = function (event, sq){
    event.preventDefault()
    sq.display = 'flagged';
    let remainingMines = this.props.fieldInfo.remainingMines;
    remainingMines--;
    this.props.handleRightClick(remainingMines);
  }
  // revealAll = function (){
  //   let field = this.props.fieldInfo.field;
  //   for (let row = 0; row < field.length; row++){
  //     for (let col = 0; col < field.length; col++){
  //       let sq = field[row][col];
  //       sq.display = 'revealed'
  //     }
  //   }
  //   this.setState({field})
  // }

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
