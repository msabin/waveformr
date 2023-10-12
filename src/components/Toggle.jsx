import sineSVG from "../assets/sine.svg";
import histSVG from "../assets/histogram.svg";

export function Toggle( { isPressed, onToggle } ) {

  return (
    <>
      <div>
        <img className="digital-display" src={sineSVG} />
      </div>

      <button
        className="toggle"
        type="button"
        aria-pressed={isPressed}
        onClick={onToggle}
      ></button>

      <div>
        <img className="digital-display" src={histSVG} />
      </div>
    </>
  );
}