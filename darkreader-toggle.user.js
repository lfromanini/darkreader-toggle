// ==UserScript==
// @name        Dark Reader Toggle
// @namespace   lfromanini.darkreader.toggle
// @version     2026.03.30
// @description Toggle dark mode via menu command + hotkey (Ctrl/Cmd + Shift + L)
// @author      Luiz Fernando Romanini
// @match       *://*/*
// @exclude     devtools://*
// @require     https://unpkg.com/darkreader@4.9.120/darkreader.js
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @noframes
// @updateURL   https://raw.githubusercontent.com/lfromanini/darkreader-toggle/main/darkreader-toggle.user.js
// @downloadURL https://raw.githubusercontent.com/lfromanini/darkreader-toggle/main/darkreader-toggle.user.js
// ==/UserScript==
(function () {
	'use strict';
	if (!document.doctype) return;

	const hasGM = typeof GM !== 'undefined' && typeof GM.getValue === 'function' && typeof GM.setValue === 'function';

	let state = false;
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

		apply(state);
		registerMenu();
	}

	// ── Menu Command ───────────────────────────────────────────────────────────
	function registerMenu() {
		if (!GM?.registerMenuCommand) return;
		GM.registerMenuCommand('Toggle Dark Mode', toggle);
	}

	// ── Toast Notification ─────────────────────────────────────────────────────
	function showToast(on) {
		const toast = document.createElement('div');

		Object.assign(toast.style, {
			position: 'fixed',
			bottom: '20px',
			left: '50%',
			transform: 'translateX(-50%)',
			background: 'rgba(0,0,0,0.85)',
			color: '#fff',
			padding: '10px 16px',
			borderRadius: '8px',
			fontSize: '14px',
			zIndex: 100000,
			opacity: '0',
			transition: 'opacity 0.2s ease, transform 0.2s ease'
		});

		toast.textContent = on
			? '🔌 Dark mode enabled'
			: '💡 Light mode enabled';

		document.body.appendChild(toast);

		// animate in
		requestAnimationFrame(() => {
			toast.style.opacity = '1';
			toast.style.transform = 'translateX(-50%) translateY(-6px)';
		});

		// animate out + remove
		setTimeout(() => {
			toast.style.opacity = '0';
			toast.style.transform = 'translateX(-50%) translateY(0)';
			setTimeout(() => toast.remove(), 300);  // 300ms fade-out
		}, 4000);                                   // 4 seconds display
	}

	// ── Dark Reader ────────────────────────────────────────────────────────────
	function apply(on) {
		if (on) {
			DarkReader.enable({
				brightness: 100,
				contrast: 90,
				sepia: 10
			});
		} else {
			DarkReader.disable();
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
		showToast(state);

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
