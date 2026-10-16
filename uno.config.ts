import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig, presetIcons } from 'unocss';
import { presetStarlightIcons } from 'starlight-plugin-icons/uno';

// An explicit safelist instead of the cache in .starlight-icons/: the icon classes only
// stand in astro.config.mjs, where UnoCSS does not look, and the cache does not exist yet
// on a fresh build. The sidebar icons are read straight from astro.config.mjs, so that a
// new page never ends up without its icon.
const sidebarIcons = (): string[] => {
	const config = readFileSync(fileURLToPath(new URL('./astro.config.mjs', import.meta.url)), 'utf8');
	// Only from string literals, so that comments and prose add nothing.
	return [...config.matchAll(/icon:\s*'(i-[\w-]+:[\w-]+)'/g)].map((match) => match[1]);
};

export default defineConfig({
	// The plugin's preset brings only its own icons; the collections of the sidebar and
	// the code blocks (@iconify-json/*) come from presetIcons.
	presets: [
		presetStarlightIcons(),
		presetIcons({
			autoInstall: false,
			collections: {
				ph: () => import('@iconify-json/ph/icons.json').then((icons) => icons.default),
				'material-icon-theme': () =>
					import('@iconify-json/material-icon-theme/icons.json').then((icons) => icons.default),
			},
		}),
	],
	safelist: [
		...new Set(sidebarIcons()),
		// Icons of code blocks (```… title="…") stand in the Markdown; kept by hand.
		'i-material-icon-theme:tune',
		'i-material-icon-theme:document',
		'i-material-icon-theme:settings',
		'i-material-icon-theme:console',
	],
});
