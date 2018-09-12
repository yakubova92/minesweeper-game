import React, { Component } from 'react';
import './App.css';

export default class OptionsBar extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // updates state when fieldWidth or level are changed
  handleChange = function (event){
    this.props.handleChange(event)
  }

  // starts the game
  handleSubmit = function (event){
    this.props.handleSubmit(event);
  }

  render (){
    return (
      <div className="options">
        <form onSubmit={this.handleSubmit}>
          <label>
            Minefield Width:
            <input type="number" name="fieldWidth" defaultValue={this.props.fieldInfo.fieldWidth} onChange={this.handleChange} />
          </label>
          <br />
          <label>
            Level:
            <select name="level" value={this.props.fieldInfo.level} onChange={this.handleChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <input type="submit" value="START" />
        </form>
      </div>
    )
  }
}
