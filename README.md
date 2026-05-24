# Obsidian Colorful Files 🎨

A lightweight, high-performance Obsidian community plugin designed to bring rich, customized visual organization to your file explorer sidebar. Move beyond plain text and curate a vault layout tailored for features, focus, and fluidity.

## 🚀 Key Features

* **Compact Swatch Grid UI:** A beautiful, space-saving 6x4 horizontal matrix of curated color swatches nested directly inside your context menu.
* **Hover Tooltips:** Hover your cursor over any color circle to immediately see its descriptive name.
* **Custom Hex & Keyword Input:** Don't want to use the palette? Input your own custom `#HEX` codes or standard CSS color names instantly.
* **Folder Cascading:** Let sub-files and nested directories inherit parent colors automatically with alpha-blended contrast shifts.

## 🚀 How to Use

1. Right-click any file or folder in your Obsidian sidebar.
2. Select **Set Custom Color** from the context menu.
3. Choose a color from the 24-piece designer grid, or click **Custom Hex Code...** to supply your own.
4. To remove a color style entirely, click **Clear Color** at the bottom of the selection list.

## 🛠️ Developer Installation & Local Compilation

If you want to clone this project repository to modify the source code or expand the color palette yourself, make sure you have [Node.js](https://nodejs.org/) installed, and execute these commands:

```bash
# Clone and jump into the directory
cd .obsidian/plugins/
git clone [https://github.com/YOUR-USERNAME/colorfulfiles.git](https://github.com/YOUR-USERNAME/colorfulfiles.git)
cd colorfulfiles

# Execute the modern background compilation watch-engine
npx tsup src/main.ts --format cjs --minify --watch --external obsidian
