import sineSVG from "./assets/sine.svg";
import histSVG from "./assets/histogram.svg";

function Toggle() {
  const [isPressed, setIsPressed] = useState(timeDraw);

  function handleClick() {
    timeDraw = !isPressed;
    setIsPressed(timeDraw);
  }

  return (
    <>
      <div>
        <img className="digital-display" src={sineSVG} />
      </div>

      <button
        className="toggle"
        type="button"
        aria-pressed={isPressed}
        onClick={handleClick}
      ></button>

      <div>
        <img className="digital-display" src={histSVG} />
      </div>
    </>
  );
}