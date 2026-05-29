# 🎨 Colourful Files (v1.3.0)

A lightweight, high-performance visual organization plugin for Obsidian that allows you to cleanly color-code your files, notes, and folders directly from an ultra-compact floating palette. 

Keep your vault structured and navigate your project trees at a single glance.

---

## ✨ Features

* **Movable Palette Modal:** No longer locked down to static context menus. Drag the floating color palette anywhere across your workspace layout so it never blocks your writing view.
* **Compact 16-Color Matrix:** Curated, high-contrast palette of perfect circles designed to scale down your file tree interface footprint by 30%.
* **Satin Selection Gloss:** Soft 3D interactive highlight feedback on chosen colors, inspired by tactile gloss styling.
* **Custom Hex Code Injection:** Want an exact shade? Use the `#RRGGBB` field at the bottom of the card to input any custom color code instantly.
* **Smart Inherited Cascading:** Color a parent directory and let all sub-notes and lower folder branches automatically inherit the theme.
* **Background Highlighting Toggle:** Switch smoothly between changing just the sidebar file text color or highlighting the entire row background.

---

## 🛠️ Installation

### Community Plugin Store (Recommended)
1. Open **Settings** inside Obsidian.
2. Head to **Community plugins** -> **Browse**.
3. Search for `Colourful Files`.
4. Click **Install**, then **Enable**.

### Manual Installation
1. Go to the [Releases](https://github.com/sysadmin17/colorfulfiles/releases) tab.
2. Download `main.js`, `manifest.json`, and `styles.css` from the latest release.
3. Move the files into your vault directory: `<your-vault>/.obsidian/plugins/colorfulfiles/`.
4. Reload Obsidian and toggle the plugin on.

---

## 💡 How To Use

1. **Right-click** any file, note, or folder inside your native Obsidian file explorer sidebar.
2. Select **`Set Custom Color`** from the context menu to spawn the floating modal.
3. Left-click and hold the top title bar of the palette window to drag it around your screen.
4. Click any circular color swatch to apply it. Type a hex code and press `Enter` for precision styling overrides.
5. Clear colors easily by wiping the custom hex field or selecting another option.

---

## 🏗️ Local Development Pipeline

If you want to modify the source code or build components locally:

```bash
# 1. Clone the workspace fork
git clone [https://github.com/sysadmin17/colorfulfiles.git](https://github.com/sysadmin17/colorfulfiles.git)
cd colorfulfiles

# 2. Install developer dependencies
npm install

# 3. Compile the production bundle
npm run build
