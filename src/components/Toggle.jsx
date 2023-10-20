import sineSVG from "../assets/sine.svg";
import histSVG from "../assets/histogram.svg";

export function Toggle( { isPressed, onToggle } ) {

  return (
    <>
      
      <img className="digital-display" src={sineSVG} />


      <button
        className="toggle"
        type="button"
        aria-pressed={isPressed}
        onClick={onToggle}
      ></button>

      
      <img className="digital-display" src={histSVG} />
    
    </>
  );
}