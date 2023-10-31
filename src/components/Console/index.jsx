import { useEffect, useState } from "react";
import { useAudio } from "../../audio/audioSetup";
import { midiSetup } from "../../audio/midiSetup";
import { HzDisplay } from "../HzDisplay/index";
import { Screen } from "../Screen/index";
import { WaveBtn } from "../WaveBtn/index";
import { Toggle } from "../Toggle/index";
import styles from "./index.module.css";

export function Console() {
  const screenWidth = 512; // Power of 2 for PCM resolution that's nice for FFT
  const screenHeight = 512;
  const BASE_HZ = 110; // A2
  const SEMITONE_FACTOR = 2 ** (1 / 12);

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
        newPCM = new Float32Array(numSamps)
          .fill()
          .map((_, i) => (i < numSamps / 2 ? 1 : -1));
        break;
      case "sawtooth":
        newPCM = new Float32Array(numSamps)
          .fill()
          .map((_, i) => 1 * (1 - i / numSamps) + (-1 * i) / numSamps);
        break;
      case "line":
        newPCM = new Float32Array(numSamps).fill(0);
        break;
    }

    handlePCMChange(newPCM);
  }

  useEffect(() => {
    midiSetup(handleChangeHz);

    function handleKeyDown(e) {
      if(e.target.id !== "hz-display") {
        switch (e.key) {
          case 'Enter': 
            setDisplayPCM((prevDisplayPCM) => !prevDisplayPCM);
            return;

          // case 'ArrowLeft':
          //   handleChangeHz(Hz / SEMITONE_FACTOR);
          //   return;
          
          // case 'ArrowRight':
          //   handleChangeHz(Hz * SEMITONE_FACTOR);
          //   return;
          case '1':
            handleWaveBtnClick('sine');
            return;
          case '2':
            handleWaveBtnClick('square');
            return;
          case '3':
            handleWaveBtnClick('sawtooth');
            return;
          case '4':
            handleWaveBtnClick('line');
            return;
          case 'm':
            consoleAudio.muteToggle();
            return;
          case '=':
          case '+':
            consoleAudio.setVol(consoleAudio.currentVol + .1);
            return;
          case '-':
            consoleAudio.setVol(consoleAudio.currentVol - .1);
            return;
        }

        const keyboard = ['a', 'w', 's', 'e', 'd', 'f', 
          't', 'g', 'y', 'h', 'u', 'j', 'k']

        // Center power around 'h', our key for note A
        const power = keyboard.indexOf(e.key) - 9
        if (power !== -10) {
          handleChangeHz(BASE_HZ * SEMITONE_FACTOR ** power);
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Prevent dragging and highlighting elements outside of the canvas
  function handleMouseDown(e) {
    if(e.target.id !== "hz-display") {
      e.preventDefault();
      document.getElementById("hz-display").blur();
    }
  }


  const consoleShadows = {
    boxShadow: displayPCM
      ? 'inset 4px 5px 0 0 rgb(163 163 163), inset -4px -5px 0 0 rgb(88 88 88), 3px 2px 16px 0px rgb(0 215 255)'
      : 'inset 4px 5px 0 0 rgb(163 163 163), inset -4px -5px 0 0 rgb(88 88 88), 3px 2px 16px 0px rgb(255 100 247)'
  }

  return (
    <div 
      id={styles.console} 
      onMouseDown={handleMouseDown}
      style={consoleShadows}
    >
      <div id={styles.hz_area}>
        <HzDisplay Hz={Hz} onChangeHz={handleChangeHz}></HzDisplay>
      </div>

      <div id={styles.middle_console}>
        <Screen
          width={screenWidth}
          height={screenHeight}
          pcm={pcm}
          onPCMChange={handlePCMChange}
          displayPCM={displayPCM}
          Hz={Hz}
        />
        <div id={styles.wave_buttons}>
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

      <div id={styles.toggle_area}>
        <Toggle isPressed={displayPCM} onToggle={handleToggle}></Toggle>
      </div>
    </div>
  );
}
