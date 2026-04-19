// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Are-Self',
  tagline: 'Why do for yourself what Are-Self can do for you?',
  favicon: 'img/favicon.ico',

  url: 'https://are-self.com',
  baseUrl: '/',

  organizationName: 'scipraxian',
  projectName: 'are-self-docs',

  // /learn/* paths resolve to the are-self-learn sub-site, which is built
  // separately and merged into build/learn/ by .github/workflows/deploy.yml.
  // Local and CI docs builds can't see those paths, so we warn instead of throw.
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Unregister any stale service worker a previous deploy installed at
  // /sw.js. It was intercepting /learn/ navigations and serving the
  // docs site's cached /404.html. static/sw.js now contains a
  // self-unregistering script; this client module handles visitors
  // whose browser hasn't run the SW update check yet.
  clientModules: [require.resolve('./src/clientModules/unregisterStaleSW.js')],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/scipraxian/are-self-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    [
      // Local, offline, no-Algolia search. Builds a Lunr index at
      // build time and renders a search box in the navbar.
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: '/docs',
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarShortcut: true,
        searchBarShortcutHint: true,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/are-self-social-card.png',
      navbar: {
        title: 'Are-Self',
        logo: {
          alt: 'Are-Self Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: '/docs/api-reference',
            label: 'API Reference',
            position: 'left',
          },
          {
            href: '/docs/security',
            label: 'Security',
            position: 'left',
          },
          {
            href: '/docs/research',
            label: 'Research',
            position: 'left',
          },
          {
            // The `pathname://` protocol prefix is the Docusaurus escape
            // hatch that makes <Link> fall through to a plain <a> and
            // do a real page load — target: '_self' does NOT force
            // that (see node_modules/@docusaurus/core/lib/client/
            // exports/Link.js: `hasInternalTarget = !target ||
            // target === '_self'` treats _self as internal). Without
            // this, React Router intercepts the click, /learn/ isn't
            // a registered SPA route, and Docusaurus serves its 404.
            // /learn/* is the are-self-learn sub-site merged into
            // build/learn/ by .github/workflows/deploy.yml.
            href: 'pathname:///learn/',
            label: 'Learn',
            position: 'left',
            target: '_self',
          },
          {
            href: 'https://github.com/scipraxian/are-self-api',
            label: 'GitHub (API)',
            position: 'right',
          },
          {
            href: 'https://github.com/scipraxian/are-self-ui',
            label: 'GitHub (UI)',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              { label: 'Getting Started', to: '/docs/getting-started' },
              { label: 'Architecture', to: '/docs/architecture' },
              { label: 'API Reference', to: '/docs/api-reference' },
            ],
          },
          {
            title: 'Project',
            items: [
              { label: 'Contributing', to: '/docs/contributing' },
              { label: 'Security', to: '/docs/security' },
              { label: 'Dependency Audit', to: '/docs/dependency-audit' },
            ],
          },
          {
            title: 'Research',
            items: [
              { label: 'Research Papers', to: '/docs/research' },
              {
                label: 'GitHub (Research)',
                href: 'https://github.com/scipraxian/are-self-research',
              },
            ],
          },
          {
            title: 'Learn',
            items: [
              // pathname:// protocol forces a real page load to the
              // merged are-self-learn sub-site (see navbar comment).
              { label: 'All Courses', href: 'pathname:///learn/', target: '_self' },
              { label: 'Glossary', href: 'pathname:///learn/glossary', target: '_self' },
              { label: 'Storybook', to: '/docs/storybook' },
              {
                label: 'GitHub (Learn)',
                href: 'https://github.com/scipraxian/are-self-learn',
              },
              {
                label: 'Scipraxian',
                href: 'https://scipraxian.org',
              },
            ],
          },
        ],
        copyright: `MIT Licensed. Built by Michael Clark. ${new Date().getFullYear()}.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['python', 'bash', 'json'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;
