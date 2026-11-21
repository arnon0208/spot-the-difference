// shots.js — screenshot presets for Twin Valley. The maker takes the
// screenshots by opening the game with ?shot=<name>: the game itself then
// renders that exact state (a real render of the game's own code, never
// edited or composited). Used by shots.json and by the headless captures.
//
//   ?shot=cover    level 1, 2 of 5 found, 1:27 left
//   ?shot=harbor   level 2, 3 of 6 found, hint ring on a fourth, 1:04 left
//   ?shot=village  level 3, 4 of 7 found, 0:41 left
//   ?shot=menu     the title screen

const PRESETS = {
  cover: { level: 0, found: ['shades', 'cloud'], timeLeft: 87, hint: null },
  harbor: { level: 1, found: ['beam', 'stripe', 'lantern'], timeLeft: 64, hint: 'gull' },
  village: { level: 2, found: ['moon', 'star', 'window', 'cat'], timeLeft: 41, hint: null },
  menu: { level: 0, found: [], timeLeft: 120, hint: null, menu: true },
};

export function applyShot(game, search) {
  const params = new URLSearchParams(search);
  const name = params.get('shot');
  if (!name || !PRESETS[name]) return false;
  const preset = PRESETS[name];
  if (preset.menu) {
    game.toMenu();
    return true;
  }
  game.startLevel(preset.level);
  const { state } = game;
  for (const id of preset.found) state.found.add(id);
  state.findsThisLevel = preset.found.length;
  state.totalFound = preset.found.length;
  state.combo = preset.found.length > 1 ? preset.found.length : 0;
  state.score = preset.found.reduce((sum, _, i) => sum + 100 + i * 25, 0);
  state.timeLeft = preset.timeLeft;
  if (preset.hint) {
    state.hinted = preset.hint;
    state.hintUntil = Date.now() + 60000;
    state.hintsLeft = 2;
  }
  // Freeze the clock so the capture is deterministic.
  game.stopTimer();
  return true;
}

export function shotNames() {
  return Object.keys(PRESETS);
}
