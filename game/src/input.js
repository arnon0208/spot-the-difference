// input.js — pointer and keyboard input for Twin Valley: click a panel to
// test a spot, and a magnifier lens that follows the cursor so small
// differences can be inspected up close.

export function attachInput({ leftCanvas, rightCanvas, lensCanvas, game, onRedraw }) {
  const lens = lensCanvas.getContext('2d');
  const LENS_R = 78;
  const ZOOM = 2;
  let lensOn = true;
  let lensVisible = false;

  function canvasPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function handleClick(canvas, event) {
    const p = canvasPoint(canvas, event);
    game.clickAt(p.x, p.y);
    onRedraw();
  }

  leftCanvas.addEventListener('click', (e) => handleClick(leftCanvas, e));
  rightCanvas.addEventListener('click', (e) => handleClick(rightCanvas, e));

  function moveLens(canvas, event) {
    if (!lensOn) {
      lensCanvas.style.display = 'none';
      lensVisible = false;
      return;
    }
    const p = canvasPoint(canvas, event);
    const rect = canvas.getBoundingClientRect();
    lensCanvas.style.display = 'block';
    lensCanvas.style.left = `${event.clientX - LENS_R}px`;
    lensCanvas.style.top = `${event.clientY - LENS_R}px`;
    lensVisible = true;
    const src = p.x - (LENS_R / ZOOM);
    const srcY = p.y - (LENS_R / ZOOM);
    lens.clearRect(0, 0, LENS_R * 2, LENS_R * 2);
    lens.save();
    lens.beginPath();
    lens.arc(LENS_R, LENS_R, LENS_R - 3, 0, Math.PI * 2);
    lens.clip();
    lens.imageSmoothingEnabled = false;
    lens.drawImage(
      canvas,
      src, srcY, (LENS_R * 2) / ZOOM, (LENS_R * 2) / ZOOM,
      0, 0, LENS_R * 2, LENS_R * 2,
    );
    lens.restore();
    lens.strokeStyle = '#2b2b3a';
    lens.lineWidth = 4;
    lens.beginPath();
    lens.arc(LENS_R, LENS_R, LENS_R - 2, 0, Math.PI * 2);
    lens.stroke();
    lens.strokeStyle = 'rgba(43,43,58,0.6)';
    lens.lineWidth = 1;
    lens.beginPath();
    lens.moveTo(LENS_R - 8, LENS_R);
    lens.lineTo(LENS_R + 8, LENS_R);
    lens.moveTo(LENS_R, LENS_R - 8);
    lens.lineTo(LENS_R, LENS_R + 8);
    lens.stroke();
  }

  function hideLens() {
    lensCanvas.style.display = 'none';
    lensVisible = false;
  }

  for (const canvas of [leftCanvas, rightCanvas]) {
    canvas.addEventListener('mousemove', (e) => moveLens(canvas, e));
    canvas.addEventListener('mouseleave', hideLens);
  }

  function toggleLens() {
    lensOn = !lensOn;
    if (!lensOn) hideLens();
    return lensOn;
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') {
      game.useHint();
      onRedraw();
    } else if (event.key === 'm' || event.key === 'M') {
      toggleLens();
    } else if (event.key === 'r' || event.key === 'R') {
      game.retryLevel();
      onRedraw();
    }
  });

  return { toggleLens, hideLens };
}
