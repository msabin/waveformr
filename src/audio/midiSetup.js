const MIDI_PRESS = parseInt("90", 16);
const MIDI_RELEASE = parseInt("80", 16);
const MIDI_A4 = parseInt("45", 16);
const A4 = 440;

let midi = null;
let changeConsoleHz;

export function midiSetup(onChangeHz) {
  try{
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }catch{
    alert(
      "This browser doesn't support MIDI.  If you would like to use MIDI with this app, please use a different browser.");
  }
  changeConsoleHz = onChangeHz;
}

function onMIDISuccess(midiAccess) {
  console.log("MIDI ready!");
  midi = midiAccess;
  listInputsAndOutputs(midi);
  startLoggingMIDIInput(midi);
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

function listInputsAndOutputs(midiAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(
      `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`
    );
  }
}

function startLoggingMIDIInput(midiAccess) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}

function onMIDIMessage(event) {
  let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
  for (const character of event.data) {
    str += `0x${character.toString(16)} `;
  }
  console.log(str);
  console.log(event.data[1]);

  if (event.data[0] === MIDI_PRESS) {
    let distFromA4 = event.data[1] - MIDI_A4;
    let Hz = 2 ** ((1 / 12) * distFromA4) * A4;
    changeConsoleHz(Hz);
  }
}