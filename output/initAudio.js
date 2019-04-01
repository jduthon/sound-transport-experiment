import p5 from 'p5'
import 'p5/lib/addons/p5.sound';
let attackLevel = 1.0;
let releaseLevel = 0;

let env, triOsc;
let proc

export function setup() {
  proc = new p5()
  env = new p5.Envelope();
  env.setRange(attackLevel, releaseLevel);
  triOsc = new p5.Oscillator('triangle');
  triOsc.amp(env);
  triOsc.start();
}
export function playStationUpdate(avgDelay = 0.2, stationId)  {
  const id = generateStationFreq(stationId)
  triOsc.freq(proc.map(id, 0, 100, 30, 300));

  const setDecay = proc.map(avgDelay, -50, 100, 0, 3)
  const setReleaseTime = proc.map(avgDelay, -50, 100, 0, 3)
  env.setADSR(0.001, setDecay, 0.2, setReleaseTime);
  env.play();
}

function generateStationFreq(stationId) {
  return stationId.slice(stationId.length - 3, stationId.length)
}
