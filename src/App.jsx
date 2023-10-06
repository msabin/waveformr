import { useState } from "react";
import "./App.css";
import sineSVG from "./assets/sine.svg";
import histSVG from "./assets/histogram.svg";
import { Screen } from "./components/Screen";

function RadioBtn({ timeDomain }) {
  // const [displayTime, setDisplayTime] = useState(true);

  function handleClick() {
    // setDisplayTime(!displayTime);
    timeDraw = timeDomain;
  }

  return (
    <button onClick={handleClick}>
      <img src={timeDomain ? sineSVG : histSVG} />
    </button>
  );
}

function Toggle() {
  const [isPressed, setIsPressed] = useState(timeDraw);

  function handleClick() {
    timeDraw = !isPressed;
    setIsPressed(timeDraw);
  }

  return (
    <>
      <div>
        <img src={sineSVG} />
      </div>

      <button
        class="toggle"
        type="button"
        aria-pressed={isPressed}
        onClick={handleClick}
      ></button>

      <div>
        <img src={histSVG} />
      </div>
    </>
  );
}


function HzDisplay () {


  return (
    <div>
      <button class="up-arrow"></button>

      <p id="hz-display"> 440 </p>

      <button class="down-arrow"></button>
    </div>
  )

}






function Console() {
  return (
    <div id="console">
      <HzDisplay></HzDisplay>
      <div>
        <Screen />
        <div>
          <RadioBtn timeDomain={true}></RadioBtn>
          <RadioBtn timeDomain={false}></RadioBtn>
        </div>
      </div>
      <div>
        <Toggle></Toggle>
      </div>
    </div>
  );
}

function App() {
  return <Console></Console>;
}

export default App;
