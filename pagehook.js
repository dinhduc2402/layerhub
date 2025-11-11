(() => {
  try {
    if (window.__LH_DL_HOOKED__) return; window.__LH_DL_HOOKED__ = true;

    const getDL = () => window.dataLayer || window.datalayer || window.data_layer;
    function emit(type, detail) {
      try { window.dispatchEvent(new CustomEvent(type, { detail })); } catch (_) { }
      try { document.dispatchEvent(new CustomEvent(type, { detail })); } catch (_) { }
    }

    // Create a structured-clone-safe copy (no functions/symbols), limited depth
    function sanitize(value, depth = 0, seen) {
      const MAX_DEPTH = 6;
      if (value == null) return value;
      const t = typeof value;
      if (t === 'string' || t === 'number' || t === 'boolean') return value;
      if (t === 'bigint') return Number(value);
      if (t === 'symbol' || t === 'function') return undefined;
      if (depth >= MAX_DEPTH) return undefined;
      seen = seen || new WeakSet();
      if (typeof value === 'object') {
        if (seen.has(value)) return undefined;
        seen.add(value);
        if (Array.isArray(value)) {
          const out = [];
          for (let i = 0; i < value.length; i++) {
            const v = sanitize(value[i], depth + 1, seen);
            if (v !== undefined) out.push(v);
          }
          return out;
        }
        const out = {};
        for (const k in value) {
          try {
            const v = sanitize(value[k], depth + 1, seen);
            if (v !== undefined) out[k] = v;
          } catch (_) { }
        }
        return out;
      }
      return undefined;
    }

    function isArrayLikeWithPush(v) {
      return v && typeof v.push === 'function' && typeof v.length === 'number';
    }

    function hook(dl) {
      if (!isArrayLikeWithPush(dl)) return false;
      if (dl.__LH_WRAPPED__) return true;
      dl.__LH_WRAPPED__ = true;
      // initial emit
      let lastIndex = 0;
      try {
        const raw = Array.prototype.slice.call(dl);
        lastIndex = raw.length;
        const snapshot = sanitize(raw);
        emit('LH_DL_INITIAL', { items: snapshot });
      } catch (e) { }

      // try wrapping push (best-effort)
      try {
        const originalPush = dl.push.bind(dl);
        dl.push = function (...args) {
          const r = originalPush(...args);
          try { args.forEach(x => emit('LH_DL_PUSH', { item: sanitize(x) })); } catch (e) { }
          lastIndex = dl.length;
          return r;
        };
      } catch (e) { }

      // polling fallback for proxies/immutable push
      const poll = setInterval(() => {
        try {
          const len = dl.length >>> 0;
          if (len > lastIndex) {
            for (let i = lastIndex; i < len; i++) {
              try { emit('LH_DL_PUSH', { item: sanitize(dl[i]) }); } catch (_) { }
            }
            lastIndex = len;
          }
        } catch (_) { }
      }, 250);
      try { dl.__LH_POLL__ = poll; } catch (_) { }
      return true;
    }

    // Attempt immediately, then poll for late initialization
    if (!hook(getDL())) {
      const startedAt = Date.now();
      const iv = setInterval(() => {
        const ok = hook(getDL());
        if (ok || Date.now() - startedAt > 20000) clearInterval(iv);
      }, 300);
    }
    // Allow re-requesting current snapshot when panel opens later
    document.addEventListener('LH_DL_REQUEST_INITIAL', () => {
      try {
        const dl = getDL();

        if (isArrayLikeWithPush(dl)) {
          const raw = Array.prototype.slice.call(dl);
          const snapshot = sanitize(raw);
          emit('LH_DL_INITIAL', { items: snapshot });
        }
      } catch (_) { }
    });

    // Signal that the hook is ready in the MAIN world
    try { emit('LH_DL_READY', { ready: true }); } catch (_) { }
  } catch (e) { }
})();


