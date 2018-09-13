import React, { Component } from 'react';
import './App.css';
import Container from './Container';
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Minesweeper</h1>
        </header>
        <p className="App-intro">
          To get started, choose a field width and a level and click start!
        </p>
        <Container />
      </div>
    );
  }
}

export default App;
