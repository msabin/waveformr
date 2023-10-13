import squareSVG from "../assets/square.svg"
import sawtoothSVG from "../assets/sawtooth.svg"
import sineSVG from "../assets/sine.svg"
import lineSVG from "../assets/line.svg";


export function WaveBtn({ shape, onClick }) {
  const svg = eval(shape+"SVG")

  return (
    <button onClick={onClick}>
      <img src={svg} />
    </button>
  );
}