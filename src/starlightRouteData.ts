/**
 * Starlight route middleware: adds the SEO tags Starlight does not set itself, namely
 * the social card image, robots directives and JSON-LD. `routeMiddleware` is the
 * documented API for this and stays stable across updates.
 */
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import {
	SITE_URL,
	breadcrumbSchema,
	faqSchemaFromMarkdown,
	jsonLdGraph,
	organizationSchema,
	softwareApplicationSchema,
	websiteSchema,
} from './seo/structured-data';

type Lang = 'de' | 'en';

/** Social card per language, 1200 x 630, in `public/`. */
const OG_IMAGE: Record<Lang, string> = {
	de: '/og-de.png',
	en: '/og-en.png',
};

const OG_IMAGE_ALT: Record<Lang, string> = {
	de: 'SentryAssets Dokumentation – Asset-Management und IT-Grundschutz, selbst betrieben',
	en: 'SentryAssets documentation – asset management and IT-Grundschutz, self-hosted',
};

const HOME_NAME: Record<Lang, string> = {
	de: 'SentryAssets Dokumentation',
	en: 'SentryAssets Documentation',
};

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const { head, entry, id } = route;

	const lang: Lang = route.lang?.startsWith('en') ? 'en' : 'de';
	const isHome = id === '' || id === 'en' || id === 'index' || id === 'en/index';

	// The canonical URL Starlight computed, if any.
	const canonical =
		head.find((tag) => tag.tag === 'link' && tag.attrs?.rel === 'canonical')?.attrs?.href ??
		new URL(context.url.pathname, SITE_URL).href;
	const pageUrl = String(canonical);
	const homeUrl = new URL(lang === 'en' ? '/en/' : '/', SITE_URL).href;

	// --- Social Card -------------------------------------------------------
	// Starlight sets `twitter:card: summary_large_image` but no image; without og:image
	// the card would stay empty.
	const imageUrl = new URL(OG_IMAGE[lang], SITE_URL).href;
	head.push(
		{ tag: 'meta', attrs: { property: 'og:image', content: imageUrl } },
		{ tag: 'meta', attrs: { property: 'og:image:type', content: 'image/png' } },
		{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
		{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
		{ tag: 'meta', attrs: { property: 'og:image:alt', content: OG_IMAGE_ALT[lang] } },
		{ tag: 'meta', attrs: { name: 'twitter:image', content: imageUrl } },
		{ tag: 'meta', attrs: { name: 'twitter:image:alt', content: OG_IMAGE_ALT[lang] } }
	);

	// --- Crawler directives -------------------------------------------------
	// Large previews and snippets without the default shortening.
	head.push({
		tag: 'meta',
		attrs: {
			name: 'robots',
			content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
		},
	});

	// --- JSON-LD -----------------------------------------------------------
	const nodes: unknown[] = [organizationSchema(), websiteSchema(lang)];

	if (isHome) {
		nodes.push(softwareApplicationSchema(lang));
	} else {
		nodes.push(
			breadcrumbSchema({
				homeUrl,
				homeName: HOME_NAME[lang],
				pageUrl,
				pageName: entry.data.title,
			})
		);
	}

	if (id.endsWith('reference/faq') && typeof entry.body === 'string') {
		const faq = faqSchemaFromMarkdown(entry.body, pageUrl);
		if (faq) nodes.push(faq);
	}

	head.push({
		tag: 'script',
		attrs: { type: 'application/ld+json' },
		content: jsonLdGraph(nodes),
	});
});
