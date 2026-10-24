// Checks the built site and its sources, without dependencies:
//  1. every internal link and anchor in dist/ leads to a page and id that exist;
//  2. the pages exist in both languages with the same paths;
//  3. the sources name no forbidden terms (see the list below).
// Run after `astro build`; exits non-zero with a list of findings.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const CONTENT = 'src/content/docs';

// SentryAssets is source-available and never described with these terms. Further terms
// that must not appear (names of tools, internal paths) are read from the local file
// .forbidden-terms, one regular expression per line, which is kept out of the repository.
const FORBIDDEN = [/open[\s-]?source/i, /open[\s-]?core/i];
if (existsSync('.forbidden-terms')) {
	for (const line of readFileSync('.forbidden-terms', 'utf8').split('\n')) {
		const term = line.trim();
		if (term && !term.startsWith('#')) FORBIDDEN.push(new RegExp(term, 'i'));
	}
}

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

const findings = [];
const pages = new Map();
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
	pages.set(file, readFileSync(file, 'utf8'));
}

function target(pathname) {
	const clean = decodeURIComponent(pathname);
	const candidates = [join(DIST, clean), join(DIST, clean, 'index.html'), join(DIST, `${clean}.html`)];
	return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

for (const [file, html] of pages) {
	for (const match of html.matchAll(/\shref="(\/[^"]*)"/g)) {
		const href = match[1];
		if (href.startsWith('//') || href.startsWith('/_astro/') || href.startsWith('/pagefind/')) continue;
		const [pathname, anchor] = href.split('#');
		const found = target(pathname);
		if (!found) {
			findings.push(`${relative(DIST, file)}: link to missing page ${href}`);
			continue;
		}
		// Hrefs carry ids percent-encoded (umlauts in German headings); the ids in the HTML do not.
		if (anchor && found.endsWith('.html') && !ids(pages.get(found) ?? readFileSync(found, 'utf8')).has(decodeURIComponent(anchor))) {
			findings.push(`${relative(DIST, file)}: link to missing anchor ${href}`);
		}
	}
}

const sources = walk(CONTENT).filter((f) => /\.mdx?$/.test(f));
const german = sources.filter((f) => !relative(CONTENT, f).startsWith('en/')).map((f) => relative(CONTENT, f));
const english = new Set(sources.filter((f) => relative(CONTENT, f).startsWith('en/')).map((f) => relative(join(CONTENT, 'en'), f)));
for (const page of german) {
	if (!english.has(page)) findings.push(`${page}: no English page`);
}
for (const page of english) {
	if (!german.includes(page)) findings.push(`en/${page}: no German page`);
}

for (const file of [...sources, 'astro.config.mjs', ...walk('src/components'), ...walk('src/seo')]) {
	const text = readFileSync(file, 'utf8');
	for (const term of FORBIDDEN) {
		if (term.test(text)) findings.push(`${file}: forbidden term ${term}`);
	}
}

if (findings.length > 0) {
	console.error(findings.join('\n'));
	console.error(`\n${findings.length} finding(s)`);
	process.exit(1);
}
console.log(`Content check passed: ${pages.size} pages, ${sources.length} sources.`);
