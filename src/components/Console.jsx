import { useEffect, useState } from "react";
import { HzDisplay } from "./HzDisplay";
import { Screen } from "./Screen";
import { WaveBtn } from "./WaveBtn";
import { Toggle } from "./Toggle";



export function Console() {
  // Have our state set up here I think

  //Class instance
  const wave = useWave();

  function handleChange(){
    wave.setPCM(pcm);
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
      <HzDisplay></HzDisplay>
      <div>
        <Screen />
        <div>
          <WaveBtn shape="sine"></WaveBtn>
          <WaveBtn shape="square"></WaveBtn>
          <WaveBtn shape="sawtooth"></WaveBtn>
          <WaveBtn shape="line"></WaveBtn>
        </div>
      </div>
      <div>
        <Toggle></Toggle>
      </div>
    </div>
  );
}