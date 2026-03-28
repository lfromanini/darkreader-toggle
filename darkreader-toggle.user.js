// ==UserScript==
// @name        Dark Reader Toggle
// @namespace   lfromanini.darkreader.toggle
// @version     2026.03.28
// @description Toggle dark mode with lightbulb button + hotkey (Ctrl/Cmd + Shift + L)
// @author      Luiz Fernando Romanini
// @match       *://*/*
// @exclude     devtools://*
// @require     https://unpkg.com/darkreader@4.9.120/darkreader.js
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

	const LONG_PRESS_MS = 600;
	const POSITIONS = ['bottom-right', 'bottom-left'];

	let state = false;
	let corner = 'bottom-right'; // default
	let btn;
	let busy = false;
	let longPressTimer = null;
	let didLongPress = false;

	DarkReader.setFetchMethod(window.fetch);
	init();

	async function init() {
		if (hasGM) {
			try {
				state = await GM.getValue('dimmer', false);
				corner = await GM.getValue('corner', 'bottom-right');
			} catch (err) {
				console.warn('[DarkReader Toggle] Failed to read saved state:', err);
			}
		}
		createButton();
		applyCorner();
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
			fontSize: '18px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 10000,
			opacity: '0.4',
			cursor: 'pointer',
			userSelect: 'none',
			touchAction: 'none', // prevents scroll interference on mobile during long press
			transition: 'opacity 0.2s ease, transform 0.2s ease'
		});
		btn.title = 'Click: toggle dark mode — Long press: switch side';
		btn.tabIndex = 0;

		btn.addEventListener('mouseenter', () => btn.style.opacity = '0.9');
		btn.addEventListener('mouseleave', () => btn.style.opacity = '0.4');

		// Pointer events work for both mouse and touch
		btn.addEventListener('pointerdown', onPointerDown);
		btn.addEventListener('pointerup', onPointerUp);
		btn.addEventListener('pointercancel', cancelLongPress);

		btn.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') toggle();
		});

		(document.body || document.documentElement).appendChild(btn);
	}

	// ── Long-press handling ────────────────────────────────────────────────────

	function onPointerDown(e) {
		didLongPress = false;
		longPressTimer = setTimeout(() => {
			didLongPress = true;
			switchCorner();
		}, LONG_PRESS_MS);
	}

	function onPointerUp(e) {
		cancelLongPress();
		if (!didLongPress) toggle(); // short press = toggle dark mode
	}

	function cancelLongPress() {
		clearTimeout(longPressTimer);
		longPressTimer = null;
	}

	// ── Corner switching ───────────────────────────────────────────────────────

	function applyCorner() {
		if (!btn) return;
		// Clear both sides first
		btn.style.right = '';
		btn.style.left = '';
		if (corner === 'bottom-right') {
			btn.style.right = '12px';
		} else {
			btn.style.left = '12px';
		}
	}

	async function switchCorner() {
		const nextIndex = (POSITIONS.indexOf(corner) + 1) % POSITIONS.length;
		corner = POSITIONS[nextIndex];
		applyCorner();

		// Brief visual pulse so the user knows the long press registered
		btn.style.transform = 'scale(1.3)';
		setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);

		if (hasGM) {
			try {
				await GM.setValue('corner', corner);
			} catch (err) {
				console.warn('[DarkReader Toggle] Failed to save corner:', err);
			}
		}
	}

	// ── Dark Reader ────────────────────────────────────────────────────────────

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

	// ── Keyboard shortcut ──────────────────────────────────────────────────────

	document.addEventListener('keydown', (e) => {
		const tag = e.target?.tagName;
		if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || e.target?.isContentEditable) return;

		const isMac = navigator.userAgentData?.platform
			? navigator.userAgentData.platform === 'macOS'
			: /Mac/i.test(navigator.platform);

		const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
		if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'l') {
			e.preventDefault();
			toggle();
		}
	});
})();
