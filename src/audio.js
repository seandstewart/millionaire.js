import * as Tone from 'tone';

let audioInitialized = false;
let audioMuted = false;
let loopingSynth = null;
let loopingPattern = null;

export function setAudioMuted(muted) {
  audioMuted = muted;
}

export function getLoopingPattern() {
  return loopingPattern;
}

export async function initAudio() {
  if (audioInitialized) {
    console.log('[audio] Already initialized');
    return;
  }
  try {
    console.log('[audio] Starting Tone.js...');
    await Tone.start();
    audioInitialized = true;
    console.log('[audio] ✓ Initialized successfully. Context state:', Tone.getContext().state);
  } catch (err) {
    console.error('[audio] Init failed:', err);
  }
}

function createSynth() {
  return new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
  }).toDestination();
}

export async function playSelectSound() {
  if (!audioInitialized || audioMuted) {
    return;
  }
  try {
    const synth = createSynth();
    synth.triggerAttackRelease('C4', '0.1');
    setTimeout(() => synth.dispose(), 200);
  } catch (err) {
    console.error('[audio] Select error:', err);
  }
}

export async function playLockSound() {
  if (!audioInitialized || audioMuted) {
    return;
  }
  try {
    const synth = createSynth();
    synth.triggerAttackRelease('E4', '0.15');
    setTimeout(() => {
      try {
        synth.triggerAttackRelease('G4', '0.15');
      } catch (e) {
        console.warn('[audio] Lock second note error:', e);
      }
    }, 80);
    setTimeout(() => synth.dispose(), 400);
  } catch (err) {
    console.error('[audio] Lock error:', err);
  }
}

export async function playCorrectSound() {
  if (!audioInitialized || audioMuted) {
    return;
  }
  try {
    const synth = createSynth();
    const notes = ['G4', 'B4', 'D5'];
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        try {
          synth.triggerAttackRelease(notes[i], '0.15');
        } catch (e) {
          console.warn('[audio] Correct note error:', e);
        }
      }, i * 120);
    }
    setTimeout(() => synth.dispose(), 500);
  } catch (err) {
    console.error('[audio] Correct error:', err);
  }
}

export async function playWrongSound() {
  if (!audioInitialized || audioMuted) {
    return;
  }
  try {
    const synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination();
    synth.triggerAttackRelease('D2', '0.3');
    setTimeout(() => {
      try {
        synth.triggerAttackRelease('C2', '0.3');
      } catch (e) {
        console.warn('[audio] Wrong second note error:', e);
      }
    }, 150);
    setTimeout(() => synth.dispose(), 600);
  } catch (err) {
    console.error('[audio] Wrong error:', err);
  }
}

export async function playWinSound() {
  if (!audioInitialized || audioMuted) {
    return;
  }
  try {
    const synth = createSynth();
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        try {
          synth.triggerAttackRelease(notes[i], '0.1');
        } catch (e) {
          console.warn('[audio] Win note error:', e);
        }
      }, i * 100);
    }
    setTimeout(() => synth.dispose(), 850);
  } catch (err) {
    console.error('[audio] Win error:', err);
  }
}

export async function playStartGameSound() {
  if (!audioInitialized || audioMuted) {
    return;
  }
  try {
    const synth = createSynth();
    const notes = ['G3', 'C4', 'E4'];
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        try {
          synth.triggerAttackRelease(notes[i], '0.2');
        } catch (e) {
          console.warn('[audio] Start game note error:', e);
        }
      }, i * 100);
    }
    setTimeout(() => synth.dispose(), 450);
  } catch (err) {
    console.error('[audio] Start game error:', err);
  }
}

// Looping background sounds
export async function stopLoopingSound() {
  try {
    if (loopingPattern) {
      loopingPattern.stop();
      loopingPattern.dispose();
      loopingPattern = null;
    }
    if (loopingSynth) {
      loopingSynth.dispose();
      loopingSynth = null;
    }
  } catch (err) {
    console.warn('[audio] Failed to stop looping sound:', err);
  }
}

export async function playTitleScreenLoop() {
  if (!audioInitialized || audioMuted) return;
  console.log('[audio] Starting title screen loop...');
  try {
    await stopLoopingSound();
    loopingSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.1, release: 0.2 },
    }).toDestination();

    // Gentle ambient pattern
    loopingPattern = new Tone.Loop((time) => {
      loopingSynth.triggerAttackRelease('C3', '0.4', time);
      loopingSynth.triggerAttackRelease('E3', '0.4', time + 0.5);
    }, '1.6');
    loopingPattern.start(0);
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
  } catch (err) {
    console.error('[audio] Title loop error:', err);
  }
}

export async function playGameOverLoop() {
  if (!audioInitialized || audioMuted) return;
  console.log('[audio] Starting game over funeral dirge loop...');
  try {
    await stopLoopingSound();
    loopingSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.2, decay: 0.4, sustain: 0.2, release: 0.3 },
    }).toDestination();

    // Mournful looping progression: E3 → D3 → E3 → B2 (5.2s loop)
    loopingPattern = new Tone.Loop((time) => {
      loopingSynth.triggerAttackRelease('E3', '1', time);
      loopingSynth.triggerAttackRelease('D3', '1', time + 1.2);
      loopingSynth.triggerAttackRelease('E3', '1', time + 2.4);
      loopingSynth.triggerAttackRelease('B2', '1.2', time + 3.6);
    }, '5.2');
    loopingPattern.start(0);
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
  } catch (err) {
    console.error('[audio] Game over loop error:', err);
  }
}

export async function playWinnerLoop() {
  if (!audioInitialized || audioMuted) return;
  console.log('[audio] Starting winner loop...');
  try {
    await stopLoopingSound();
    loopingSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.08, decay: 0.2, sustain: 0.2, release: 0.15 },
    }).toDestination();

    // Triumphant ascending pattern
    loopingPattern = new Tone.Loop((time) => {
      loopingSynth.triggerAttackRelease('C4', '0.35', time);
      loopingSynth.triggerAttackRelease('E4', '0.35', time + 0.4);
      loopingSynth.triggerAttackRelease('G4', '0.35', time + 0.8);
      loopingSynth.triggerAttackRelease('C5', '0.35', time + 1.2);
    }, '1.8');
    loopingPattern.start(0);
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
  } catch (err) {
    console.error('[audio] Winner loop error:', err);
  }
}
