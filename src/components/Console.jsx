import { useEffect, useState } from "react";
import { useWave } from "../audio/wave";
import { HzDisplay } from "./HzDisplay";
import { Screen } from "./Screen";
import { WaveBtn } from "./WaveBtn";
import { Toggle } from "./Toggle";



export function Console() {
  const screenWidth = 512;
  const screenHeight = 512;


  const wave = useWave(new Float32Array(screenWidth).fill(0));

  const [displayPCM, setDisplayPCM] = useState(true);

  const [Hz, setHz] = useState(110);


  function handleChange(){
    wave.setPCM(pcm);
  }


  function handleToggle() {
    setDisplayPCM(!displayPCM);
  }


  function consoleSetup(){
    // audioSetup
    // midiSetup
    // Screen sets itself up with p5 so we don't have to include it here
  }

  useEffect(() => {
    consoleSetup();
  }, []);


  return (
    <div id="console">
      <HzDisplay Hz={Hz} ></HzDisplay>
      <div>
        <Screen 
          width={screenWidth} 
          height={screenHeight} 
          wave={wave}
          displayPCM={displayPCM}
        />
        <div>
          <WaveBtn shape="sine"></WaveBtn>
          <WaveBtn shape="square"></WaveBtn>
          <WaveBtn shape="sawtooth"></WaveBtn>
          <WaveBtn shape="line"></WaveBtn>
        </div>
      </div>
      <div>
        <Toggle isPressed={displayPCM} onToggle={handleToggle} ></Toggle>
      </div>
    </div>
  );
}