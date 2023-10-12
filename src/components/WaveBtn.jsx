import squareSVG from "../assets/square.svg"
import sawtoothSVG from "../assets/sawtooth.svg"
import sineSVG from "../assets/sine.svg"
import lineSVG from "../assets/line.svg";


export function WaveBtn({ shape }) {
  // const [displayTime, setDisplayTime] = useState(true);
  const svg = eval(shape+"SVG")

  function handleClick() {
    
  }

  return (
    <button onClick={handleClick}>
      <img src={svg} />
    </button>
  );
}