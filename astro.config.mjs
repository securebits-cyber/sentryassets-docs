// @ts-check
import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';
import UnoCSS from 'unocss/astro';
import Icons from 'starlight-plugin-icons';
import starlightScrollToTop from 'starlight-scroll-to-top';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.sentry-assets.de',
	output: 'static',
	// Renamed pages keep their old path here; the URLs may be linked from elsewhere.
	redirects: {},
	integrations: [
		// mermaid must come before Starlight, so that it handles ```mermaid blocks first.
		mermaid({ autoTheme: true }),
		UnoCSS(),
		// Icons() wraps the Starlight integration (starlight-plugin-icons).
		Icons({
			sidebar: true,
			codeblock: true,
			extractSafelist: true,
			starlight: {
				title: 'SentryAssets Docs',
				favicon: '/favicon.svg',
				head: [
					{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/favicon-180.png' } },
					{ tag: 'meta', attrs: { name: 'theme-color', content: '#2F66E6' } },
				],
				customCss: ['./src/styles/custom.css'],
				components: {
					SiteTitle: './src/components/SiteTitle.astro',
					Footer: './src/components/Footer.astro',
				},
				// Adds og:image, robots directives and JSON-LD (see the file).
				routeMiddleware: './src/starlightRouteData.ts',
				plugins: [starlightScrollToTop()],
				social: [
					{ icon: 'github', label: 'GitHub', href: 'https://github.com/securebits-cyber' },
					{ icon: 'external', label: 'sentry-assets.de', href: 'https://sentry-assets.de' },
				],
				lastUpdated: true,
				defaultLocale: 'root',
				locales: {
					root: { label: 'Deutsch', lang: 'de' },
					en: { label: 'English', lang: 'en' },
				},
				// An explicit sidebar instead of autogenerate: the plugin sets icons only on
				// named entries. The labels still come localised from each page's frontmatter.
				sidebar: [
					{
						label: 'Erste Schritte',
						translations: { en: 'Getting Started' },
						items: [
							{ icon: 'i-ph:rocket-launch-duotone', slug: 'guides/installation' },
							{ icon: 'i-ph:sliders-duotone', slug: 'guides/einrichtung' },
							{ icon: 'i-ph:desktop-tower-duotone', slug: 'guides/agents' },
							{ icon: 'i-ph:network-duotone', slug: 'guides/collector' },
							{ icon: 'i-ph:file-text-duotone', slug: 'guides/dokumentation' },
							{ icon: 'i-ph:shopping-cart-duotone', slug: 'guides/beschaffung' },
							{ icon: 'i-ph:hard-drives-duotone', slug: 'guides/racks' },
							{ icon: 'i-ph:shield-check-duotone', slug: 'guides/grundschutz' },
							{ icon: 'i-ph:archive-duotone', slug: 'guides/sicherung' },
							{ icon: 'i-ph:key-duotone', slug: 'guides/lizenz' },
						],
					},
					{
						label: 'Referenz',
						translations: { en: 'Reference' },
						items: [
							{ icon: 'i-ph:squares-four-duotone', slug: 'reference/funktionen' },
							{ icon: 'i-ph:stack-duotone', slug: 'reference/architektur' },
							{ icon: 'i-ph:users-three-duotone', slug: 'reference/rollen' },
							{ icon: 'i-ph:lock-key-duotone', slug: 'reference/sicherheit' },
							{ icon: 'i-ph:user-circle-check-duotone', slug: 'reference/datenschutz' },
							{ icon: 'i-ph:sparkle-duotone', slug: 'reference/ki-assistent' },
							{ icon: 'i-ph:gear-six-duotone', slug: 'reference/konfiguration' },
							{ icon: 'i-ph:plugs-connected-duotone', slug: 'reference/api' },
							{ icon: 'i-ph:question-duotone', slug: 'reference/faq' },
							{ icon: 'i-ph:wrench-duotone', slug: 'reference/fehlerbehebung' },
							{ icon: 'i-ph:map-trifold-duotone', slug: 'reference/roadmap' },
						],
					},
					{
						label: 'Wissen',
						translations: { en: 'Knowledge' },
						items: [
							{ icon: 'i-ph:lightbulb-duotone', slug: 'wissen/umsetzungshilfe' },
							{ icon: 'i-ph:fingerprint-duotone', slug: 'wissen/mfa' },
							{ icon: 'i-ph:lock-duotone', slug: 'wissen/verschluesselung' },
							{ icon: 'i-ph:arrows-clockwise-duotone', slug: 'wissen/updates' },
							{ icon: 'i-ph:bug-beetle-duotone', slug: 'wissen/schadprogramme' },
							{ icon: 'i-ph:database-duotone', slug: 'wissen/datensicherung' },
							{ icon: 'i-ph:graph-duotone', slug: 'wissen/netz' },
						],
					},
					{
						label: 'Pro und Enterprise',
						translations: { en: 'Pro and Enterprise' },
						items: [
							{ icon: 'i-ph:tree-structure-duotone', slug: 'pro/schutzbedarf' },
							{ icon: 'i-ph:magic-wand-duotone', slug: 'pro/modellierung' },
							{ icon: 'i-ph:check-square-offset-duotone', slug: 'pro/freigaben' },
							{ icon: 'i-ph:cloud-duotone', slug: 'pro/entra' },
							{ icon: 'i-ph:cube-duotone', slug: 'pro/virtualisierung' },
							{ icon: 'i-ph:receipt-duotone', slug: 'pro/lizenzmanagement' },
							{ icon: 'i-ph:broadcast-duotone', slug: 'pro/siem' },
							{ icon: 'i-ph:map-pin-duotone', slug: 'pro/standortrechte' },
							{ icon: 'i-ph:user-list-duotone', slug: 'pro/scim' },
							{ icon: 'i-ph:list-checks-duotone', slug: 'pro/pruefregeln' },
							{ icon: 'i-ph:ticket-duotone', slug: 'pro/tickets' },
							{ icon: 'i-ph:flow-arrow-duotone', slug: 'pro/workflows' },
							{ icon: 'i-ph:chat-circle-dots-duotone', slug: 'pro/daten-assistent' },
							{ icon: 'i-ph:copy-duotone', slug: 'pro/hochverfuegbarkeit' },
							{ icon: 'i-ph:shield-star-duotone', slug: 'pro/isms' },
							{ icon: 'i-ph:user-focus-duotone', slug: 'pro/datenschutz-add-on' },
							{ icon: 'i-ph:shield-warning-duotone', slug: 'pro/nis2' },
						],
					},
				],
			},
		}),
	],
});
