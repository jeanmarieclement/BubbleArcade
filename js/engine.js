// js/engine.js — BubbleEngine global (no ES modules, works on file://)
window.BubbleEngine = (() => {
  let _canvas, _ctx, _raf, _last = 0, _paused = false;
  let _updateFn = () => {}, _renderFn = () => {};

  // ── INPUT ────────────────────────────────────────────────
  const input = {
    keys: new Set(),
    justPressed: new Set(),
    justReleased: new Set(),
    pointer: { x: 0, y: 0, down: false, justDown: false, justUp: false },

    _install(canvas) {
      window.addEventListener('keydown', e => {
        if (!input.keys.has(e.code)) input.justPressed.add(e.code);
        input.keys.add(e.code);
        if (!audio.ctx) audio._init();
        e.preventDefault();
      });
      window.addEventListener('keyup', e => {
        input.keys.delete(e.code);
        input.justReleased.add(e.code);
      });
      const getPos = (e, c) => {
        const r = c.getBoundingClientRect();
        const scaleX = c.width / r.width, scaleY = c.height / r.height;
        const src = e.touches ? e.touches[0] : e;
        return { x: (src.clientX - r.left) * scaleX, y: (src.clientY - r.top) * scaleY };
      };
      canvas.addEventListener('mousedown', e => {
        const p = getPos(e, canvas);
        input.pointer = { ...p, down: true, justDown: true, justUp: false };
        if (!audio.ctx) audio._init();
      });
      canvas.addEventListener('mousemove', e => {
        const p = getPos(e, canvas);
        input.pointer.x = p.x; input.pointer.y = p.y;
      });
      canvas.addEventListener('mouseup', () => {
        input.pointer.down = false; input.pointer.justDown = false; input.pointer.justUp = true;
      });
      canvas.addEventListener('touchstart', e => {
        const p = getPos(e, canvas);
        input.pointer = { ...p, down: true, justDown: true, justUp: false };
        if (!audio.ctx) audio._init();
        e.preventDefault();
      }, { passive: false });
      canvas.addEventListener('touchmove', e => {
        const p = getPos(e, canvas);
        input.pointer.x = p.x; input.pointer.y = p.y; e.preventDefault();
      }, { passive: false });
      canvas.addEventListener('touchend', () => {
        input.pointer.down = false; input.pointer.justDown = false; input.pointer.justUp = true;
      });
    },

    _flush() {
      input.justPressed.clear();
      input.justReleased.clear();
      input.pointer.justDown = false;
      input.pointer.justUp = false;
    }
  };

  // ── AUDIO ────────────────────────────────────────────────
  const audio = {
    ctx: null, masterGain: null,

    _init() {
      audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
      audio.masterGain = audio.ctx.createGain();
      audio.masterGain.gain.value = 0.3;
      audio.masterGain.connect(audio.ctx.destination);
    },

    beep(freq = 440, duration = 0.1, type = 'square', volume = 1) {
      if (!audio.ctx) return;
      const osc = audio.ctx.createOscillator();
      const gain = audio.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, audio.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audio.masterGain);
      osc.start();
      osc.stop(audio.ctx.currentTime + duration);
    },

    noise(duration = 0.1, volume = 0.5) {
      if (!audio.ctx) return;
      const bufSize = audio.ctx.sampleRate * duration;
      const buf = audio.ctx.createBuffer(1, bufSize, audio.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = audio.ctx.createBufferSource();
      const gain = audio.ctx.createGain();
      src.buffer = buf;
      gain.gain.setValueAtTime(volume, audio.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.ctx.currentTime + duration);
      src.connect(gain);
      gain.connect(audio.masterGain);
      src.start();
    },

    playMelody(notes) {
      if (!audio.ctx) return;
      let t = audio.ctx.currentTime;
      notes.forEach(n => {
        const osc = audio.ctx.createOscillator();
        const gain = audio.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = n.freq;
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur);
        osc.connect(gain);
        gain.connect(audio.masterGain);
        osc.start(t);
        osc.stop(t + n.dur);
        t += n.dur + 0.02;
      });
    }
  };

  // ── LOOP ─────────────────────────────────────────────────
  const loop = {
    start() {
      _last = performance.now();
      _raf = requestAnimationFrame(loop._tick);
    },
    stop() { cancelAnimationFrame(_raf); },
    pause() { _paused = true; },
    resume() { _paused = false; _last = performance.now(); },

    _tick(timestamp) {
      _raf = requestAnimationFrame(loop._tick);
      if (_paused) return;
      const dt = Math.min((timestamp - _last) / 1000, 0.1);
      _last = timestamp;
      _updateFn(dt);
      _ctx.clearRect(0, 0, _canvas.width / (window.devicePixelRatio || 1), _canvas.height / (window.devicePixelRatio || 1));
      _renderFn(_ctx);
      input._flush();
    }
  };

  // ── UTILS ─────────────────────────────────────────────────
  const utils = {
    lerp: (a, b, t) => a + (b - a) * t,
    clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
    randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    randFloat: (min, max) => Math.random() * (max - min) + min,
    AABB: (ax, ay, aw, ah, bx, by, bw, bh) =>
      ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
  };

  // ── PUBLIC API ────────────────────────────────────────────
  return {
    input, audio, loop, utils,
    get ctx() { return _ctx; },

    init(canvas, { width = 480, height = 640, update, render } = {}) {
      _canvas = canvas;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = width  + 'px';
      canvas.style.height = height + 'px';
      _ctx = canvas.getContext('2d');
      _ctx.scale(dpr, dpr);
      if (update) _updateFn = update;
      if (render) _renderFn = render;
      input._install(canvas);
    },

    setCallbacks(update, render) {
      _updateFn = update;
      _renderFn = render;
    }
  };
})();
