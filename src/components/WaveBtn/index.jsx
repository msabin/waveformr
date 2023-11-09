import squareSVG from "../../assets/square.svg";
import sawtoothSVG from "../../assets/sawtooth.svg";
import sineSVG from "../../assets/sine.svg";
import lineSVG from "../../assets/line.svg";

const SHAPES = {
  sine: sineSVG, 
  square: squareSVG,
  sawtooth: sawtoothSVG,
  line: lineSVG
}

export function WaveBtn({ shape, onClick }) {
  let svg = SHAPES[shape];

  return (
    <button className="wave-button" onClick={onClick}>
      <img src={svg} />
    </button>
  );
}
