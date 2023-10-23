import squareSVG from "../assets/square.svg"
import sawtoothSVG from "../assets/sawtooth.svg"
import sineSVG from "../assets/sine.svg"
import lineSVG from "../assets/line.svg";


export function WaveBtn({ shape, onClick }) {
  // const svg = eval(shape+"SVG")

  let svg;
  switch (shape) {
    case "sine":
      svg = sineSVG;
      break;
    case "square":
      svg = squareSVG;
      break;
    case "sawtooth":
      svg = sawtoothSVG;
      break;
    case "line":
      svg = lineSVG;
      break;
  }

  return (
    <button className="wave-button" onClick={onClick}>
      <img src={svg} />
    </button>
  );
}