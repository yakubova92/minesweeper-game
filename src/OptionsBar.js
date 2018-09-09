// import React, { Component } from 'react';
// import './App.css';

// export default class OptionsBar extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       fieldWidth: 0,
//       numOfMines: 0,
//       field: [],
//       remainingSquares: 0
//     }
//     this.setFieldInfo = this.setFieldInfo.bind(this);
//   }
// // later, this.makeField() will be call onClick 'GO' ONLY
//   // componentWillMount () {
//   // }

//   setFieldInfo = function (event){
//     console.log('field info EVENT', event);
//   }

//   render (){
//     return (
//       <div>
//         <form className="fieldInfo" onSubmit={event => this.setFieldInfo(event)}>
//           <input type="number" name="boardWidth" defaultValue="10"/>
//           <div>
//             <input type="radio" name="level" value="easy"/> Easy
//             <input type="radio" name="level" value="medium"/> Medium
//             <input type="radio" name="level" value="hard"/> Hard
//           </div>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     )
//   }
// }
