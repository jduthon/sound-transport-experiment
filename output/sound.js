import Tone from "tone";

const adaptRangeNumbers = (input, output) => value => {
  const inputMax = input[1] - input[0];
  const outputMax = output[1] - output[0];
  return Math.min(value / inputMax, 1) * outputMax + output[0];
};

const adaptRange = (input, output) => {
  if (output.every(isFinite)) {
    return adaptRangeNumbers(input, output);
  }
  return val =>
    output[Math.round(adaptRangeNumbers(input, [0, output.length - 1])(val))];
};

Tone.Transport.toggle();

let kick;
let cymbal;
let hiHat;

const delayRange = [0, 60];
const departuresLengthRange = [0, 150];
const kickRange = [30, 60];
const kickFrequency = ["1n", "2n", "4n", "6n"];
const cymbalRange = ["4n", "8n"];
const cymbalFrequency = [0, "1n", "2n"];
const hiHatRange = ["512n", "1024n"];
const hiHatFrequency = ["4n", "8n"];

// cymbal:
/*
var synth = new Tone.MetalSynth().toMaster()

synth.triggerAttackRelease('4n', time, 0.6)
*/

// hi-hat:
/*
  synth.triggerAttackRelease('512n', time, 0.15)
*/

export const startOrUpdateKick = ({ avgDelay, departures }) => {
  const synth = new Tone.MembraneSynth().toMaster();
  const delayFrequencyVariance = adaptRange(delayRange, kickRange);
  const departuresLengthRyhtmVariance = adaptRange(
    departuresLengthRange,
    kickFrequency
  );
  const synthFunc = time =>
    synth.triggerAttackRelease(delayFrequencyVariance(avgDelay), "8n", time);
  const prevKick = kick;
  kick = new Tone.Loop(
    synthFunc,
    departuresLengthRyhtmVariance(departures.length)
  );
  if (prevKick) {
    console.log("kick stop");
    prevKick.stop("+1m");
  }
  console.log(
    "kick start",
    delayFrequencyVariance(avgDelay),
    departuresLengthRyhtmVariance(departures.length)
  );
  kick.start("+1m");
};

export const startOrUpdateCymbal = ({ avgDelay, departures }) => {
  const synth = new Tone.MetalSynth().toMaster();
  const delayFrequencyVariance = adaptRange(delayRange, cymbalRange);
  const departuresLengthRyhtmVariance = adaptRange(
    departuresLengthRange,
    cymbalFrequency
  );
  const synthFunc = time =>
    synth.triggerAttackRelease(delayFrequencyVariance(avgDelay), time, 0.4);
  const prevCymbal = cymbal;
  cymbal = new Tone.Loop(
    synthFunc,
    departuresLengthRyhtmVariance(departures.length)
  );
  if (prevCymbal) {
    console.log("cymbal stopped");
    prevCymbal.stop("+1m");
  }
  console.log(
    "cymbal start",
    delayFrequencyVariance(avgDelay),
    departuresLengthRyhtmVariance(departures.length)
  );
  cymbal.start("+1m");
};

export const startOrUpdateHiHat = ({ avgDelay, departures }) => {
  const synth = new Tone.MetalSynth().toMaster();
  const delayFrequencyVariance = adaptRange(delayRange, hiHatRange);
  const departuresLengthRyhtmVariance = adaptRange(
    departuresLengthRange,
    hiHatFrequency
  );
  const synthFunc = time =>
    synth.triggerAttackRelease(delayFrequencyVariance(avgDelay), time, 0.05);
  const prevHiHat = hiHat;
  hiHat = new Tone.Loop(
    synthFunc,
    departuresLengthRyhtmVariance(departures.length)
  );
  if (prevHiHat) {
    console.log("hihat stopped");
    prevHiHat.stop("+1m");
  }
  console.log(
    "hihat start",
    delayFrequencyVariance(avgDelay),
    departuresLengthRyhtmVariance(departures.length)
  );
  hiHat.start("+1m");
};

const generateScale = level =>
  ["C", "D", "E", "F", "G", "A", "B", "C"].map(letter => `${letter}${level}`);

const majorScaleRange = generateScale(4);
const majorScaleNoteLength = ["1n", "2n", "4n", "6n"];
const randomInNextNotes = () => `+${Math.ceil(Math.random() * 4) + 1}n`;

export const playFromMajorScale = ({ avgDelay, departures }) => {
  const synth = new Tone.Synth().toMaster();
  const delayFrequencyVariance = adaptRange(delayRange, majorScaleRange);
  const departuresLengthToNoteLength = adaptRange(
    departuresLengthRange,
    majorScaleNoteLength
  );
  synth.triggerAttackRelease(
    delayFrequencyVariance(avgDelay),
    departuresLengthToNoteLength(departures.length),
    randomInNextNotes()
  );
};

// Export Tone to the window to be able to mess around in the browser's JS console
window.Tone = Tone;
