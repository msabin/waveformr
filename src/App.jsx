// import { useState } from "react";
import "./App.css";
// import sineSVG from "./assets/sine.svg";
// import histSVG from "./assets/histogram.svg";
// import squareSVG from "./assets/square.svg"
// import sawtoothSVG from "./assets/sawtooth.svg"
// import { Screen } from "./components/Screen";
import { Console } from "./components/Console";

// function RadioBtn({ timeDomain }) {
//   // const [displayTime, setDisplayTime] = useState(true);

//   function handleClick() {
//     // setDisplayTime(!displayTime);
//     timeDraw = timeDomain;
//   }

//   return (
//     <button onClick={handleClick}>
//       <img src={timeDomain ? squareSVG : sawtoothSVG} />
//     </button>
//   );
// }

// function Toggle() {
//   const [isPressed, setIsPressed] = useState(timeDraw);

//   function handleClick() {
//     timeDraw = !isPressed;
//     setIsPressed(timeDraw);
//   }

//   return (
//     <>
//       <div>
//         <img className="digital-display" src={sineSVG} />
//       </div>

//       <button
//         className="toggle"
//         type="button"
//         aria-pressed={isPressed}
//         onClick={handleClick}
//       ></button>

//       <div>
//         <img className="digital-display" src={histSVG} />
//       </div>
//     </>
//   );
// }


// function HzDisplay () {

//   const [newHz, setNewHz] = useState(Hz);

//   function handleUpClick() {
//     Hz *= 2 ** (1 / 12);
//     osc.frequency.setValueAtTime(Hz, context.currentTime);
//     setNewHz(Hz.toFixed(2));
//   }

//   function handleDownClick() {
//     Hz /= 2 ** (1 / 12);
//     osc.frequency.setValueAtTime(Hz, context.currentTime);
//     setNewHz(Hz.toFixed(2));
//   }

//   return (
//     <div>
//       <button className="up-arrow" onClick={handleUpClick}></button>

//       <p className="digital-display"> {newHz} </p>

//       <button className="down-arrow" onClick={handleDownClick}></button>
//     </div>
//   )

// }






// function Console() {
//   return (
//     <div id="console">
//       <HzDisplay></HzDisplay>
//       <div>
//         <Screen />
//         <div>
//           <RadioBtn timeDomain={true}></RadioBtn>
//           <RadioBtn timeDomain={false}></RadioBtn>
//         </div>
//       </div>
//       <div>
//         <Toggle></Toggle>
//       </div>
//     </div>
//   );
// }

function App() {
  return <Console></Console>;
}

export default App;
