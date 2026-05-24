# 🎨 Obsidian Colorful Files

Transform your workspace aesthetics. `colorfulfiles` allows you to break away from uniform file trees by injecting a premium, high-density visual color palette directly into Obsidian's native file navigator context menus. 

Color-code your folders, organize project hierarchies, or highlight priority notes using an elegant, production-grade interface.

---

## 🚀 Key Features

* **📦 High-Density 64-Color Palette Matrix:** An expansive, hand-curated library of 64 colors mapped into a symmetrical 8x8 dashboard grid—featuring soft pastels, rich ocean blues, vibrant greens, deep amethysts, eye-catching neons, and high-contrast earth/slate neutrals.
* **✨ Kinetic Hover Feedback Engine:** Swatches feature a highly responsive micro-interaction loop that applies an elastic `scale(1.25)` expansion, elevated layer positioning (`z-index`), and a dual-layer radial glow animation under your cursor.
* **🌊 Intelligent Color Cascading:** Color a parent folder and choose to let all nested sub-directories and individual files automatically inherit the parental tone with calculated, subtle transparency overlays.
* **⚡ Zero-Footprint Dynamic Injection:** Intercepts and overrides the native DOM using lightweight, safe type-casting configurations that run seamlessly inside Electron, ensuring zero performance drops even on massive multi-thousand file vaults.
* **🎨 Custom Hex Input Engine:** Need a specific brand color? Use the integrated text prompt dialog to pass manual hex codes or standard CSS keywords directly to the stylesheet repainter.

---

## 🛠️ Interface Mechanics

Instead of cluttering your context menu workspace with slow text-based list items, `colorfulfiles` subverts native constraints to bundle all 64 options into a compact, space-saving element:

| Layout System | Grid Footprint | Interactive State | Persistence |
| :--- | :--- | :--- | :--- |
| **CSS Grid (8x8)** | Compact 18px Circles | 3D Floating Pop on Hover | Asynchronous Local Data Storage |

---

## 💻 Technical Installation (For Developers)

To run a localized development build inside your vault:

1. Clone the repository into your vault's plugin folder: `.obsidian/plugins/colorfulfiles/`
2. Install dependencies and compile the TypeScript source code using your active toolchain:
```bash
npm install
npm run dev
```
3. Toggle the plugin active inside Obsidian's Community Plugins configuration dashboard screen.

