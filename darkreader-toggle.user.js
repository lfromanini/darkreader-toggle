// ==UserScript==
// @name        Dark Reader Toggle
// @namespace   lfromanini.darkreader.toggle
// @version     26.03.18      // Increment this on every update
// @description Toggle dark mode with lightbulb button + hotkey (Ctrl/Cmd + Shift + D)
// @author      Luiz Fernando Romanini
// @match       *://*/*
// @exclude     devtools://*
// @require     https://unpkg.com/darkreader@4.9.96/darkreader.js
// @grant       GM.getValue
// @grant       GM.setValue
// @noframes
// @updateURL   https://raw.githubusercontent.com/lfromanini/darkreader-toggle/main/darkreader-toggle.user.js
// @downloadURL https://raw.githubusercontent.com/lfromanini/darkreader-toggle/main/darkreader-toggle.user.js
// ==/UserScript==
(function () {
    'use strict';
    if (!document.doctype) return;

    const hasGM = typeof GM !== 'undefined' && typeof GM.getValue === 'function' && typeof GM.setValue === 'function';

    let state = false;
    let btn;
    let busy = false;

    DarkReader.setFetchMethod(window.fetch);
    init();

    async function init() {
        if (hasGM) {
            try {
                state = await GM.getValue('dimmer', false);
            } catch (err) {
                console.warn('[DarkReader Toggle] Failed to read saved state:', err);
            }
        }
        createButton();
        apply(state);
    }

    function createButton() {
        btn = document.createElement('button');
        Object.assign(btn.style, {
            all: 'unset',
            position: 'fixed',
            bottom: '12px',
            right: '12px',
            width: '50px',
            height: '50px',
            fontSize: '22px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            opacity: '0.4',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'opacity 0.2s ease'
        });
        btn.title = 'Toggle dark mode (Ctrl/Cmd + Shift + D)';
        btn.tabIndex = 0;
        btn.addEventListener('mouseenter', () => btn.style.opacity = '0.9');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '0.4');
        btn.addEventListener('click', toggle);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') toggle();
        });
        (document.body || document.documentElement).appendChild(btn);
    }

    function apply(on) {
        if (!btn) return;
        if (on) {
            DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
            btn.textContent = '🔌'; // dark mode active
        } else {
            DarkReader.disable();
            btn.textContent = '💡'; // light mode active
        }
    }

    async function toggle() {
        if (busy) return;
        busy = true;
        state = !state;
        if (hasGM) {
            try {
                await GM.setValue('dimmer', state);
            } catch (err) {
                console.warn('[DarkReader Toggle] Failed to save state:', err);
            }
        }
        apply(state);
        busy = false;
    }

    document.addEventListener('keydown', (e) => {
        const tag = e.target?.tagName;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || e.target?.isContentEditable) return;

        const isMac = navigator.userAgentData?.platform
            ? navigator.userAgentData.platform === 'macOS'
            : /Mac/i.test(navigator.platform);

        const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
        if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'd') {
            e.preventDefault(); // prevent browser default for this combo
            toggle();
        }
    });
})();