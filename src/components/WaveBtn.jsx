import squareSVG from "../assets/square.svg"
import sawtoothSVG from "../assets/sawtooth.svg"


export function WaveBtn({ timeDomain }) {
  // const [displayTime, setDisplayTime] = useState(true);

  function handleClick() {
    // setDisplayTime(!displayTime);
    timeDraw = timeDomain;
  }

  return (
    <button onClick={handleClick}>
      <img src={timeDomain ? squareSVG : sawtoothSVG} />
    </button>
  );
}