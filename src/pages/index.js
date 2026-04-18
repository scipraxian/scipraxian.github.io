import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const heroSrc = useBaseUrl('/img/hero.png');
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroImageWrapper}>
          <img
            src={heroSrc}
            alt="A young learner at a glowing workstation in a bright lab filled with holographic screens, brain models, crystals, and a cityscape through the window — the Are-Self world."
            className={styles.heroImage}
            loading="eager"
          />
        </div>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <p className={styles.heroDescription}>
          An open-source, neurologically-inspired AI reasoning swarm
          engine — bringing free AI to underserved youth, curious
          adults, and anyone else the subscription economy forgot.
        </p>
        <p className={styles.heroTagline}>
          Free. Local. Private. MIT licensed. On hardware you already own.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/storybook"
          >
            Start with the Story
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/quick-start"
            style={{ marginLeft: '1rem' }}
          >
            For Developers
          </Link>
        </div>
      </div>
    </header>
  );
}

// /learn/* is a separately-built Docusaurus sub-site merged into
// build/learn/ at deploy time (see .github/workflows/deploy.yml).
// The docs SPA has no route for it, so <Link to="/learn/..."> gives
// a client-side 404; only a real navigation reaches GitHub Pages
// and serves the learn sub-site. Render those as plain anchors.
function isLearnLink(link) {
  return typeof link === 'string' && link.startsWith('/learn/');
}

// Six doors — one per audience. If you land here and you're not a
// developer, there is somewhere for you to go.
const doors = [
  {
    title: 'I am a Teacher',
    link: '/learn/courses/elementary-4th-grade',
    description:
      'Free, ready-to-run curricula from 4th grade to community college, with worksheets, rubrics, and transcripts for every lesson.',
  },
  {
    title: 'I am a Student',
    link: '/docs/storybook',
    description:
      'Start with Mira and the Are-Self — a free storybook about thinking clearly, asking one more question, and not getting left outside the circle.',
  },
  {
    title: 'I am a Developer',
    link: '/docs/quick-start',
    description:
      'Django 6, Celery, Postgres + pgvector, Ollama. Five-minute install. MIT licensed. Forkable. The architecture is as serious as the vibe is friendly.',
  },
  {
    title: 'I am Curious',
    link: '/docs/architecture',
    description:
      'Nine brain regions, nine Django apps. The Hippocampus remembers, the Frontal Lobe reasons, the Hypothalamus keeps the bill down. All of it open.',
  },
  {
    title: 'I am a Researcher / Journalist',
    link: '/docs/research',
    description:
      'Six working papers on neuro-mimetic architecture, swarm coordination, memory provenance, and local-first AI. Peer review welcome.',
  },
  {
    title: 'I am a Corporate Trainer',
    link: '/learn/',
    description:
      'Honest, vendor-neutral AI literacy and cost-management curricula for teams that actually have to explain their OpenAI bill to the CFO.',
  },
];

function Door({ title, description, link }) {
  const inner = (
    <div className="padding-horiz--md">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {isLearnLink(link) ? (
        <a href={link} target="_self" className={styles.featureLink}>{inner}</a>
      ) : (
        <Link to={link} className={styles.featureLink}>{inner}</Link>
      )}
    </div>
  );
}

function HomepageVideo() {
  return (
    <section className={styles.videoSection}>
      <div className="container">
        <div className={styles.videoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/UUX-T2aTZlI"
            title="Are-Self — The Grid Is Free"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

// Twelve Variables — the scipraxian decision lattice. Quiet band,
// not loud. Links out to scipraxian.org for the full treatment.
const variables = [
  'Inclusion',
  'Humility',
  'Inquiry',
  'Fulfillment or Happiness',
  'Religion or Profit',
  'Fun',
  'Fear',
  'Responsibility',
  'Perseverance',
  'Perception',
  'Time',
  'Permadeath',
];

function VariablesStrip() {
  return (
    <section className={styles.variablesStrip}>
      <div className="container">
        <p className={styles.variablesIntro}>
          Are-Self is built inside a philosophy called{' '}
          <a
            href="https://scipraxian.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            scipraxianism
          </a>
          . Every meaningful decision weighs against twelve variables,
          not one.
        </p>
        <ul className={styles.variablesList}>
          {variables.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Right-now news. What's shipping, where we'll be, what's worth
// reading tonight.
const news = [
  {
    tag: 'Just launched',
    headline: 'are-self-learn',
    body:
      'A free curriculum framework — 4th grade through community college — shipping today under MIT. Teachers and parents welcome.',
    link: '/learn/',
  },
  {
    tag: 'On the floor',
    headline: 'SDCC 2026',
    body:
      'Are-Self is at San Diego Comic-Con on the Haunted Space Hotel booth. Come say hi. We will have demos, stickers, and the storybook in print.',
    link: 'https://hauntedspacehotel.com',
  },
  {
    tag: 'Read tonight',
    headline: 'Mira and the Are-Self',
    body:
      'Book One of the Scipraxian Tales. A story for ten-year-olds and anyone who has ever been ten. Free, online, twenty minutes.',
    link: '/docs/storybook',
  },
];

function NewsStrip() {
  return (
    <section className={styles.newsStrip}>
      <div className="container">
        <div className="row">
          {news.map((n, i) => {
            const inner = (<><span className={styles.newsTag}>{n.tag}</span><h4>{n.headline}</h4><p>{n.body}</p></>);
            return (
              <div className={clsx('col col--4', styles.newsCol)} key={i}>
                {isLearnLink(n.link) ? (
                  <a href={n.link} target="_self" className={styles.newsCard}>{inner}</a>
                ) : (
                  <Link to={n.link} className={styles.newsCard}>{inner}</Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Free, local, MIT-licensed AI reasoning swarm — bringing free AI to underserved youth."
    >
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {doors.map((props, idx) => (
                <Door key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <HomepageVideo />
        <NewsStrip />
        <VariablesStrip />
      </main>
    </Layout>
  );
}
