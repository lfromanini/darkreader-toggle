# 🌙 Dark Reader Toggle

[![Install](https://img.shields.io/badge/Install-Userscript-blue)](https://raw.githubusercontent.com/lfromanini/darkreader-toggle/main/darkreader-toggle.user.js)

A lightweight userscript that lets you toggle [Dark Reader](https://darkreader.org/) on any webpage via a menu command or keyboard shortcut — no extension required.

---

## Features

- Toggle dark mode from your userscript manager's [menu command](https://violentmonkey.github.io/api/gm/#gm_registermenucommand)
- Keyboard shortcut: **Ctrl+Shift+L** (Windows/Linux) or **Cmd+Shift+L** (macOS)
- Persistent state — remembers your dark mode preference across page loads
- Non-intrusive: hotkey is suppressed inside text fields so it never interferes with typing
- No UI clutter, no floating buttons, just a subtle toast notification
- Works on desktop and mobile
- No UI framework, no dependencies beyond a userscript manager

## Requirements

- [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/)
- A browser that supports userscripts (Chrome, Firefox, Edge)

## Installation

1. Make sure Violentmonkey or Tampermonkey is installed
2. Click **[Install script](https://raw.githubusercontent.com/lfromanini/darkreader-toggle/main/darkreader-toggle.user.js)**
3. Confirm the installation prompt

## Usage

| Action                                             | Result                        |
|----------------------------------------------------|-------------------------------|
| Open userscript menu and select "Toggle Dark Mode" | Toggle dark mode              |
| Ctrl/Cmd + Shift + L                               | Toggle dark mode via keyboard |

A brief toast notification will confirm the current mode.

## Configuration

Dark Reader is enabled with these default settings:

| Setting    | Value |
|------------|-------|
| Brightness | 100   |
| Contrast   | 90    |
| Sepia      | 10    |

To change them, edit the `DarkReader.enable(...)` call in the script.

> Note: This version of the script does not include a floating button or position switching. If you want those features, let me know and I can help you add them!

## Compatibility

- Works on all websites (`@match *://*/*`)
- Does not run inside iframes (`@noframes`) or DevTools pages
- Tested on Violentmonkey but should work on Tampermonkey

## License

The [MIT license](https://github.com/lfromanini/darkreader-toggle/blob/main/LICENSE) (MIT)
