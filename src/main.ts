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
        { name: 'Crimson Red', value: '#E63946' }, { name: 'Vibrant Orange', value: '#F4A261' },
        { name: 'Warm Amber', value: '#E9C46A' }, { name: 'Bright Yellow', value: '#FFEB3B' },
        { name: 'Neon Lime', value: '#70E000' }, { name: 'Forest Green', value: '#2A9D8F' },
        { name: 'Sage Leaf', value: '#81C784' }, { name: 'Teal Shadow', value: '#008080' },
        { name: 'Electric Blue', value: '#00B4D8' }, { name: 'Deep Cobalt', value: '#1D3557' },
        { name: 'Royal Amethyst', value: '#7B1FA2' }, { name: 'Vibrant Orchid', value: '#BA68C8' },
        { name: 'Neon Pink', value: '#FF007F' }, { name: 'Chalk White', value: '#FFFFFF' },
        { name: 'Slate Gray', value: '#7F8C8D' }, { name: 'Charcoal Black', value: '#2C3E50' }
    ]
};

export default class CustomFileColors extends Plugin {
    settings!: PluginSettings;
    styleEl!: HTMLStyleElement;

    async onload() {
        await this.loadSettings();

        // Sheet placeholder dedicated to rendering targeted user path color tags
        this.styleEl = document.createElement('style');
        this.styleEl.id = 'custom-file-colors-style-block';
        document.head.appendChild(this.styleEl);

        this.app.workspace.onLayoutReady(() => {
            this.updateStyles();
        });

        this.addSettingTab(new ColorSettingTab(this.app, this));

        // Intercept right-clicks on files/folders to inject our floating UI component
        this.registerEvent(
            this.app.workspace.on('file-menu', (menu: Menu, file) => {
                menu.addItem((item) => {
                    item.setTitle('Set Custom Color')
                        .setIcon('palette')
                        .onClick((evt) => {
                            const mouseEvt = evt as MouseEvent;
                            this.spawnFloatingPalette(file, mouseEvt.clientX, mouseEvt.clientY);
                        });
                });
            })
        );
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    spawnFloatingPalette(file: any, clickX: number, clickY: number) {
        // Nuke existing open modal structures before populating a new workspace overlay
        const existingModal = document.querySelector('.colourful-files-palette-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'colourful-files-palette-modal';
        modal.style.left = `${clickX}px`;
        modal.style.top = `${clickY}px`;

        const handle = document.createElement('div');
        handle.className = 'palette-drag-handle';
        handle.innerHTML = `<span>Palette</span><span class="palette-close-btn">✕</span>`;
        modal.appendChild(handle);

        handle.querySelector('.palette-close-btn')?.addEventListener('click', () => modal.remove());

        const grid = document.createElement('div');
        grid.className = 'palette-matrix-grid';

        this.settings.palette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'palette-swatch-item';
            swatch.title = color.name;
            swatch.style.backgroundColor = color.value;

            if (this.settings.fileColors[file.path] === color.value) {
                swatch.classList.add('is-selected');
            }

            swatch.addEventListener('click', async () => {
                modal.querySelectorAll('.palette-swatch-item').forEach(s => s.classList.remove('is-selected'));
                swatch.classList.add('is-selected');

                this.settings.fileColors[file.path] = color.value;
                if (input) input.value = color.value; // Mirror to input box
                await this.saveData(this.settings);
                this.updateStyles();
            });

            grid.appendChild(swatch);
        });
        modal.appendChild(grid);

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'palette-custom-hex-input';
        input.placeholder = '#RRGGBB (Custom Hex)';
        input.value = this.settings.fileColors[file.path] || '';
        
        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const hexVal = input.value.trim();
                if (hexVal) {
                    this.settings.fileColors[file.path] = hexVal;
                } else {
                    delete this.settings.fileColors[file.path];
                }
                await this.saveData(this.settings);
                this.updateStyles();
                modal.remove();
            }
        });
        modal.appendChild(input);

        document.body.appendChild(modal);
        this.initializeDragEngine(modal, handle);
    }

    initializeDragEngine(modal: HTMLElement, handle: HTMLElement) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        handle.onmousedown = (e) => {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            
            document.onmousemove = (moveEvt) => {
                moveEvt.preventDefault();
                posX = mouseX - moveEvt.clientX;
                posY = mouseY - moveEvt.clientY;
                mouseX = moveEvt.clientX;
                mouseY = moveEvt.clientY;
                modal.style.top = `${modal.offsetTop - posY}px`;
                modal.style.left = `${modal.offsetLeft - posX}px`;
            };
        };
    }

    updateStyles() {
        let css = '';
        const useBg = this.settings.colorBackground;
        const useCascade = this.settings.cascadeColors;

        for (const [path, color] of Object.entries(this.settings.fileColors)) {
            const escapedPath = path.replace(/"/g, '\\"');
            const isHex = color.startsWith('#') && color.length === 7;

            if (useBg) {
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
        document.querySelector('.colourful-files-palette-modal')?.remove();
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
