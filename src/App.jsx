import { useState } from "react";
import "./App.css";
import sineSVG from "./assets/sine.svg";
import histSVG from "./assets/histogram.svg";


function Screen() {
  return <canvas id="screen"></canvas>;
}

function RadioBtn( { timeDomain } ) {
  const [displayTime, setDisplayTime] = useState(true);

  function handleClick() {
    setDisplayTime(!displayTime);
    timeDraw = timeDomain;
  }

  return (
    <div>
      <button onClick={handleClick}> 
        <img src={timeDomain ? sineSVG : histSVG} />
      </button>
    </div>
  );
}


function Toggle() {
  return (
    <button class="toggle" type="button" aria-pressed="true"> 

    </button>
  )
}


function Console() {
  return (
    <div id="console">
      <Screen />
      <div>
        <RadioBtn timeDomain={true}></RadioBtn>
        <RadioBtn timeDomain={false}></RadioBtn>
        <Toggle></Toggle>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Console></Console>
    </>
  );
}

export default App;
