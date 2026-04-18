// js/sprites.js — Sprites: pixel art renderer
window.Sprites = (() => {
  // Precompila uno sprite in OffscreenCanvas[] (un canvas per frame)
  function prerender(def) {
    const scale = def.scale || 3;
    return def.frames.map(frame => {
      const rows = frame.length, cols = frame[0].length;
      const oc = (typeof OffscreenCanvas !== 'undefined')
        ? new OffscreenCanvas(cols * scale, rows * scale)
        : (() => { const c = document.createElement('canvas'); c.width = cols*scale; c.height = rows*scale; return c; })();
      const ctx = oc.getContext('2d');
      frame.forEach((row, ry) => {
        row.forEach((pixel, rx) => {
          if (pixel === 0) return;
          ctx.fillStyle = def.palette[pixel - 1];
          ctx.fillRect(rx * scale, ry * scale, scale, scale);
        });
      });
      return { canvas: oc, w: cols * scale, h: rows * scale };
    });
  }

  // Disegna un prerendered sprite
  function blit(ctx, rendered, frameIdx, x, y, flipX = false) {
    const f = rendered[frameIdx % rendered.length];
    ctx.save();
    if (flipX) {
      ctx.scale(-1, 1);
      ctx.drawImage(f.canvas, -(x + f.w), y);
    } else {
      ctx.drawImage(f.canvas, x, y);
    }
    ctx.restore();
  }

  // Draw direttamente (senza prerender, per sprite rari)
  function draw(ctx, def, x, y, frameIdx = 0, scale = 3) {
    const frame = def.frames[frameIdx % def.frames.length];
    frame.forEach((row, ry) => {
      row.forEach((pixel, rx) => {
        if (pixel === 0) return;
        ctx.fillStyle = def.palette[pixel - 1];
        ctx.fillRect(x + rx * scale, y + ry * scale, scale, scale);
      });
    });
  }

  // Tinted version (utile per flash danno)
  function blitTinted(ctx, rendered, frameIdx, x, y, color, alpha = 0.5) {
    const f = rendered[frameIdx % rendered.length];
    ctx.save();
    ctx.drawImage(f.canvas, x, y);
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color;
    ctx.fillRect(x, y, f.w, f.h);
    ctx.restore();
  }

  return { prerender, blit, blitTinted, draw };
})();
