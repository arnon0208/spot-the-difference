// main.js — Twin Valley boot: wires the canvases, the HUD, the buttons and
// the game state together, and runs the frame loop that keeps the hint ring
// pulsing and the click flashes fading.

import { createGame, SCREENS } from './game.js';
import { drawPanels, renderHud, showScreen } from './render.js';
import { attachInput } from './input.js';
import { applyShot } from './shots.js';

const $ = (id) => document.getElementById(id);

const leftCanvas = $('panel-left');
const rightCanvas = $('panel-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

const els = {
  levelName: $('level-name'),
  levelSub: $('level-sub'),
  timeText: $('time-text'),
  timeFill: $('time-fill'),
  scoreText: $('score-text'),
  comboText: $('combo-text'),
  foundText: $('found-text'),
  eventText: $('event-text'),
  hintText: $('hint-text'),
  hintButton: $('hint-button'),
  screens: {
    menu: $('screen-menu'),
    play: $('screen-play'),
    levelDone: $('screen-level-done'),
    win: $('screen-win'),
    timeUp: $('screen-time-up'),
  },
  levelDoneTitle: $('level-done-title'),
  levelDoneText: $('level-done-text'),
  winScore: $('win-score'),
  winStats: $('win-stats'),
  timeUpText: $('time-up-text'),
};

let game;

function redraw() {
  if (!game) return;
  if (game.state.screen === SCREENS.PLAY || game.state.screen === SCREENS.LEVEL_DONE) {
    drawPanels(leftCtx, rightCtx, game);
  }
  renderHud(els, game);
  showScreen(els, game);
}

function frame() {
  if (game && game.state.screen === SCREENS.PLAY) {
    game.clearHintIfExpired();
    drawPanels(leftCtx, rightCtx, game);
  }
  requestAnimationFrame(frame);
}

function bindButtons() {
  $('play-button').addEventListener('click', () => {
    game.startGame();
    redraw();
  });
  document.querySelectorAll('[data-level]').forEach((button) => {
    button.addEventListener('click', () => {
      game.startLevel(Number(button.dataset.level));
      redraw();
    });
  });
  els.hintButton.addEventListener('click', () => {
    game.useHint();
    redraw();
  });
  $('lens-button').addEventListener('click', () => {
    const on = input.toggleLens();
    $('lens-button').textContent = on ? 'Magnifier: on (M)' : 'Magnifier: off (M)';
  });
  $('restart-button').addEventListener('click', () => {
    game.retryLevel();
    redraw();
  });
  $('menu-button').addEventListener('click', () => {
    game.toMenu();
    redraw();
  });
  $('next-button').addEventListener('click', () => {
    game.nextLevel();
    redraw();
  });
  $('again-button').addEventListener('click', () => {
    game.startGame();
    redraw();
  });
  $('win-menu-button').addEventListener('click', () => {
    game.toMenu();
    redraw();
  });
  $('retry-button').addEventListener('click', () => {
    game.retryLevel();
    redraw();
  });
  $('timeup-menu-button').addEventListener('click', () => {
    game.toMenu();
    redraw();
  });
}

game = createGame(() => redraw());
const input = attachInput({
  leftCanvas,
  rightCanvas,
  lensCanvas: $('lens'),
  game,
  onRedraw: redraw,
});
bindButtons();

// Screenshot mode: ?shot=cover|harbor|village|menu renders a fixed state.
const shotApplied = applyShot(game, window.location.search);
redraw();
if (!shotApplied) {
  game.toMenu();
  redraw();
}
requestAnimationFrame(frame);
