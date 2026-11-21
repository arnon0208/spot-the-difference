// render.js — draws Twin Valley: the two panels (left original, right with
// every difference applied), the found markers, the hint ring, the click
// flashes and the HUD. Reads game state, never mutates it.

import { SCENE_W, SCENE_H, paintPanel } from './scenes.js';

export const PANEL_W = SCENE_W;
export const PANEL_H = SCENE_H;

export function drawPanels(leftCtx, rightCtx, game) {
  const { state, level } = game;
  const lv = level();
  const applied = new Set(lv.diffs.map((d) => d.id));
  paintPanel(leftCtx, 0, 0, lv, new Set());
  paintPanel(rightCtx, 0, 0, lv, applied);

  const now = Date.now();
  for (const ctx of [leftCtx, rightCtx]) {
    // found markers: satisfying green rings on both panels
    for (const d of lv.diffs) {
      if (!state.found.has(d.id)) continue;
      ctx.save();
      ctx.strokeStyle = '#2ecc40';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(46,204,64,0.35)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#2ecc40';
      ctx.beginPath();
      ctx.arc(d.x + d.r * 0.6, d.y - d.r * 0.6, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(d.x + d.r * 0.6 - 5, d.y - d.r * 0.6);
      ctx.lineTo(d.x + d.r * 0.6 - 1, d.y - d.r * 0.6 + 4);
      ctx.lineTo(d.x + d.r * 0.6 + 6, d.y - d.r * 0.6 - 5);
      ctx.stroke();
      ctx.restore();
    }
    // hint ring: a pulsing gold circle around one unfound difference
    if (state.hinted && now < state.hintUntil) {
      const d = lv.diffs.find((x) => x.id === state.hinted);
      if (d) {
        const pulse = 1 + 0.15 * Math.sin(now / 150);
        ctx.save();
        ctx.strokeStyle = '#ffbf00';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.arc(d.x, d.y, (d.r + 10) * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
    // click flash
    if (state.flash && now < state.flash.until) {
      const f = state.flash;
      const alpha = 1 - (now - (f.until - (f.kind === 'good' ? 700 : 500))) / (f.kind === 'good' ? 700 : 500);
      ctx.save();
      if (f.kind === 'good') {
        ctx.strokeStyle = `rgba(46,204,64,${Math.max(0, alpha)})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 26 + (1 - Math.max(0, alpha)) * 14, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeStyle = `rgba(220,40,40,${Math.max(0, alpha)})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(f.x - 12, f.y - 12);
        ctx.lineTo(f.x + 12, f.y + 12);
        ctx.moveTo(f.x + 12, f.y - 12);
        ctx.lineTo(f.x - 12, f.y + 12);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Fill the DOM HUD from state. Elements are looked up once by main.js and
// passed in as a map of id -> element.
export function renderHud(els, game) {
  const { state, level, remaining } = game;
  const lv = level();
  els.levelName.textContent = lv.name;
  els.levelSub.textContent = lv.sub;
  els.timeText.textContent = formatTime(Math.max(0, state.timeLeft));
  els.timeFill.style.width = `${(Math.max(0, state.timeLeft) / lv.time) * 100}%`;
  els.timeFill.classList.toggle('low', state.timeLeft <= 15);
  els.scoreText.textContent = String(state.score);
  els.comboText.textContent = state.combo > 1 ? `x${state.combo} combo` : '';
  els.foundText.textContent = `${state.found.size} / ${lv.diffs.length} found · ${remaining()} left`;
  els.hintText.textContent = `Hint (${state.hintsLeft})`;
  els.hintButton.disabled = state.hintsLeft <= 0 || state.screen !== 'play';
  const ev = state.lastEvent;
  if (ev) {
    if (ev.kind === 'found') {
      els.eventText.textContent = `Found: ${ev.label}  +${ev.gained}${ev.bonus ? `  · time bonus +${ev.bonus}` : ''}`;
    } else if (ev.kind === 'miss') {
      els.eventText.textContent = 'Not a difference — combo lost, −2s';
    } else if (ev.kind === 'hint') {
      els.eventText.textContent = 'Hint: look for the gold ring (−50 pts)';
    }
  }
}

export function showScreen(els, game) {
  const { state } = game;
  for (const key of ['menu', 'play', 'levelDone', 'win', 'timeUp']) {
    els.screens[key].hidden = true;
  }
  if (state.screen === 'menu') {
    els.screens.menu.hidden = false;
  } else if (state.screen === 'play') {
    els.screens.play.hidden = false;
  } else if (state.screen === 'level-done') {
    els.levelDoneTitle.textContent = 'Level clear!';
    els.levelDoneText.textContent = `You found every difference in ${game.level().name}. Time bonus banked — on to the next scene.`;
    els.screens.levelDone.hidden = false;
  } else if (state.screen === 'win') {
    els.winScore.textContent = String(state.score);
    els.winStats.textContent = `${state.totalFound} differences found · best combo x${state.bestCombo}`;
    els.screens.win.hidden = false;
  } else if (state.screen === 'time-up') {
    els.timeUpText.textContent = `Time ran out on ${game.level().name} with ${game.remaining()} difference${game.remaining() === 1 ? '' : 's'} still hiding.`;
    els.screens.timeUp.hidden = false;
  }
}
