# 🌙 Dark Reader Toggle

[![Install](https://img.shields.io/badge/Install-Userscript-blue)](https://raw.githubusercontent.com/lfromanini/darkreader-toggle/main/darkreader-toggle.user.js)

A lightweight userscript that adds a floating 💡 button to every webpage so you can toggle [Dark Reader](https://darkreader.org/) on and off without touching the extension popup — plus a keyboard shortcut.

---

## Features

- 💡 / 🔌 floating button, fixed to the bottom corner of the screen
- Long press to switch the button between bottom-right and bottom-left
- Keyboard shortcut: **Ctrl+Shift+D** (Windows/Linux) or **Cmd+Shift+D** (macOS)
- Persistent state — remembers your dark mode preference and button position across page loads
- Hotkey is suppressed inside text fields so it never interferes with typing
- Works on desktop and mobile
- No UI framework, no dependencies beyond Dark Reader itself

## Requirements

- [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/)
- A browser that supports userscripts (Chrome, Firefox, Edge)

## Installation

1. Make sure Violentmonkey or Tampermonkey is installed
2. Click **[Install script](https://raw.githubusercontent.com/lfromanini/darkreader-toggle/main/darkreader-toggle.user.js)**
3. Confirm the installation prompt

## Usage

| Action | Result |
|---|---|
| Click / tap the button | Toggle dark mode |
| Long press the button (600ms) | Switch between bottom-right and bottom-left |
| Ctrl/Cmd + Shift + D | Toggle dark mode via keyboard |

The button is intentionally semi-transparent (40% opacity) to stay out of the way, and brightens on hover. A brief scale animation confirms a successful long press.

## Configuration

Dark Reader is enabled with these default settings:

| Setting | Value |
|---|---|
| Brightness | 100 |
| Contrast | 90 |
| Sepia | 10 |

To change them, edit the `DarkReader.enable(...)` call in the script.

## Compatibility

Tested on Violentmonkey. Should work on Tampermonkey. Does not run inside iframes (`@noframes`) or DevTools pages.

## License

The [MIT license](https://github.com/lfromanini/darkreader-toggle/blob/main/LICENSE) (MIT)
