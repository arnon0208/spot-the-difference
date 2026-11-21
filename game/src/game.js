// game.js — Twin Valley's state machine: levels, timer, score, combo,
// hints, found differences and win/lose flow. Pure logic, no drawing;
// render.js draws what this state describes.

import { LEVELS } from './scenes.js';

export const SCREENS = {
  MENU: 'menu',
  PLAY: 'play',
  LEVEL_DONE: 'level-done',
  WIN: 'win',
  TIME_UP: 'time-up',
};

export function createGame(onChange) {
  const state = {
    screen: SCREENS.MENU,
    levelIndex: 0,
    found: new Set(),
    hinted: null, // diff id currently ringed by a hint, or null
    hintUntil: 0,
    hintsLeft: 3,
    score: 0,
    combo: 0,
    bestCombo: 0,
    timeLeft: LEVELS[0].time,
    timeUsed: 0,
    misses: 0,
    findsThisLevel: 0,
    totalFound: 0,
    flash: null, // { kind: 'good'|'bad', x, y, panel, until }
    lastEvent: null,
  };

  let timerId = null;

  function level() {
    return LEVELS[state.levelIndex];
  }

  function emit() {
    if (onChange) onChange(state);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      state.timeLeft -= 1;
      state.timeUsed += 1;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        stopTimer();
        state.screen = SCREENS.TIME_UP;
        state.combo = 0;
      }
      emit();
    }, 1000);
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.hinted = null;
    state.hintUntil = 0;
    state.hintsLeft = 3;
    state.combo = 0;
    state.timeLeft = level().time;
    state.timeUsed = 0;
    state.misses = 0;
    state.findsThisLevel = 0;
    state.flash = null;
    state.screen = SCREENS.PLAY;
    startTimer();
    emit();
  }

  function startGame() {
    state.score = 0;
    state.bestCombo = 0;
    state.totalFound = 0;
    startLevel(0);
  }

  function toMenu() {
    stopTimer();
    state.screen = SCREENS.MENU;
    state.found = new Set();
    state.hinted = null;
    emit();
  }

  // A click at scene coords (x, y) on either panel. Returns what happened.
  function clickAt(x, y) {
    if (state.screen !== SCREENS.PLAY) return null;
    const lv = level();
    let hit = null;
    for (const d of lv.diffs) {
      if (state.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        hit = d;
        break;
      }
    }
    const now = Date.now();
    if (hit) {
      state.found.add(hit.id);
      state.findsThisLevel += 1;
      state.totalFound += 1;
      state.combo += 1;
      if (state.combo > state.bestCombo) state.bestCombo = state.combo;
      const gained = 100 + (state.combo - 1) * 25;
      state.score += gained;
      state.flash = { kind: 'good', x: hit.x, y: hit.y, until: now + 700 };
      state.lastEvent = { kind: 'found', label: hit.label, gained, at: now };
      if (state.hinted === hit.id) {
        state.hinted = null;
        state.hintUntil = 0;
      }
      if (state.found.size === lv.diffs.length) {
        stopTimer();
        const timeBonus = state.timeLeft * 5;
        state.score += timeBonus;
        state.screen = SCREENS.LEVEL_DONE;
        state.lastEvent.bonus = timeBonus;
      }
      emit();
      return { kind: 'found', diff: hit, gained };
    }
    state.combo = 0;
    state.misses += 1;
    state.timeLeft = Math.max(0, state.timeLeft - 2);
    state.flash = { kind: 'bad', x, y, until: now + 500 };
    state.lastEvent = { kind: 'miss', at: now };
    emit();
    return { kind: 'miss', x, y };
  }

  function useHint() {
    if (state.screen !== SCREENS.PLAY) return null;
    if (state.hintsLeft <= 0) return null;
    const lv = level();
    const remaining = lv.diffs.filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return null;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - 50);
    state.hinted = pick.id;
    state.hintUntil = Date.now() + 3000;
    state.lastEvent = { kind: 'hint', label: pick.label, at: Date.now() };
    emit();
    return pick;
  }

  function nextLevel() {
    if (state.levelIndex + 1 >= LEVELS.length) {
      state.screen = SCREENS.WIN;
      emit();
      return;
    }
    startLevel(state.levelIndex + 1);
  }

  function retryLevel() {
    startLevel(state.levelIndex);
  }

  function remaining() {
    return level().diffs.length - state.found.size;
  }

  function clearHintIfExpired() {
    if (state.hinted && Date.now() > state.hintUntil) {
      state.hinted = null;
      state.hintUntil = 0;
      emit();
    }
  }

  return {
    state,
    level,
    startGame,
    startLevel,
    toMenu,
    clickAt,
    useHint,
    nextLevel,
    retryLevel,
    remaining,
    clearHintIfExpired,
    stopTimer,
  };
}
