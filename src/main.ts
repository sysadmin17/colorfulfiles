import { Plugin, Menu, PluginSettingTab, Setting } from 'obsidian';

interface ColorItem {
    name: string;
    value: string; // Harmonized back to standard value key
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
        // --- ROW 1-2: Pinks, Reds & Deep Amethysts/Purples ---
        { name: 'Soft Coral', value: '#FF8B94' }, { name: 'Blush Pink', value: '#FFAAA6' },
        { name: 'Peach Cream', value: '#FFD3B6' }, { name: 'Muted Gold', value: '#D1A153' },
        { name: 'Crimson Red', value: '#DC3545' }, { name: 'Deep Rose', value: '#C2185B' },
        { name: 'Lavender Mist', value: '#E1BEE7' }, { name: 'Thistle Purple', value: '#D8BFD8' },
        { name: 'Vibrant Orchid', value: '#BA68C8' }, { name: 'Deep Purple', value: '#9C27B0' },
        { name: 'Royal Amethyst', value: '#7B1FA2' }, { name: 'Plum Wine', value: '#4A148C' },
        { name: 'Midnight Indigo', value: '#3F51B5' }, { name: 'Electric Violet', value: '#651FFF' },
        { name: 'Neon Pink', value: '#FF007F' }, { name: 'Magenta Glow', value: '#FF00FF' },

        // --- ROW 3-4: Cool Ocean Blues & Deep Aquatic Cyans ---
        { name: 'Sky Blue', value: '#87CEEB' }, { name: 'Soft Cyan', value: '#E0F7FA' },
        { name: 'Turquoise', value: '#40E0D0' }, { name: 'Robin Egg', value: '#00CCD6' },
        { name: 'Ocean Wave', value: '#007ACC' }, { name: 'Deep Cobalt', value: '#1A237E' },
        { name: 'Hot Cyan', value: '#00E5FF' }, { name: 'Teal Shadow', value: '#00695C' },
        { name: 'Glacier Blue', value: '#B0E0E6' }, { name: 'Ice Blue', value: '#AFEEEE' },
        { name: 'Steel Blue', value: '#4682B4' }, { name: 'Cerulean', value: '#007BA7' },
        { name: 'Midnight Blue', value: '#191970' }, { name: 'Navy Depth', value: '#000080' },
        { name: 'Electric Blue', value: '#00FFFF' }, { name: 'Nordic Frost', value: '#D8DEE9' },

        // --- ROW 5-6: Fresh Matrix Greens & Radiant Sunbursts ---
        { name: 'Mint Green', value: '#A8E6CF' }, { name: 'Pale Lime', value: '#DCEDC8' },
        { name: 'Sage Leaf', value: '#81C784' }, { name: 'Emerald', value: '#2ECC71' },
        { name: 'Forest Green', value: '#27AE60' }, { name: 'Neon Lime', value: '#00E676' },
        { name: 'Olive Drab', value: '#6B8E23' }, { name: 'Dark Moss', value: '#1B5E20' },
        { name: 'Lemon Chiffon', value: '#FFFACD' }, { name: 'Bright Yellow', value: '#FFEB3B' },
        { name: 'Banana Soft', value: '#FFF9C4' }, { name: 'Warm Amber', value: '#FFC107' },
        { name: 'Safety Orange', value: '#FF9800' }, { name: 'Burnt Ochre', value: '#E65100' },
        { name: 'Sunset Glow', value: '#FF5722' }, { name: 'Volcanic Ash', value: '#BF360C' },

        // --- ROW 7-8: High-Contrast Earth Tones, Slates & Grays ---
        { name: 'Chalk White', value: '#FFFFFF' }, { name: 'Alabaster', value: '#FAFAFA' },
        { name: 'Platinum', value: '#E5E5E5' }, { name: 'Silver Streak', value: '#BDC3C7' },
        { name: 'Cool Gray', value: '#95A5A6' }, { name: 'Slate Gray', value: '#7F8C8D' },
        { name: 'Asphalt Gray', value: '#34495E' }, { name: 'Charcoal Black', value: '#2C3E50' },
        { name: 'Jet Black', value: '#000000' }, { name: 'Dark Velvet', value: '#111111' },
        { name: 'Warm Taupe', value: '#8D6E63' }, { name: 'Chestnut Brown', value: '#5D4037' },
        { name: 'Espresso', value: '#3E2723' }, { name: 'Sandstone', value: '#D2B48C' },
        { name: 'Khaki Stone', value: '#F0E68C' }, { name: 'Sepia Vintage', value: '#704214' }
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

            // Re-architect the context menu row into a clean, compact 8x8 grid dashboard
            domEl.style.display = 'grid';
            domEl.style.gridTemplateColumns = 'repeat(8, 1fr)'; // 8 items across, wrapping automatically into 8 rows!
            domEl.style.gap = '5px';                            // Snug spacing for micro-swatches
            domEl.style.padding = '12px';
            domEl.style.justifyItems = 'center';                // Centers the mini circles cleanly in their grid cells

            // Stop hover row actions inside our menu panel from drawing default backgrounds
            domEl.addEventListener('mouseenter', (e) => e.stopPropagation());
            domEl.addEventListener('mousemove', (e) => e.stopPropagation());

            // Build out the circles dynamically
		this.settings.palette.forEach(color => {
		    const swatch = document.createElement('div');
		    swatch.title = color.name; 
		    
		    // 1. Set our new crisp 18px base footprint
		    swatch.style.width = '18px';
		    swatch.style.height = '18px';
		    swatch.style.borderRadius = '50%';
		    swatch.style.backgroundColor = color.value;
		    swatch.style.cursor = 'pointer';
		    
		    // Smooth timing for both the size change and the shadow pop
		    swatch.style.transition = 'transform 0.12s ease-out, box-shadow 0.12s ease-out';
		    swatch.style.border = '1px solid rgba(255,255,255,0.15)';

		    // 2. Enhanced Hover State: Clean spatial pop out
		    swatch.addEventListener('mouseenter', () => {
			swatch.style.transform = 'scale(1.25)'; // Smoothly expands to ~22.5px
			swatch.style.zIndex = '10';             // Ensures it hovers layered cleanly above its neighbors
			swatch.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.7), 0 2px 4px rgba(0, 0, 0, 0.3)';
		    });
		    
		    swatch.addEventListener('mouseleave', () => {
			swatch.style.transform = 'scale(1)';
			swatch.style.zIndex = '1';
			swatch.style.boxShadow = 'none';
		    });

		    // Core Selection Click Action
		    swatch.addEventListener('click', async (e) => {
			e.stopPropagation(); 
			this.settings.fileColors[file.path] = color.value;
			await this.saveData(this.settings);
			this.updateStyles();
			menu.hide(); 
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
	containerEl.createEl('h2', { text: 'Colourful Files Settings' });

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
