import React, { Component } from 'react';
import './App.css';

export default class OptionsBar extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = function (event){
    console.log('hi from the OptionsBar handleChange func')
    console.log('this.props', this.props)
    this.props.handleChange(event)
    console.log('field info EVENT', event);
  }
  handleSubmit = function (event){
    this.props.handleSubmit(event);
  }

  render (){
    console.log('PROPS in OptionsBar', this.props)
    return (
      <div className="options">
      <form onSubmit={this.handleSubmit}>
        <label>
          Minefield Width:
          <input type="number" name="fieldWidth" defaultValue={this.props.fieldInfo.fieldWidth} onChange={this.handleChange} />
        </label>
        <label>
          Level:
          <select name="level" value={this.props.fieldInfo.level} onChange={this.handleChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
    )
  }
}
