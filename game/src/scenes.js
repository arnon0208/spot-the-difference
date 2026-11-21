// scenes.js — the three hand-drawn scenes of Twin Valley.
// Every scene paints the same base picture on both panels; the right panel
// additionally applies that level's differences. A difference is a small,
// fair, findable change with a click target (x, y, r) in scene space
// (600 x 460) and an apply() that draws the variant over the base.

export const SCENE_W = 600;
export const SCENE_H = 460;

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function star(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.4;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 34 * s, 20 * s);
  ellipse(ctx, x - 24 * s, y + 6 * s, 24 * s, 15 * s);
  ellipse(ctx, x + 26 * s, y + 6 * s, 26 * s, 16 * s);
}

function pine(ctx, x, y, s, snow) {
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(x - 4 * s, y, 8 * s, 18 * s);
  ctx.fillStyle = '#1f6b3a';
  poly(ctx, [[x, y - 78 * s], [x - 30 * s, y], [x + 30 * s, y]]);
  poly(ctx, [[x, y - 104 * s], [x - 22 * s, y - 34 * s], [x + 22 * s, y - 34 * s]]);
  if (snow) {
    ctx.fillStyle = '#f4f8ff';
    poly(ctx, [[x, y - 104 * s], [x - 10 * s, y - 78 * s], [x + 10 * s, y - 78 * s]]);
    ellipse(ctx, x - 16 * s, y - 52 * s, 12 * s, 4 * s);
    ellipse(ctx, x + 14 * s, y - 30 * s, 12 * s, 4 * s);
  }
}

function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.1, Math.PI * 1.85);
  ctx.stroke();
}

// ---------------------------------------------------------------- level 1

function paintMeadowBase(ctx, ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec8f2');
  sky.addColorStop(1, '#dff3ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 300);
  // sun
  ctx.fillStyle = '#ffd94a';
  circle(ctx, 92, 78, 34);
  ctx.strokeStyle = '#f2b705';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(92 + Math.cos(a) * 42, 78 + Math.sin(a) * 42);
    ctx.lineTo(92 + Math.cos(a) * 54, 78 + Math.sin(a) * 54);
    ctx.stroke();
  }
  ctx.fillStyle = '#fff';
  cloud(ctx, 300, 66, 1, '#ffffff');
  cloud(ctx, 470, 108, 0.8, '#ffffff');
  cloud(ctx, 160, 130, 0.7, '#f2f9ff');
  bird(ctx, 250, 96, 1);
  bird(ctx, 400, 60, 1);
  bird(ctx, 520, 140, 0.9);
  // hills
  ctx.fillStyle = '#7cc46a';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(180, 240, 380, 300);
  ctx.quadraticCurveTo(500, 330, 600, 290);
  ctx.lineTo(600, 460);
  ctx.lineTo(0, 460);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5da94f';
  ctx.beginPath();
  ctx.moveTo(0, 360);
  ctx.quadraticCurveTo(220, 310, 420, 360);
  ctx.quadraticCurveTo(520, 385, 600, 350);
  ctx.lineTo(600, 460);
  ctx.lineTo(0, 460);
  ctx.closePath();
  ctx.fill();
  // pond
  ctx.fillStyle = '#5fb7e8';
  ellipse(ctx, 490, 420, 78, 26);
  ctx.fillStyle = '#8ed0f2';
  ellipse(ctx, 470, 414, 40, 12);
  // house
  ctx.fillStyle = '#fff3d6';
  ctx.fillRect(330, 280, 120, 90);
  ctx.fillStyle = '#c65b4e';
  poly(ctx, [[318, 284], [390, 232], [462, 284]]);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(382, 322, 22, 48);
  ctx.fillStyle = '#ffd94a';
  ctx.fillRect(344, 300, 24, 24);
  ctx.fillRect(414, 300, 24, 24);
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 2;
  ctx.strokeRect(344, 300, 24, 24);
  ctx.strokeRect(414, 300, 24, 24);
  ctx.fillStyle = '#a34d3f';
  ctx.fillRect(428, 240, 16, 34);
  ctx.fillStyle = '#e8e8e8';
  ellipse(ctx, 436, 232, 12, 7);
  ellipse(ctx, 436, 220, 9, 6);
  // oak tree
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(96, 300, 16, 70);
  ctx.fillStyle = '#3f8f3a';
  circle(ctx, 104, 268, 44);
  circle(ctx, 66, 292, 30);
  circle(ctx, 142, 292, 30);
  pine(ctx, 250, 400, 1, false);
  // fence
  ctx.strokeStyle = '#a9743f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(300, 400);
  ctx.moveTo(0, 414);
  ctx.lineTo(300, 414);
  ctx.stroke();
  ctx.fillStyle = '#a9743f';
  for (let x = 12; x <= 290; x += 46) ctx.fillRect(x, 388, 7, 36);
  // flowers
  const petals = ['#b678e8', '#e86a8a', '#ffffff', '#f2a541', '#e86a8a'];
  for (let i = 0; i < 5; i++) {
    const fx = 330 + i * 26;
    ctx.strokeStyle = '#3f8f3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, 452);
    ctx.lineTo(fx, 432);
    ctx.stroke();
    ctx.fillStyle = petals[i];
    circle(ctx, fx, 426, 8);
    ctx.fillStyle = '#ffd94a';
    circle(ctx, fx, 426, 3);
  }
  ctx.restore();
}

const MEADOW_DIFFS = [
  {
    id: 'shades', x: 92, y: 78, r: 30, label: 'Sun wears sunglasses',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#222';
      ellipse(ctx, 80, 76, 11, 8);
      ellipse(ctx, 104, 76, 11, 8);
      ctx.fillRect(90, 74, 5, 4);
      ctx.restore();
    },
  },
  {
    id: 'cloud', x: 300, y: 66, r: 30, label: 'Middle cloud is gone',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      const sky = ctx.createLinearGradient(0, 0, 0, 300);
      sky.addColorStop(0, '#7ec8f2');
      sky.addColorStop(1, '#dff3ff');
      ctx.fillStyle = sky;
      ctx.fillRect(246, 34, 110, 56);
      ctx.restore();
    },
  },
  {
    id: 'window', x: 426, y: 312, r: 18, label: 'Window turns blue',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#4a90d9';
      ctx.fillRect(414, 300, 24, 24);
      ctx.restore();
    },
  },
  {
    id: 'flower', x: 382, y: 426, r: 16, label: 'A flower turns red',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#d92b2b';
      circle(ctx, 382, 426, 8);
      ctx.fillStyle = '#ffd94a';
      circle(ctx, 382, 426, 3);
      ctx.restore();
    },
  },
  {
    id: 'bird', x: 480, y: 92, r: 20, label: 'An extra bird',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      bird(ctx, 480, 92, 1);
      ctx.restore();
    },
  },
];

// ---------------------------------------------------------------- level 2

function paintHarborBase(ctx, ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#3b2a63');
  sky.addColorStop(0.55, '#c65b7c');
  sky.addColorStop(1, '#f2a541');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 260);
  // setting sun
  ctx.fillStyle = '#ffdf6b';
  circle(ctx, 300, 232, 40);
  ctx.fillStyle = '#ffb347';
  circle(ctx, 300, 232, 30);
  // sea
  const sea = ctx.createLinearGradient(0, 260, 0, 460);
  sea.addColorStop(0, '#e8836b');
  sea.addColorStop(1, '#274b73');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 260, 600, 200);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 3;
  for (const [wx, wy, wl] of [[80, 300, 60], [420, 320, 70], [180, 380, 80], [460, 410, 60], [90, 430, 50]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + wl / 2, wy - 8, wx + wl, wy);
    ctx.stroke();
  }
  // gulls
  bird(ctx, 120, 90, 1);
  bird(ctx, 420, 110, 1);
  bird(ctx, 520, 70, 0.9);
  // lighthouse on rock, left
  ctx.fillStyle = '#5b5b6e';
  poly(ctx, [[30, 300], [70, 250], [150, 250], [190, 300]]);
  ctx.fillStyle = '#f4f1e6';
  ctx.fillRect(88, 150, 34, 104);
  ctx.fillStyle = '#c65b4e';
  ctx.fillRect(88, 176, 34, 14);
  ctx.fillRect(88, 210, 34, 14);
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(82, 128, 46, 24);
  ctx.fillStyle = '#ffe27a';
  circle(ctx, 105, 140, 10);
  ctx.fillStyle = 'rgba(255,226,122,0.25)';
  poly(ctx, [[105, 140], [240, 100], [240, 180]]);
  // sailboats
  ctx.fillStyle = '#6b4423';
  poly(ctx, [[300, 330], [360, 330], [350, 344], [310, 344]]);
  ctx.fillStyle = '#ffffff';
  poly(ctx, [[330, 330], [330, 268], [356, 330]]);
  ctx.fillStyle = '#f2f2f2';
  poly(ctx, [[326, 330], [326, 282], [306, 330]]);
  ctx.fillStyle = '#6b4423';
  poly(ctx, [[450, 380], [500, 380], [492, 392], [458, 392]]);
  ctx.fillStyle = '#ffe9a8';
  poly(ctx, [[475, 380], [475, 332], [496, 380]]);
  // pier
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(430, 392, 170, 16);
  ctx.fillRect(446, 408, 10, 40);
  ctx.fillRect(560, 408, 10, 40);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(452, 372, 26, 20);
  ctx.fillRect(482, 372, 26, 20);
  ctx.strokeStyle = '#5b3a22';
  ctx.lineWidth = 2;
  ctx.strokeRect(452, 372, 26, 20);
  ctx.strokeRect(482, 372, 26, 20);
  // lantern post
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(580, 392);
  ctx.lineTo(580, 330);
  ctx.stroke();
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(570, 318, 20, 14);
  ctx.fillStyle = '#ffd94a';
  circle(ctx, 580, 330, 7);
  ctx.restore();
}

const HARBOR_DIFFS = [
  {
    id: 'beam', x: 105, y: 140, r: 26, label: 'Lighthouse lamp is dark',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      // Repaint the beam's region with the same dusk gradient the sky uses,
      // so the beam vanishes instead of leaving a flat patch.
      const sky = ctx.createLinearGradient(0, 0, 0, 260);
      sky.addColorStop(0, '#3b2a63');
      sky.addColorStop(0.55, '#c65b7c');
      sky.addColorStop(1, '#f2a541');
      ctx.fillStyle = sky;
      ctx.fillRect(100, 94, 148, 92);
      ctx.fillStyle = '#2b2b3a';
      circle(ctx, 105, 140, 10);
      ctx.restore();
    },
  },
  {
    id: 'stripe', x: 343, y: 300, r: 24, label: 'Sail gains a red stripe',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#d92b2b';
      poly(ctx, [[330, 296], [344, 296], [352, 318], [330, 318]]);
      ctx.restore();
    },
  },
  {
    id: 'crate', x: 524, y: 382, r: 22, label: 'An extra crate on the pier',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#8a5a33';
      ctx.fillRect(514, 372, 26, 20);
      ctx.strokeStyle = '#5b3a22';
      ctx.lineWidth = 2;
      ctx.strokeRect(514, 372, 26, 20);
      ctx.restore();
    },
  },
  {
    id: 'gull', x: 420, y: 110, r: 18, label: 'A gull is gone',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      const sky = ctx.createLinearGradient(0, 0, 0, 260);
      sky.addColorStop(0, '#3b2a63');
      sky.addColorStop(0.55, '#c65b7c');
      sky.addColorStop(1, '#f2a541');
      ctx.fillStyle = sky;
      ctx.fillRect(398, 92, 46, 34);
      ctx.restore();
    },
  },
  {
    id: 'lantern', x: 580, y: 330, r: 18, label: 'Lantern glows green',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#7be382';
      circle(ctx, 580, 330, 7);
      ctx.restore();
    },
  },
  {
    id: 'buoy', x: 200, y: 420, r: 16, label: 'A buoy appears',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#ff7a1a';
      circle(ctx, 200, 418, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(192, 414, 16, 5);
      ctx.restore();
    },
  },
];

// ---------------------------------------------------------------- level 3

function paintVillageBase(ctx, ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#0b1030');
  sky.addColorStop(1, '#27355e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 300);
  // stars
  ctx.fillStyle = '#ffffff';
  for (const [sx, sy, sr] of [[60, 60, 3], [150, 70, 2], [230, 40, 3], [330, 80, 2], [420, 50, 3], [480, 120, 2], [90, 150, 2], [270, 120, 2], [540, 40, 2], [380, 140, 2]]) {
    star(ctx, sx, sy, sr);
  }
  // crescent moon
  ctx.fillStyle = '#f4ecd8';
  circle(ctx, 520, 82, 30);
  ctx.fillStyle = '#0b1030';
  circle(ctx, 532, 74, 26);
  // snowy ground
  ctx.fillStyle = '#e8eef7';
  ctx.fillRect(0, 330, 600, 130);
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, 120, 350, 90, 14);
  ellipse(ctx, 450, 360, 110, 16);
  // houses
  function house(x, y, w, lit) {
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(x, y, w, 80);
    ctx.fillStyle = '#f4f8ff';
    poly(ctx, [[x - 10, y], [x + w / 2, y - 44], [x + w + 10, y]]);
    ctx.fillStyle = lit ? '#ffd94a' : '#3a3a4a';
    ctx.fillRect(x + 14, y + 20, 22, 22);
    ctx.fillRect(x + w - 36, y + 20, 22, 22);
    ctx.strokeStyle = '#5b3a22';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 14, y + 20, 22, 22);
    ctx.strokeRect(x + w - 36, y + 20, 22, 22);
    ctx.fillStyle = '#5b3a22';
    ctx.fillRect(x + w / 2 - 10, y + 44, 20, 36);
  }
  house(60, 280, 110, true);
  house(240, 260, 130, true);
  house(430, 280, 110, true);
  // chimney smoke on middle house
  ctx.fillStyle = 'rgba(230,230,230,0.85)';
  ellipse(ctx, 330, 200, 12, 7);
  ellipse(ctx, 336, 186, 9, 6);
  ellipse(ctx, 342, 174, 7, 5);
  // cat on the right house roof
  ctx.fillStyle = '#222';
  ellipse(ctx, 462, 244, 14, 8);
  circle(ctx, 474, 236, 6);
  poly(ctx, [[470, 230], [472, 222], [476, 230]]);
  poly(ctx, [[476, 230], [478, 222], [480, 230]]);
  // pines with snow
  pine(ctx, 200, 400, 1.1, true);
  pine(ctx, 560, 410, 0.9, true);
  // snowman
  ctx.fillStyle = '#ffffff';
  circle(ctx, 150, 420, 22);
  circle(ctx, 150, 386, 16);
  circle(ctx, 150, 360, 12);
  ctx.fillStyle = '#222';
  circle(ctx, 145, 356, 2);
  circle(ctx, 155, 356, 2);
  ctx.fillStyle = '#e8734a';
  poly(ctx, [[150, 360], [168, 364], [150, 368]]);
  // lantern posts
  for (const lx of [90, 380]) {
    ctx.strokeStyle = '#2b2b3a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(lx, 400);
    ctx.lineTo(lx, 350);
    ctx.stroke();
    ctx.fillStyle = '#2b2b3a';
    ctx.fillRect(lx - 10, 340, 20, 12);
    ctx.fillStyle = '#ffd94a';
    circle(ctx, lx, 352, 6);
  }
  ctx.restore();
}

const VILLAGE_DIFFS = [
  {
    id: 'moon', x: 520, y: 82, r: 26, label: 'The moon is full',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#f4ecd8';
      circle(ctx, 520, 82, 30);
      ctx.fillStyle = '#d9cba8';
      circle(ctx, 512, 74, 5);
      circle(ctx, 530, 92, 4);
      ctx.restore();
    },
  },
  {
    id: 'star', x: 150, y: 70, r: 14, label: 'A star is gone',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#0b1030';
      ctx.fillRect(138, 58, 26, 26);
      ctx.restore();
    },
  },
  {
    id: 'window', x: 334, y: 290, r: 16, label: 'A window goes dark',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#3a3a4a';
      ctx.fillRect(334, 280, 22, 22);
      ctx.restore();
    },
  },
  {
    id: 'cat', x: 462, y: 240, r: 18, label: 'The cat is gone',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#f4f8ff';
      poly(ctx, [[448, 240], [480, 222], [512, 240]]);
      ctx.restore();
    },
  },
  {
    id: 'hat', x: 150, y: 348, r: 20, label: 'Snowman wears a red hat',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#d92b2b';
      ctx.fillRect(138, 342, 24, 8);
      ctx.fillRect(142, 330, 16, 12);
      ctx.restore();
    },
  },
  {
    id: 'lamp', x: 90, y: 352, r: 16, label: 'A lantern glows blue',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = '#7ab8ff';
      circle(ctx, 90, 352, 6);
      ctx.restore();
    },
  },
  {
    id: 'smoke', x: 336, y: 188, r: 20, label: 'Chimney smoke is gone',
    apply(ctx, ox, oy) {
      ctx.save();
      ctx.translate(ox, oy);
      // Repaint with the same night gradient the sky uses, so the smoke
      // vanishes instead of leaving a flat patch.
      const sky = ctx.createLinearGradient(0, 0, 0, 300);
      sky.addColorStop(0, '#0b1030');
      sky.addColorStop(1, '#27355e');
      ctx.fillStyle = sky;
      ctx.fillRect(314, 164, 38, 46);
      ctx.restore();
    },
  },
];

// ---------------------------------------------------------------- registry

export const LEVELS = [
  {
    id: 'meadow', name: 'Sunny Meadow', sub: 'Level 1 · 5 differences · 120 seconds',
    time: 120, paint: paintMeadowBase, diffs: MEADOW_DIFFS,
  },
  {
    id: 'harbor', name: 'Harbor Dusk', sub: 'Level 2 · 6 differences · 100 seconds',
    time: 100, paint: paintHarborBase, diffs: HARBOR_DIFFS,
  },
  {
    id: 'village', name: 'Starry Village', sub: 'Level 3 · 7 differences · 90 seconds',
    time: 90, paint: paintVillageBase, diffs: VILLAGE_DIFFS,
  },
];

// Paint one panel: base scene, then every difference whose id is in `applied`.
export function paintPanel(ctx, ox, oy, level, applied) {
  level.paint(ctx, ox, oy);
  for (const d of level.diffs) {
    if (applied.has(d.id)) d.apply(ctx, ox, oy);
  }
}
