# Obsidian Colorful Files 🎨

A lightweight, high-performance Obsidian community plugin designed to bring rich, customized visual organization to your file explorer sidebar. Move beyond plain text and curate a vault layout tailored perfectly to your workflows.

## ✨ Key Features

- **24 Curated Designer Colors:** Categorized into sleek palettes (Warm Pastels, Cool Blues/Greens, Sunny Brights, and Earthy Neutrals) to keep your workspace looking exceptionally clean.
- **Bespoke Hex Code Customization:** Don't want to use the palette? An integrated text utility allows you to type in *any* custom hex code (e.g., `#FF5733`) or standard HTML color names (like `purple`, `gold`, or `darkgreen`).
- **Dynamic Folder Cascading:** Toggle inheritance on or off. When active, all sub-folders and child notes automatically inherit their parent folder's color scheme.
- **Dual Display Engines:** Choose between a bold **Row Background Highlight** or a subtle **Text Color Overwrite** directly via the plugin's dedicated configuration tab.
- **Optimized Framework Architecture:** Compiled natively using TypeScript and bundled tracking nodes via `esbuild/tsup`, ensuring zero impact on your vault's startup time or index caching.

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
