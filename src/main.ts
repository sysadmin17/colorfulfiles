import { Plugin, Menu, PluginSettingTab, Setting } from 'obsidian';

interface ColorItem {
    name: string;
    value: string;
}

interface PluginSettings {
    fileColors: Record<string, string>;
    colorBackground: boolean;
    cascadeColors: boolean;
    palette: ColorItem[];
}

const DEFAULT_SETTINGS: PluginSettings = {
    fileColors: {},
    colorBackground: false,
    cascadeColors: true,
    palette: [
        // --- WARM / PASTELS ---
        { name: 'Salmon Red', value: '#ff6b6b' },
        { name: 'Coral Pink', value: '#ff8787' },
        { name: 'Blush Pink', value: '#fcc2d7' },
        { name: 'Plum Purple', value: '#e599f7' },
        { name: 'Deep Violet', value: '#cc5de8' },
        { name: 'Lavender', value: '#b197fc' },
        
        // --- COOL / BLUES & GREENS ---
        { name: 'Ocean Blue', value: '#339af0' },
        { name: 'Sky Blue', value: '#74c0fc' },
        { name: 'Cyan / Teal', value: '#66d9e8' },
        { name: 'Mint Green', value: '#63e6be' },
        { name: 'Emerald Green', value: '#51cf66' },
        { name: 'Sage Green', value: '#a9e34b' },

        // --- BRIGHT / SUNNY ---
        { name: 'Sunflower Yellow', value: '#fcc419' },
        { name: 'Pastel Yellow', value: '#ffe066' },
        { name: 'Amber Orange', value: '#ff922b' },
        { name: 'Peach Orange', value: '#ffa94d' },
        { name: 'Terracotta', value: '#e8590c' },
        { name: 'Crimson', value: '#c92a2a' },

        // --- EARTHY / NEUTRALS ---
        { name: 'Sand Beige', value: '#f1f3f5' },
        { name: 'Warm Gray', value: '#adb5bd' },
        { name: 'Slate Gray', value: '#495057' },
        { name: 'Taupe Brown', value: '#d0bfff' },
        { name: 'Olive Green', value: '#94d82d' },
        { name: 'Coffee Brown', value: '#868e96' }
    ]
};

export default class CustomFileColors extends Plugin {
    settings!: PluginSettings;
    styleEl!: HTMLStyleElement;

    async onload() {
        await this.loadSettings();

        // Dynamically inject our workspace stylesheet block
        this.styleEl = document.createElement('style');
        this.styleEl.id = 'custom-file-colors-style-block';
        document.head.appendChild(this.styleEl);

        this.app.workspace.onLayoutReady(() => {
            this.updateStyles();
        });

        this.addSettingTab(new ColorSettingTab(this.app, this));

        // Safely intercept right-clicks on files/folders
        this.registerEvent(
            this.app.workspace.on('file-menu', (menu: Menu, file) => {
                menu.addItem((item) => {
                    item.setTitle('Set Custom Color')
                        .setIcon('palette')
                        .onClick(() => this.showColorMenu(file));
                });
            })
        );
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    showColorMenu(file: any) {
        const menu = new Menu();

        // 1. Create a specialized single menu item that will host our Horizontal Grid Layout
        menu.addItem((item) => {
            const domEl = (item as any).dom as HTMLElement;
            if (!domEl) return;

            // Clear native text configurations and style it into a clean Grid container
            domEl.innerHTML = '';
            domEl.style.display = 'grid';
            domEl.style.gridTemplateColumns = 'repeat(6, 1fr)'; // 6 swatches per row
            domEl.style.gap = '8px';
            domEl.style.padding = '12px';
            domEl.style.cursor = 'default';
            domEl.style.backgroundColor = 'transparent';

            // Stop hover row actions inside our menu panel from drawing default backgrounds
            domEl.addEventListener('mouseenter', (e) => e.stopPropagation());
            domEl.addEventListener('mousemove', (e) => e.stopPropagation());

            // Build out the circles dynamically
            this.settings.palette.forEach(color => {
                const swatch = document.createElement('div');
                swatch.title = color.name; // Displays the beautiful name tooltip upon hover!
                
                // Style into a sleek circle button
                swatch.style.width = '22px';
                swatch.style.height = '22px';
                swatch.style.borderRadius = '50%';
                swatch.style.backgroundColor = color.value;
                swatch.style.cursor = 'pointer';
                swatch.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
                swatch.style.border = '1px solid rgba(255,255,255,0.15)';

                // Visual interactive state triggers
                swatch.addEventListener('mouseenter', () => {
                    swatch.style.transform = 'scale(1.15)';
                    swatch.style.boxShadow = '0 0 8px rgba(255,255,255,0.4)';
                });
                swatch.addEventListener('mouseleave', () => {
                    swatch.style.transform = 'scale(1)';
                    swatch.style.boxShadow = 'none';
                });

                // Core Selection Click Action
                swatch.addEventListener('click', async (e) => {
                    e.stopPropagation(); // Stop menu bubble leaks
                    this.settings.fileColors[file.path] = color.value;
                    await this.saveData(this.settings);
                    this.updateStyles();
                    menu.hide(); // Safely dismiss context menu panels after click completes
                });

                domEl.appendChild(swatch);
            });
        });

        menu.addSeparator();

        // 2. Custom Hex Code text engine input prompt
        menu.addItem((item) => {
            item.setTitle('Custom Hex Code...')
                .setIcon('pencil')
                .onClick(() => {
                    const customHex = prompt("Enter a custom color Hex Code (e.g., #FF5733 or purple):");
                    if (customHex) {
                        this.settings.fileColors[file.path] = customHex;
                        this.saveData(this.settings);
                        this.updateStyles();
                    }
                });
        });

        // 3. Clear existing color tracking
        menu.addItem((item) => {
            item.setTitle('Clear Color')
                .setIcon('trash')
                .onClick(async () => {
                    delete this.settings.fileColors[file.path];
                    await this.saveData(this.settings);
                    this.updateStyles();
                });
        });

        // Safe rendering bounds calculation for context window placements
        const activeWin = window.activeWindow ?? window;
        const selection = activeWin.getSelection();
        if (selection && selection.rangeCount > 0) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            menu.showAtPosition(this.app.workspace.touch ? null : rect);
        } else {
            menu.showAtPosition(null);
        }
    }

    updateStyles() {
        let css = '';
        const useBg = this.settings.colorBackground;
        const useCascade = this.settings.cascadeColors;

        for (const [path, color] of Object.entries(this.settings.fileColors)) {
            const escapedPath = path.replace(/"/g, '\\"');
            const isHex = color.startsWith('#') && color.length === 7;

            if (useBg) {
                // Apply background adjustments (using alpha masks for standard hex targets)
                const bgAlpha = isHex ? `${color}33` : color;
                const cascadeAlpha = isHex ? `${color}15` : color;

                css += `
                    [data-path="${escapedPath}"] .nav-file-title,
                    [data-path="${escapedPath}"] .nav-folder-title {
                        background-color: ${bgAlpha} !important;
                        border-radius: 4px;
                    }
                `;
                if (useCascade) {
                    css += `
                        [data-path^="${escapedPath}/"] .nav-file-title,
                        [data-path^="${escapedPath}/"] .nav-folder-title {
                            background-color: ${cascadeAlpha} !important;
                            border-radius: 4px;
                        }
                    `;
                }
            } else {
                // Apply clean text styling directly onto elements
                css += `
                    [data-path="${escapedPath}"] .nav-file-title-content,
                    [data-path="${escapedPath}"] .nav-folder-title-content {
                        color: ${color} !important;
                    }
                `;
                if (useCascade) {
                    const textAlpha = isHex ? `${color}cc` : color;
                    css += `
                        [data-path^="${escapedPath}/"] .nav-file-title-content,
                        [data-path^="${escapedPath}/"] .nav-folder-title-content {
                            color: ${textAlpha} !important;
                        }
                    `;
                }
            }
        }
        this.styleEl.textContent = css;
    }

    onunload() {
        if (this.styleEl) this.styleEl.remove();
    }
}

class ColorSettingTab extends PluginSettingTab {
    plugin: CustomFileColors;

    constructor(app: any, plugin: CustomFileColors) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Custom File Colors Settings' });

        new Setting(containerEl)
            .setName('Color Entire Background')
            .setDesc('Toggle highlight styles from text color to row backgrounds.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.colorBackground)
                .onChange(async (value) => {
                    this.plugin.settings.colorBackground = value;
                    await this.plugin.saveData(this.plugin.settings);
                    this.plugin.updateStyles();
                }));

        new Setting(containerEl)
            .setName('Cascade Folder Colors')
            .setDesc('Allow sub-elements to inherit parent folder styles automatically.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.cascadeColors)
                .onChange(async (value) => {
                    this.plugin.settings.cascadeColors = value;
                    await this.plugin.saveData(this.plugin.settings);
                    this.plugin.updateStyles();
                }));
    }
}