// Renders the social cards (og-de.png, og-en.png) and the PNG icons into public/.
//
// The images contain text in Roboto. librsvg finds fonts only through fontconfig, which
// reads no woff2: point FONTCONFIG_FILE at a configuration whose <dir> holds TTF copies
// of src/fonts/ (for example from `fonttools ttLib.woff2 decompress`), otherwise the text
// falls back to another font. The PNG files are committed; run this only after a change.
//
//   FONTCONFIG_FILE=/path/to/fonts.conf node scripts/make-images.mjs
import sharp from 'sharp';

const BRAND = '#2F66E6'; // brand-500
const PAGE = '#0B0D12'; // bg-page, dark
const TEXT = '#F3F5F9'; // text-primary, dark
const MUTED = '#8B93A3'; // text-muted, dark

const CARDS = {
	de: { title: 'Dokumentation', line: 'Asset-Management und BSI IT-Grundschutz, selbst betrieben' },
	en: { title: 'Documentation', line: 'Asset management and BSI IT-Grundschutz, self-hosted' },
};

function card({ title, line }) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<defs>
		<radialGradient id="glow" cx="0.8" cy="0.1" r="0.9">
			<stop offset="0" stop-color="${BRAND}" stop-opacity="0.35"/>
			<stop offset="0.65" stop-color="${BRAND}" stop-opacity="0"/>
		</radialGradient>
	</defs>
	<rect width="1200" height="630" fill="${PAGE}"/>
	<rect width="1200" height="630" fill="url(#glow)"/>
	<!-- librsvg starts each tspan anew without the tracking; dx closes the gaps. -->
	<text x="96" y="300" font-family="Roboto" font-weight="700" font-size="112" fill="${TEXT}"><tspan letter-spacing="-4.5" fill="${BRAND}">sentry</tspan><tspan dx="-8" letter-spacing="-4.5">assets</tspan><tspan dx="-11" fill="${BRAND}">.</tspan></text>
	<text x="100" y="352" font-family="Roboto Mono" font-size="22" letter-spacing="7" fill="${MUTED}">ASSET MANAGEMENT</text>
	<text x="96" y="460" font-family="Roboto" font-weight="700" font-size="52" letter-spacing="-1" fill="${TEXT}">${title}</text>
	<text x="96" y="512" font-family="Roboto" font-size="30" fill="${MUTED}">${line}</text>
	<text x="96" y="580" font-family="Roboto Mono" font-size="24" fill="${BRAND}">docs.sentry-assets.de</text>
</svg>`;
}

function tile(size) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
	<rect width="48" height="48" rx="10" fill="${PAGE}"/>
	<text x="8" y="33" font-family="Roboto" font-size="24" font-weight="700" letter-spacing="-1" fill="#FFFFFF"><tspan fill="${BRAND}">s</tspan>a<tspan fill="${BRAND}">.</tspan></text>
</svg>`;
}

const render = (svg, file) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);

for (const [lang, text] of Object.entries(CARDS)) {
	await render(card(text), `public/og-${lang}.png`);
}
for (const size of [180, 512]) {
	await render(tile(size), `public/favicon-${size}.png`);
}
