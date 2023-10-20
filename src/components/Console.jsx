import { useEffect, useState } from "react";
import { useAudio } from "../audio/audioSetup";
import { HzDisplay } from "./HzDisplay";
import { Screen } from "./Screen";
import { WaveBtn } from "./WaveBtn";
import { Toggle } from "./Toggle";
import { midiSetup } from "../audio/midiSetup";

export function Console() {
  const screenWidth = 512; // Power of 2 for PCM resolution that's nice for FFT
  const screenHeight = 512;
  const SEMITONE_FACTOR = 2 ** (1 / 12);
  const BASE_HZ = 110;  // A2

  const consoleAudio = useAudio(BASE_HZ);

  const [pcm, setPCM] = useState(new Float32Array(screenWidth).fill(0));

  const [displayPCM, setDisplayPCM] = useState(true);

  const [Hz, setHz] = useState(110);

  function handlePCMChange(pcm) {
    consoleAudio.setWave(pcm);
    setPCM(pcm);
  }

  function handleChangeHz(newHz) {
    consoleAudio.setHz(newHz);
    setHz(newHz);
  }

  function handleToggle() {
    setDisplayPCM(!displayPCM);
  }

  function handleWaveBtnClick(shape) {
    const numSamps = pcm.length;
    let newPCM;

    switch (shape) {
      case "sine":
        newPCM = new Float32Array(numSamps)
          .fill()
          .map((_, i) => Math.sin((2 * Math.PI * i) / numSamps));
        break;
      case "square":
        newPCM = new Float32Array(numSamps).fill().map((_, i) =>
          (i < numSamps / 2) ? 1 : -1);
        break;
      case "sawtooth":
        newPCM = new Float32Array(numSamps).fill().map((_, i) => 
          1 * (1 - i / numSamps) + (-1) * i/numSamps);
        break;
      case "line":
        newPCM = new Float32Array(numSamps).fill(0);
        break;
    }

    handlePCMChange(newPCM);
  }

  useEffect(() => {
    midiSetup(handleChangeHz);
  },[]);

  return (
    <div id="console">
      <HzDisplay
        Hz={Hz}
        onIncrement={() => handleChangeHz(Hz * SEMITONE_FACTOR)}
        onDecrement={() => handleChangeHz(Hz / SEMITONE_FACTOR)}
      ></HzDisplay>
      <div>
        <Screen
          width={screenWidth}
          height={screenHeight}
          pcm={pcm}
          onPCMChange={handlePCMChange}
          displayPCM={displayPCM}
        />
        <div id="wave-buttons">
          <WaveBtn
            shape="sine"
            onClick={() => handleWaveBtnClick("sine")}
          ></WaveBtn>
          <WaveBtn
            shape="square"
            onClick={() => handleWaveBtnClick("square")}
          ></WaveBtn>
          <WaveBtn
            shape="sawtooth"
            onClick={() => handleWaveBtnClick("sawtooth")}
          ></WaveBtn>
          <WaveBtn
            shape="line"
            onClick={() => handleWaveBtnClick("line")}
          ></WaveBtn>
        </div>
      </div>
      <div id="toggle-area">
        <Toggle isPressed={displayPCM} onToggle={handleToggle}></Toggle>
      </div>
    </div>
  );
}
