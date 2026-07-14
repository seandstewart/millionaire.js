import './style.css';
import { GameEngine, States } from './engine.js';
import { ladder } from './ladder.js';
import { loadQuestions } from './questions.js';
import { initAudio, setAudioMuted, playSelectSound, playLockSound, playCorrectSound, playWrongSound, playWinSound, playStartGameSound, playTitleScreenLoop, playGameOverLoop, playWinnerLoop, stopLoopingSound, getLoopingPattern } from './audio.js';

let audioInitialized = false;
let audioMuted = false;
let currentState = null;

const els = {
  screens: {
    idle: document.getElementById('screen-idle'),
    name: document.getElementById('screen-name'),
    game: document.getElementById('screen-game'),
    gameover: document.getElementById('screen-gameover'),
    win: document.getElementById('screen-win'),
  },
  startBtn: document.getElementById('btn-start'),
  submitNameBtn: document.getElementById('btn-submit-name'),
  nameInput: document.getElementById('name-input'),
  ladderList: document.getElementById('ladder-list'),
  questionText: document.getElementById('question-text'),
  answersGrid: document.getElementById('answers-grid'),
  lifelineFifty: document.getElementById('ll-50-50'),
  lifelineAudience: document.getElementById('ll-audience'),
  lifelinePhone: document.getElementById('ll-phone'),
  lifelineOverlay: document.getElementById('lifeline-overlay'),
  lifelineContent: document.getElementById('lifeline-content'),
  lockInBtn: document.getElementById('btn-lockin'),
  walkAwayBtn: document.getElementById('btn-walkaway'),
  gameoverReason: document.getElementById('gameover-reason'),
  finalWinnings: document.getElementById('final-winnings'),
  playAgainBtn: document.getElementById('btn-playagain'),
  playAgainWinBtn: document.getElementById('btn-playagain-win'),
  safeHavenBanner: document.getElementById('safe-haven-banner'),
  walkawayConfirm: document.getElementById('walkaway-confirm'),
  walkawayAmount: document.getElementById('walkaway-amount'),
  walkawayConfirmBtn: document.getElementById('btn-walkaway-confirm'),
  cancelWalkawayBtn: document.getElementById('btn-cancel-walkaway'),
  audioToggleBtn: document.getElementById('btn-audio-toggle'),
};

let engine = null;
let revealTimeout = null;
let lifelineTimeout = null;
let lastState = null;

function checkLoopingPattern() {
  const loopingPattern = getLoopingPattern();
  return loopingPattern !== null;
}

function restartAmbientLoopForState(state) {
  if (audioMuted || !audioInitialized) return;
  
  stopLoopingSound();
  
  if (state === States.IDLE) {
    console.log('[main] Restarting title loop after unmute...');
    playTitleScreenLoop();
  } else if (state === States.GAME_OVER) {
    console.log('[main] Restarting game over loop after unmute...');
    playGameOverLoop();
  } else if (state === States.WIN) {
    console.log('[main] Restarting winner loop after unmute...');
    playWinnerLoop();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateAudioToggleButton() {
  if (audioMuted) {
    els.audioToggleBtn.classList.add('muted');
    els.audioToggleBtn.textContent = 'SFX\nOFF';
  } else {
    els.audioToggleBtn.classList.remove('muted');
    els.audioToggleBtn.textContent = 'SFX\nON';
  }
}

function showScreen(id) {
  Object.values(els.screens).forEach(s => s.classList.add('hidden'));
  const screen = document.getElementById(id);
  if (screen) screen.classList.remove('hidden');
}

function renderLadder(snap) {
  els.ladderList.innerHTML = '';
  const levels = [...snap.ladder].reverse();
  levels.forEach(lvl => {
    const li = document.createElement('li');
    li.className = 'ladder-item';
    if (lvl.current) li.classList.add('current');
    if (lvl.passed) li.classList.add('passed');
    if (lvl.safeHaven) li.classList.add('safe-haven');
    li.textContent = `$${lvl.amount.toLocaleString()}`;
    els.ladderList.appendChild(li);
  });
}

function renderGame(snap) {
  renderLadder(snap);

  els.questionText.textContent = snap.currentQuestion?.question ?? '';

  els.answersGrid.innerHTML = '';
  const options = snap.currentQuestion?.options ?? [];
  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.dataset.slug = opt.slug;
    btn.dataset.index = i;

    if (!opt.active) {
      btn.classList.add('inactive');
      btn.disabled = true;
    }

    if (snap.state === States.ANSWER_LOCKED && opt.slug === snap.selectedOptionSlug) {
      btn.classList.add('selected');
    }

    if (snap.state === States.REVEAL) {
      if (opt.slug === snap.correctOptionSlug) {
        btn.classList.add('correct');
      } else if (opt.slug === snap.selectedOptionSlug && opt.slug !== snap.correctOptionSlug) {
        btn.classList.add('wrong');
      }
    }

    btn.textContent = `${String.fromCharCode(65 + i)}: ${opt.text}`;
    btn.onclick = () => {
      const currentSnap = engine.getSnapshot();
      if (opt.active && currentSnap.state === States.DISPLAY_QUESTION) {
        console.log('[main] Answer selected:', opt.slug);
        playSelectSound();
        engine.selectOption(opt.slug);
      }
    };
    els.answersGrid.appendChild(btn);
  });

  els.lifelineFifty.disabled = snap.lifelines['50-50'];
  els.lifelineAudience.disabled = snap.lifelines['ask-audience'];
  els.lifelinePhone.disabled = snap.lifelines['phone-friend'];
  els.lifelineFifty.classList.toggle('used', snap.lifelines['50-50']);
  els.lifelineAudience.classList.toggle('used', snap.lifelines['ask-audience']);
  els.lifelinePhone.classList.toggle('used', snap.lifelines['phone-friend']);

  els.lockInBtn.disabled = !snap.selectedOptionSlug || snap.state !== States.ANSWER_LOCKED;
  els.walkAwayBtn.disabled = snap.state !== States.DISPLAY_QUESTION && snap.state !== States.ANSWER_LOCKED;
}

function showWalkAwayConfirm(snap) {
  const prev = snap.questionIndex > 0 ? ladder[snap.questionIndex - 1] : null;
  const amount = prev ? prev.amount : 0;
  els.walkawayAmount.textContent = `Winnings: $${amount.toLocaleString()}`;
  els.walkawayConfirm.classList.remove('hidden');
}

function renderLifeline(snap) {
  clearTimeout(lifelineTimeout);

  if (snap.lifelineType === '50-50') {
    lifelineTimeout = setTimeout(() => engine.resolveLifeline(), 300);
    return;
  }

  els.lifelineOverlay.classList.remove('hidden');

  if (snap.lifelineType === 'ask-audience') {
    const dist = snap.lifelineData;
    const options = snap.currentQuestion?.options ?? [];
    const labels = ['A', 'B', 'C', 'D'];

    const getPct = (opt, i) => {
      if (dist == null) return 0;
      if (Array.isArray(dist)) return dist[i] ?? 0;
      if (typeof dist === 'object') {
        return dist[opt.slug] ?? dist[opt.id] ?? dist[String(i)] ?? dist[i] ?? 0;
      }
      return 0;
    };

    let barsHtml = '';
    options.forEach((opt, i) => {
      const pct = getPct(opt, i);
      const isCorrect = opt.slug === snap.correctOptionSlug || opt.id === snap.correctOptionSlug;
      const color = isCorrect ? 'var(--accent-gold)' : 'var(--accent-blue)';
      barsHtml += `
        <div class="bar-wrapper">
          <div class="bar-label">${labels[i]}</div>
          <div class="bar-track">
            <div class="bar-fill" data-target="${pct}%" style="background: ${color}; height: 0%;"></div>
          </div>
          <div class="bar-value">${pct}%</div>
        </div>
      `;
    });

    els.lifelineContent.innerHTML = `
      <div class="lifeline-title">ASK THE AUDIENCE</div>
      <div class="bar-chart">${barsHtml}</div>
      <div class="overlay-hint">Click anywhere to dismiss</div>
    `;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        els.lifelineContent.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.height = bar.dataset.target;
        });
      });
    });

    lifelineTimeout = setTimeout(() => engine.resolveLifeline(), 300000);
    return;
  }

  if (snap.lifelineType === 'phone-friend') {
    els.lifelineContent.innerHTML = `
      <div class="phone-friend-container">
        <div class="calling-text">CALLING<span class="dots">...</span></div>
      </div>
    `;

    lifelineTimeout = setTimeout(() => {
      const currentSnap = engine.getSnapshot();
      const msg = currentSnap.lifelineData || '';
      els.lifelineContent.innerHTML = `
        <div class="phone-friend-container">
          <div class="speech-bubble">${escapeHtml(msg)}</div>
        </div>
      `;
      lifelineTimeout = setTimeout(() => engine.resolveLifeline(), 300000);
    }, 2000);

    return;
  }
}

function showSafeHaven(snap) {
  els.safeHavenBanner.classList.remove('hidden');
  els.safeHavenBanner.querySelector('.safe-haven-amount').textContent =
    `$${snap.currentWinnings.toLocaleString()}`;
  setTimeout(() => {
    els.safeHavenBanner.classList.add('hidden');
    engine.nextQuestion();
  }, 2000);
}

function renderGameOver(snap) {
  const reason = snap.gameOverReason === 'walkaway' ? 'You walked away' : 'Wrong answer';
  els.gameoverReason.textContent = reason;
  els.finalWinnings.textContent = `Winnings: $${snap.currentWinnings.toLocaleString()}`;
}

function renderWin(snap) {
  // Win screen is static HTML
}

function render(snap) {
  const isLoopingPatternActive = checkLoopingPattern();
  clearTimeout(revealTimeout);
  clearTimeout(lifelineTimeout);
  els.lifelineOverlay.classList.add('hidden');
  els.safeHavenBanner.classList.add('hidden');
  els.walkawayConfirm.classList.add('hidden');

  // Audio cues for state transitions
  if (snap.state === States.IDLE) {
    // Play title loop if audio is initialized and loop isn't already playing
    if (audioInitialized && !isLoopingPatternActive) {
      console.log('[main] IDLE state, starting title loop...');
      stopLoopingSound();
      playTitleScreenLoop();
    }
  } else {
    // Stop title loop when leaving IDLE screen
    if (lastState === States.IDLE) {
      stopLoopingSound();
    }
  }

  if (snap.state === States.DISPLAY_QUESTION && lastState === States.NAME_ENTRY) {
    console.log('[main] Game started, stopping title loop and playing start sound...');
    stopLoopingSound();
    playStartGameSound();
  }

  if (snap.state === States.REVEAL && lastState !== States.REVEAL) {
    console.log('[main] REVEAL state, correct:', snap.correctOptionSlug, 'selected:', snap.selectedOptionSlug);
    setTimeout(() => {
      if (snap.correctOptionSlug === snap.selectedOptionSlug) {
        console.log('[main] Correct answer! Playing success sound...');
        playCorrectSound();
      } else {
        console.log('[main] Wrong answer! Playing failure sound...');
        playWrongSound();
      }
    }, 500);
  }

  if (snap.state === States.GAME_OVER && lastState !== States.GAME_OVER && audioInitialized) {
    console.log('[main] GAME OVER state, playing game over loop...');
    stopLoopingSound();
    playGameOverLoop();
  }

  if (snap.state === States.WIN && lastState !== States.WIN && audioInitialized) {
    console.log('[main] WIN state detected, playing win sound and loop...');
    stopLoopingSound();
    setTimeout(() => {
      playWinSound();
    }, 300);
    setTimeout(() => {
      playWinnerLoop();
    }, 1500);
  }

  currentState = snap.state;
  lastState = snap.state;

  switch (snap.state) {
    case States.IDLE:
      showScreen('screen-idle');
      break;
    case States.NAME_ENTRY:
      showScreen('screen-name');
      break;
    case States.DISPLAY_QUESTION:
    case States.ANSWER_LOCKED:
      showScreen('screen-game');
      renderGame(snap);
      break;
    case States.LIFELINE_ACTIVE:
      showScreen('screen-game');
      renderGame(snap);
      renderLifeline(snap);
      break;
    case States.REVEAL:
      showScreen('screen-game');
      renderGame(snap);
      break;
    case States.SAFE_HAVEN:
      showScreen('screen-game');
      renderGame(snap);
      showSafeHaven(snap);
      break;
    case States.GAME_OVER:
      showScreen('screen-gameover');
      renderGameOver(snap);
      break;
    case States.WIN:
      showScreen('screen-win');
      renderWin(snap);
      break;
  }
}

async function init() {
  const questions = await loadQuestions();
  engine = new GameEngine(questions, ladder);
  engine.subscribe(render);
  render(engine.getSnapshot());

  els.startBtn.onclick = async () => {
    console.log('[main] START clicked, initializing audio...');
    await initAudio();
    audioInitialized = true;
    console.log('[main] Audio initialized, starting game...');
    stopLoopingSound();
    engine.start();
  };
  els.submitNameBtn.onclick = () => engine.submitName(els.nameInput.value);
  els.lifelineFifty.onclick = () => engine.useLifeline('50-50');
  els.lifelineAudience.onclick = () => engine.useLifeline('ask-audience');
  els.lifelinePhone.onclick = () => engine.useLifeline('phone-friend');
  els.lifelineOverlay.onclick = () => {
    engine.resolveLifeline();
  };
  els.lockInBtn.onclick = () => {
    console.log('[main] LOCK IN clicked');
    playLockSound();
    engine.lockIn();
    revealTimeout = setTimeout(() => engine.finalizeAnswer(), 1800);
  };
  els.walkAwayBtn.onclick = () => {
    const snap = engine.getSnapshot();
    showWalkAwayConfirm(snap);
  };
  els.walkawayConfirmBtn.onclick = () => {
    stopLoopingSound();
    playWrongSound();
    engine.walkAway();
  };
  els.cancelWalkawayBtn.onclick = () => {
    els.walkawayConfirm.classList.add('hidden');
  };
  els.audioToggleBtn.onclick = (e) => {
    e.stopPropagation();
    audioMuted = !audioMuted;
    setAudioMuted(audioMuted);
    updateAudioToggleButton();
    console.log('[main] Audio toggled:', audioMuted ? 'MUTED' : 'UNMUTED');
    if (audioMuted) {
      stopLoopingSound();
    } else {
      // Unmuted: restart ambient loop if on a looping screen
      restartAmbientLoopForState(currentState);
    }
  };
  els.playAgainBtn.onclick = () => {
    audioInitialized = true;
    stopLoopingSound();
    engine.reset();
  };
  els.playAgainWinBtn.onclick = () => {
    audioInitialized = true;
    stopLoopingSound();
    engine.reset();
  };

  // Init audio on first document interaction
  let audioInitializedOnClick = false;
  document.addEventListener('click', async () => {
    if (!audioInitializedOnClick && !audioInitialized) {
      audioInitializedOnClick = true;
      console.log('[main] First click detected, initializing audio context...');
      await initAudio();
      audioInitialized = true;
      // If we're on title screen, play the loop now that audio is initialized
      const snap = engine.getSnapshot();
      if (snap.state === States.IDLE) {
        console.log('[main] Audio initialized on title screen, playing title loop...');
        stopLoopingSound();
        playTitleScreenLoop();
      }
    }
  }, { once: true });

  document.addEventListener('keydown', (e) => {
    const snap = engine.getSnapshot();
    if (snap.state === States.DISPLAY_QUESTION) {
      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key, 10) - 1;
        const opt = snap.currentQuestion?.options[idx];
        if (opt?.active) {
          playSelectSound();
          engine.selectOption(opt.slug);
        }
      }
    }
    if (e.key === 'Enter' && snap.state === States.ANSWER_LOCKED) {
      els.lockInBtn.click();
    }
    if (e.key === 'Escape' && snap.state === States.LIFELINE_ACTIVE) {
      engine.resolveLifeline();
    }
  });
}

init();
