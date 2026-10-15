/* Embedded in each candidate HTML: no new offline dependency. */
(function installStorageGuard(config) {
  'use strict';
  const state = { blocked: false, reason: '', pending: null };
  let storage;
  const observed = new Map();
  const journalKey = 'luna.integrity.' + config.app + '.pending.v1';
  const proto = window.Storage.prototype;
  const rawSet = proto.setItem, rawRemove = proto.removeItem, rawClear = proto.clear;
  function show() {
    if (!document.body || document.getElementById('lunaStorageRecovery')) return;
    const panel = document.createElement('section');
    panel.id = 'lunaStorageRecovery';
    panel.setAttribute('role', 'alertdialog');
    panel.setAttribute('aria-modal', 'true');
    panel.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#111827;color:white;padding:32px;overflow:auto;font:17px/1.5 system-ui';
    const title = document.createElement('h1'); title.textContent = 'Dados locais protegidos';
    const text = document.createElement('p');
    text.textContent = 'A aplicação foi pausada porque os dados locais não puderam ser lidos ou guardados com segurança. Não limpes o armazenamento nem reinstales. Exporta a cópia de recuperação antes de continuar.';
    const button = document.createElement('button'); button.textContent = 'Exportar cópia de recuperação';
    button.onclick = () => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(recovery(), null, 2)], {type: 'application/json'}));
      const link = document.createElement('a'); link.href = url; link.download = 'LUNA-' + config.app + '-recuperacao.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    };
    for (const child of document.body.children) child.inert = true;
    panel.append(title, text, button); document.body.appendChild(panel); button.focus();
  }
  function block(reason, pending) {
    state.blocked = true; state.reason = reason;
    if (pending) state.pending = pending;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show, {once: true}); else show();
  }
  function assertReady() { if (state.blocked) throw Error('LOCAL_DATA_PROTECTED'); }
  function validate(key, raw) {
    if (raw === null) return;
    const kind = config.keys[key], value = JSON.parse(raw);
    if (kind === 'array' && (!Array.isArray(value) || value.some(x => !x || typeof x !== 'object' || Array.isArray(x)))) throw Error('LOCAL_SCHEMA');
    if ((kind === 'object' || kind === 'training') && (!value || typeof value !== 'object' || Array.isArray(value))) throw Error('LOCAL_SCHEMA');
    if (kind === 'training') for (const k of ['exercises', 'sessions', 'weaponLog', 'favoriteWeapons']) {
      if (value[k] !== undefined && !Array.isArray(value[k])) throw Error('LOCAL_SCHEMA');
    }
  }
  function recovery() {
    const raw = {};
    if (storage) for (const key of [...Object.keys(config.keys), journalKey]) {
      try { raw[key] = storage.getItem(key); } catch { raw[key] = null; }
    }
    return {app: config.app, reason: state.reason, raw, pending: state.pending};
  }
  function unchanged(key) {
    if (observed.has(key) && storage.getItem(key) !== observed.get(key)) {
      block('LOCAL_CONCURRENT_CHANGE'); throw Error('LOCAL_CONCURRENT_CHANGE');
    }
  }
  function commit(entries) {
    assertReady();
    const before = {}, after = {};
    try {
      for (const [key, value] of Object.entries(entries)) {
        if (!Object.hasOwn(config.keys, key)) throw Error('LOCAL_UNKNOWN_KEY');
        unchanged(key); before[key] = storage.getItem(key);
        after[key] = JSON.stringify(value); validate(key, after[key]);
      }
      const pending = {version: 1, before, after};
      state.pending = pending;
      // No application key changes before the complete recovery record exists.
      rawSet.call(storage, journalKey, JSON.stringify(pending));
      for (const [key, value] of Object.entries(after)) rawSet.call(storage, key, value);
      for (const [key, value] of Object.entries(after)) if (storage.getItem(key) !== value) throw Error('LOCAL_WRITE_NOT_VERIFIED');
      rawRemove.call(storage, journalKey);
      for (const [key, value] of Object.entries(after)) observed.set(key, value);
      state.pending = null;
    } catch (error) {
      // Keep before/after and any durable journal. Never guess which version wins.
      block('LOCAL_SAVE_INCOMPLETE', state.pending || {before, after});
      throw error;
    }
  }
  window.LunaStorage = {state, journalKey, assertReady, commit, recovery};
  try {
    storage = window.localStorage;
    for (const key of Object.keys(config.keys)) { const raw = storage.getItem(key); observed.set(key, raw); validate(key, raw); }
    if (storage.getItem(journalKey) !== null) block('LOCAL_PENDING_RECOVERY');
  } catch { block('LOCAL_DATA_UNREADABLE'); }
  proto.setItem = function(key, value) {
    key = String(key); value = String(value);
    if (this === storage && (Object.hasOwn(config.keys, key) || key === journalKey)) {
      assertReady(); unchanged(key);
      try { if (key !== journalKey) validate(key, value); rawSet.call(this, key, value); observed.set(key, value); }
      catch (error) { block('LOCAL_SAVE_FAILED', {after: {[key]: value}}); throw error; }
      return;
    }
    return rawSet.call(this, key, value);
  };
  proto.removeItem = function(key) { if (this === storage && (Object.hasOwn(config.keys, String(key)) || key === journalKey)) { assertReady(); unchanged(String(key)); observed.set(String(key), null); } return rawRemove.call(this, key); };
  proto.clear = function() { if (this === storage) { assertReady(); block('LOCAL_CLEAR_BLOCKED'); throw Error('LOCAL_CLEAR_BLOCKED'); } return rawClear.call(this); };
  window.addEventListener('storage', event => {
    if (event.storageArea === storage && (event.key === null || event.key === journalKey || Object.hasOwn(config.keys, event.key))) block('LOCAL_CONCURRENT_CHANGE');
  });
})(LUNA_STORAGE_CONFIG);
