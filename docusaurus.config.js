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
            href: '/learn/',
            label: 'Learn',
            position: 'left',
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
              { label: 'All Courses', href: '/learn/' },
              { label: 'Glossary', href: '/learn/glossary' },
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
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;
