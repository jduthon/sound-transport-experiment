import p5 from 'p5'
import 'p5/lib/addons/p5.sound';
let attackLevel = 1.0;
let releaseLevel = 0;
let attackTime = 0.001;
let decayTime = 0.2;
let susPercent = 0.2;
let releaseTime = 0.5;
let env, triOsc;
let proc
export function setup() {
  proc = new p5()
  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);
  triOsc = new p5.Oscillator('triangle');
  triOsc.amp(env);
  triOsc.start();
  triOsc.freq(220);
}
export function playEnv(avgDelay = 0.2, stationId)  {
  const id = stationId.slice(stationId.length - 3, stationId.length)
  triOsc.freq(proc.map(id, 0, 100, 30, 300));
  const setDecay = proc.map(avgDelay, -50, 100, 0, 3)
  const setReleaseTime = proc.map(avgDelay, -50, 100, 0, 3)
  env.setADSR(attackTime, setDecay, susPercent, setReleaseTime);
  env.play();
}
