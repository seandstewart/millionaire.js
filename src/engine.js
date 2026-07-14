export const States = Object.freeze({
  IDLE: 'idle',
  NAME_ENTRY: 'name_entry',
  DISPLAY_QUESTION: 'display_question',
  LIFELINE_ACTIVE: 'lifeline_active',
  ANSWER_LOCKED: 'answer_locked',
  REVEAL: 'reveal',
  SAFE_HAVEN: 'safe_haven',
  GAME_OVER: 'game_over',
  WIN: 'win',
});

export class GameEngine {
  constructor(questionBank, ladder) {
    this._bank = questionBank;
    this._ladder = ladder;
    this._session = null;
    this._listeners = new Set();
  }

  subscribe(fn) {
    this._listeners.add(fn);
    if (this._session) fn(this.getSnapshot());
    return () => this._listeners.delete(fn);
  }

  _notify() {
    const snapshot = this.getSnapshot();
    this._listeners.forEach(fn => fn(snapshot));
  }

  _setState(state) {
    if (!this._session) return;
    this._session.state = state;
    this._notify();
  }

  _selectQuestions() {
    const byDifficulty = new Map();
    for (const q of this._bank) {
      if (!byDifficulty.has(q.difficulty)) byDifficulty.set(q.difficulty, []);
      byDifficulty.get(q.difficulty).push(q);
    }

    const selected = [];
    for (let d = 1; d <= 15; d++) {
      const pool = byDifficulty.get(d);
      if (!pool || pool.length === 0) {
        throw new Error(`Missing question for difficulty ${d}`);
      }
      const pick = pool[Math.floor(Math.random() * pool.length)];
      selected.push(structuredClone(pick));
    }
    return selected;
  }

  start() {
    this._session = { state: States.NAME_ENTRY };
    this._notify();
  }

  submitName(playerName) {
    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
      throw new Error('Invalid player name');
    }
    this.startGame(playerName.trim());
  }

  startGame(playerName) {
    const questions = this._selectQuestions();
    this._session = {
      state: States.DISPLAY_QUESTION,
      playerName,
      questions,
      questionIndex: 0,
      lifelines: {
        '50-50': false,
        'ask-audience': false,
        'phone-friend': false,
      },
      selectedOptionSlug: null,
      activeOptionSlugs: [],
      floorAmount: 0,
      currentWinnings: 0,
      lastSafeHaven: 0,
      gameOverReason: null,
      walkAwayAmount: 0,
      lifelineType: null,
      lifelineData: null,
    };
    this._setActiveOptionsFromQuestion();
    this._notify();
  }

  _setActiveOptionsFromQuestion() {
    const q = this._session.questions[this._session.questionIndex];
    this._session.activeOptionSlugs = q.options.map(o => o.slug);
  }

  _currentQuestion() {
    return this._session.questions[this._session.questionIndex];
  }

  _currentLadderLevel() {
    return this._ladder[this._session.questionIndex];
  }

  _previousLadderLevel() {
    const idx = this._session.questionIndex - 1;
    return idx >= 0 ? this._ladder[idx] : null;
  }

  _isSafeHaven(levelIndex) {
    return this._ladder[levelIndex]?.safeHaven ?? false;
  }

  selectOption(slug) {
    if (this._session.state !== States.DISPLAY_QUESTION) return;
    if (!this._session.activeOptionSlugs.includes(slug)) return;
    this._session.selectedOptionSlug = slug;
    this._setState(States.ANSWER_LOCKED);
  }

  lockIn() {
    if (this._session.state !== States.ANSWER_LOCKED) return;
    this._setState(States.REVEAL);
  }

  finalizeAnswer() {
    this._reveal();
  }

  _reveal() {
    if (this._session.state !== States.REVEAL) return;
    const q = this._currentQuestion();
    const correct = q.correctOptionSlug;
    const chosen = this._session.selectedOptionSlug;

    if (correct === chosen) {
      this._session.currentWinnings = this._currentLadderLevel().amount;
      if (this._isSafeHaven(this._session.questionIndex)) {
        this._session.floorAmount = this._session.currentWinnings;
        this._session.lastSafeHaven = this._session.questionIndex;
        this._setState(States.SAFE_HAVEN);
      } else {
        if (this._session.questionIndex === 14) {
          this._setState(States.WIN);
        } else {
          this._session.questionIndex += 1;
          this._session.selectedOptionSlug = null;
          this._setActiveOptionsFromQuestion();
          this._setState(States.DISPLAY_QUESTION);
        }
      }
    } else {
      this._session.currentWinnings = this._session.floorAmount;
      this._session.gameOverReason = 'wrong';
      this._setState(States.GAME_OVER);
    }
  }

  nextQuestion() {
    if (this._session.state !== States.SAFE_HAVEN) return;
    if (this._session.questionIndex === 14) {
      this._setState(States.WIN);
      return;
    }
    this._session.questionIndex += 1;
    this._session.selectedOptionSlug = null;
    this._setActiveOptionsFromQuestion();
    this._setState(States.DISPLAY_QUESTION);
  }

  walkAway() {
    if (
      this._session.state !== States.DISPLAY_QUESTION &&
      this._session.state !== States.ANSWER_LOCKED
    ) return;
    const prev = this._previousLadderLevel();
    this._session.walkAwayAmount = prev ? prev.amount : 0;
    this._session.currentWinnings = this._session.walkAwayAmount;
    this._session.gameOverReason = 'walkaway';
    this._setState(States.GAME_OVER);
  }

  useLifeline(type) {
    if (this._session.state !== States.DISPLAY_QUESTION) return;
    if (this._session.lifelines[type]) return;

    this._session.lifelines[type] = true;
    this._session.lifelineType = type;

    switch (type) {
      case '50-50': {
        const q = this._currentQuestion();
        const wrong = q.options
          .filter(o => o.slug !== q.correctOptionSlug)
          .map(o => o.slug);
        const toRemove = wrong.slice().sort(() => Math.random() - 0.5).slice(0, 2);
        this._session.activeOptionSlugs = this._session.activeOptionSlugs.filter(
          s => !toRemove.includes(s)
        );
        break;
      }
      case 'ask-audience': {
        const q = this._currentQuestion();
        const dist = this._generateAudienceDistribution(q);
        this._session.lifelineData = dist;
        break;
      }
      case 'phone-friend': {
        const q = this._currentQuestion();
        const msg = this._generatePhoneFriendResponse(q);
        this._session.lifelineData = msg;
        break;
      }
    }

    this._setState(States.LIFELINE_ACTIVE);
  }

  resolveLifeline() {
    if (this._session.state !== States.LIFELINE_ACTIVE) return;
    this._session.lifelineType = null;
    this._session.lifelineData = null;
    this._setState(States.DISPLAY_QUESTION);
  }

  _generateAudienceDistribution(question) {
    const correct = question.correctOptionSlug ?? question.correctOptionId ?? question.correct;
    const keys = question.options.map(o => o.slug ?? o.id ?? o.key);
    const weights = {};
    const totalWeight = 100;
    let correctWeight = 55 + Math.floor(Math.random() * 20);
    let remaining = totalWeight - correctWeight;
    const wrong = keys.filter(k => k !== correct);
    for (const [i, k] of wrong.entries()) {
      if (i === wrong.length - 1) {
        weights[k] = remaining;
      } else {
        const w = Math.floor(Math.random() * (remaining / (wrong.length - i)));
        weights[k] = w;
        remaining -= w;
      }
    }
    weights[correct] = correctWeight;
    // Return as array in the order of options for easier access
    return question.options.map(o => weights[o.slug] ?? weights[o.id] ?? weights[o.key] ?? 0);
  }

  _generatePhoneFriendResponse(question) {
    const correct = question.correctOptionSlug;
    const slugs = question.options.map(o => o.slug);
    const pick = Math.random() < 0.7 ? correct : slugs[Math.floor(Math.random() * slugs.length)];
    const confidence = 40 + Math.floor(Math.random() * 55);
    const option = question.options.find(o => o.slug === pick);
    const label = option ? option.text : 'hmm, not sure';
    return `I think it's... ${label}. I'm ${confidence}% sure.`;
  }

  reset() {
    this._session = null;
    this._notify();
  }

  getSnapshot() {
    if (!this._session) {
      return { state: States.IDLE, playerName: null };
    }
    if (this._session.state === States.NAME_ENTRY) {
      return { state: States.NAME_ENTRY, playerName: null };
    }

    const q = this._currentQuestion();
    const ladder = this._ladder.map((lvl, idx) => ({
      ...lvl,
      current: idx === this._session.questionIndex,
      passed: idx < this._session.questionIndex,
      safeHaven: lvl.safeHaven,
    }));

    return {
      state: this._session.state,
      playerName: this._session.playerName,
      questionIndex: this._session.questionIndex,
      currentQuestion: q ? {
        slug: q.slug,
        question: q.question,
        options: q.options.map(o => ({
          ...o,
          active: this._session.activeOptionSlugs.includes(o.slug)
        })),
        difficulty: q.difficulty,
      } : null,
      correctOptionSlug: q?.correctOptionSlug ?? null,
      selectedOptionSlug: this._session.selectedOptionSlug,
      lifelines: { ...this._session.lifelines },
      lifelineType: this._session.lifelineType,
      lifelineData: this._session.lifelineData,
      ladder,
      currentWinnings: this._session.currentWinnings,
      floorAmount: this._session.floorAmount,
      walkAwayAmount: this._session.walkAwayAmount,
      gameOverReason: this._session.gameOverReason,
    };
  }
}
