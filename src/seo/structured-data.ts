/**
 * Schema.org building blocks (JSON-LD) for the documentation.
 *
 * Kept lean: only types that search engines and answer systems use (Organization and
 * WebSite to recognise the entity, BreadcrumbList for the path in results, FAQPage for
 * the FAQ page).
 */

export const SITE_URL = 'https://docs.sentry-assets.de';

/** The product's own website, not the documentation. */
const PRODUCT_URL = 'https://sentry-assets.de';
const GITHUB_URL = 'https://github.com/securebits-cyber';

type Lang = 'de' | 'en';

const abs = (path: string) => new URL(path, SITE_URL).href;

/** `@id` anchors, so that the nodes mean the same entity on every page. */
const ORG_ID = `${PRODUCT_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
	return {
		'@type': 'Organization',
		'@id': ORG_ID,
		name: 'SecureBits Cyber Security UG (haftungsbeschränkt)',
		url: PRODUCT_URL,
		logo: abs('/favicon-512.png'),
		sameAs: [GITHUB_URL],
	};
}

export function websiteSchema(lang: Lang) {
	return {
		'@type': 'WebSite',
		'@id': SITE_ID,
		url: SITE_URL,
		name: lang === 'de' ? 'SentryAssets Dokumentation' : 'SentryAssets Documentation',
		inLanguage: lang,
		publisher: { '@id': ORG_ID },
	};
}

/**
 * The product itself: category, licence and how it is run, relevant for comparisons and
 * searches for self-hosted software.
 */
export function softwareApplicationSchema(lang: Lang) {
	const de = lang === 'de';
	return {
		'@type': 'SoftwareApplication',
		name: 'SentryAssets',
		url: PRODUCT_URL,
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: de
			? 'IT-Asset-Management und BSI IT-Grundschutz'
			: 'IT asset management and BSI IT-Grundschutz',
		operatingSystem: 'Linux (Docker, Podman)',
		license: 'https://www.elastic.co/licensing/elastic-license',
		softwareRequirements: 'Docker Engine or Podman with Compose',
		inLanguage: lang,
		description: de
			? 'Selbst betriebenes, quelloffenes Asset-Management für KMU mit automatischer Erfassung, Asset-Zustand und Unterstützung für den BSI IT-Grundschutz.'
			: 'Self-hosted, source-available asset management for SMEs with automatic discovery, asset health and support for the BSI IT-Grundschutz.',
		publisher: { '@id': ORG_ID },
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'EUR',
			description: de
				? 'Community-Edition ohne Lizenzschlüssel; Pro, Enterprise und das ISMS-Add-on mit Lizenzschlüssel.'
				: 'Community edition without a licence key; Pro, Enterprise and the ISMS add-on with a licence key.',
		},
	};
}

/** Home -> page. Sidebar groups have no URL of their own and are left out. */
export function breadcrumbSchema(opts: {
	homeUrl: string;
	homeName: string;
	pageUrl: string;
	pageName: string;
}) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: opts.homeName, item: opts.homeUrl },
			{ '@type': 'ListItem', position: 2, name: opts.pageName, item: opts.pageUrl },
		],
	};
}

/** Reduces Markdown and HTML to plain text for `acceptedAnswer.text`. */
function toPlainText(md: string): string {
	return md
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/(\*\*|__)(.*?)\1/g, '$2')
		.replace(/(^|\s)[*_]([^*_]+)[*_]/g, '$1$2')
		.replace(/^\s*[-*+]\s+/gm, '')
		.replace(/^\s*>\s?/gm, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Reads the questions and answers from the Markdown of the FAQ page: each is a
 * `<details>` block with the question in `<summary>`, so the markup grows with the page.
 */
export function faqSchemaFromMarkdown(body: string, pageUrl: string) {
	const blocks = body.matchAll(
		/<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g
	);

	const entities = [...blocks]
		.map((m) => ({ q: toPlainText(m[1]!), a: toPlainText(m[2]!) }))
		.filter(({ q, a }) => q.length > 0 && a.length > 0)
		.map(({ q, a }) => ({
			'@type': 'Question',
			name: q,
			acceptedAnswer: { '@type': 'Answer', text: a },
		}));

	if (entities.length === 0) return undefined;

	return {
		'@type': 'FAQPage',
		'@id': `${pageUrl}#faq`,
		url: pageUrl,
		mainEntity: entities,
	};
}

/** Puts several nodes into one `@graph`. */
export function jsonLdGraph(nodes: unknown[]) {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': nodes.filter(Boolean),
	});
}
