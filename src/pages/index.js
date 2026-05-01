import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// Intro hero — dark CNS-graph band, sits above the kid-friendly hero.
// Engineer / journalist / curious-adult bait; the kid hero stays
// directly below to keep the page warm. Headline is the audience-naming
// triple (Variable 1: Inclusion). Tag is partnership-frame, no command
// verbs. The CNS preview is clickable and routes to the editor walkthrough.
function IntroHero() {
  const cnsSrc = useBaseUrl('/img/ui/cns-graph-hero.png');
  const startDate = new Date('2026-01-02T00:00:00Z');
  const weeksBuilt = Math.max(
    1,
    Math.floor(
      (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
    ),
  );
  return (
    <section className={styles.introHero}>
      <div className={clsx(styles.orb, styles.orbTeal)} aria-hidden="true" />
      <div className={clsx(styles.orb, styles.orbPurple)} aria-hidden="true" />
      <div className={clsx(styles.orb, styles.orbAmber)} aria-hidden="true" />
      <div className={clsx(styles.orb, styles.orbIndigo)} aria-hidden="true" />
      <div className={clsx('container', styles.introContainer)}>
        <div className={styles.introGrid}>
          <div className={styles.introCopy}>
            <p className={styles.introEyebrow}>Open · Local · MIT</p>
            <h1 className={styles.introHeadline}>
              Made for{' '}
              <span className={styles.introAccentTeal}>big tech</span>,{' '}
              <span className={styles.introAccentPurple}>brave teachers</span>,
              and <span className={styles.introAccentAmber}>poor kids</span>.
            </h1>
            <p className={styles.introTag}>
              A <strong>powerful</strong>, <strong>private</strong>,{' '}
              <strong>kid friendly</strong> tool for learning and growing
              with AIs.
            </p>
            <div className={styles.introCtas}>
              <Link
                className="button button--primary button--lg"
                to="/docs/end-to-end"
              >
                See it run
              </Link>
              <Link
                className="button button--outline button--lg"
                to="/docs/quick-start"
                style={{ marginLeft: '1rem' }}
              >
                Quick start
              </Link>
            </div>
            <dl className={styles.introStats}>
              <div className={styles.introStat}>
                <dt className={styles.introStatN}>{weeksBuilt}</dt>
                <dd className={styles.introStatL}>weeks built</dd>
              </div>
              <div className={styles.introStat}>
                <dt className={styles.introStatN}>~57K</dt>
                <dd className={styles.introStatL}>lines Python</dd>
              </div>
              <div className={styles.introStat}>
                <dt className={styles.introStatN}>~15K</dt>
                <dd className={styles.introStatL}>lines tests</dd>
              </div>
              <div className={styles.introStat}>
                <dt className={styles.introStatN}>0</dt>
                <dd className={styles.introStatL}>cloud calls required</dd>
              </div>
              <div className={styles.introStat}>
                <dt className={styles.introStatN}>MIT</dt>
                <dd className={styles.introStatL}>licensed</dd>
              </div>
            </dl>
          </div>
          <Link
            to="/docs/ui/cns-editor"
            className={styles.introPreviewLink}
            aria-label="Open the CNS editor walkthrough"
          >
            <div className={styles.introPreview}>
              <div className={styles.introPreviewBar}>
                <span className={styles.introPreviewPip} />
                <span className={styles.introPreviewPip} />
                <span className={styles.introPreviewPip} />
                <span className={styles.introPreviewTitle}>
                  are-self / cns / pathway editor
                </span>
              </div>
              <img
                src={cnsSrc}
                alt="The Are-Self CNS pathway editor — Begin, List Location, Frontal Lobe, Gate, Retry, and Delay nodes wired together with success and fail edges on a dotted dark canvas."
                className={styles.introPreviewImg}
                loading="eager"
              />
              <span className={styles.introPreviewCta} aria-hidden="true">
                Open the editor walkthrough
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

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
            Start with Story
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/quick-start"
            style={{ marginLeft: '1rem' }}
          >
            Install
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/state"
            style={{ marginLeft: '1rem' }}
          >
            Join Us
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
  {
    title: 'I just want to see it run',
    link: '/docs/end-to-end',
    description:
      'One continuous session, sixteen screenshots — Identity forged, Pathway built, SpikeTrain fired, Frontal Lobe reasoning captured, Nerve Terminal reporting. The whole machine in one page.',
  },
  {
    title: 'I want to help',
    link: '/docs/state#how-to-come-along',
    description:
      'Curriculum, code, papers, broker a 501(c)(3) to deploy Are-Self, or share the bill. Five real doors; only one needs a keyboard.',
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

// State pulse — two bars, set between the hero and the featured
// walkthrough. Visitors see where the work stands without clicking
// through. The full story lives at /docs/state.
function StatePulse() {
  return (
    <section className={styles.statePulse}>
      <div className="container">
        <p className={styles.statePulseLede}>
          Alive since January 2026. MIT licensed and free for everyone
          since April 7. Still learning.
        </p>
        <div className={styles.statePulseBars}>
          <Link to="/docs/state" className={styles.statePulseBar}>
            <span className={styles.statePulseLabel}>Core platform</span>
            <span className={styles.statePulseTrack}>
              <span
                className={styles.statePulseFill}
                style={{ width: '95%' }}
              />
            </span>
            <span className={styles.statePulsePct}>~95% to 1.0</span>
          </Link>
          <a
            href="/learn/"
            target="_self"
            className={styles.statePulseBar}
          >
            <span className={styles.statePulseLabel}>
              Bundles &amp; curriculum
            </span>
            <span className={styles.statePulseTrack}>
              <span
                className={styles.statePulseFill}
                style={{ width: '55%' }}
              />
            </span>
            <span className={styles.statePulsePct}>growing forever</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// Featured: the end-to-end walkthrough. Sits above the six doors
// because it's the single highest-bandwidth answer to "what is this
// thing?" for anyone who has installed Are-Self and wants to see the
// whole tick cycle in one page.
function FeaturedWalkthrough() {
  const thumbSrc = useBaseUrl('/img/ui/e2e-09-graph-view.png');
  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <Link to="/docs/end-to-end" className={styles.featuredCard}>
          <div className={styles.featuredThumbWrap}>
            <img
              src={thumbSrc}
              alt="The Frontal Lobe 3D graph view from the end-to-end walkthrough"
              className={styles.featuredThumb}
              loading="lazy"
            />
          </div>
          <div className={styles.featuredBody}>
            <span className={styles.featuredTag}>Featured walkthrough</span>
            <h2 className={styles.featuredTitle}>
              Are-Self, end-to-end — in one continuous session
            </h2>
            <p className={styles.featuredLede}>
              Identity forged, Pathway built, SpikeTrain fired, Frontal
              Lobe reasoning captured, tool calls logged, Nerve Terminal
              reporting — sixteen screenshots from a single clean run
              on 2026-04-21. If you've installed Are-Self and want to
              see the whole tick cycle at once, start here.
            </p>
            <span className={styles.featuredCta}>
              Walk through the run →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

function HomepageVideo() {
  return (
    <section className={styles.videoSection}>
      <div className="container">
        <div className={styles.videoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/fyZcyoWNM4E"
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
          <a
            href="http://scipraxian.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scipraxianism
          </a>
          {' '}is a philosophy anyone can read, recognize, and choose.
          Are-Self is built inside it. Every meaningful decision weighs
          all twelve, together.
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

// Social row — link to every place @scipraxian shows up. Endpoints
// pulled from are-self-documents/MEDIA_PLAN.md "Accounts (CREATED)".
// Truth Social omitted: profile URL still pending. YouTube link points
// at @scipraxian (the daily/personal channel); the @Are-Self brand
// channel is found through the docs project info.
const socialLinks = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@scipraxian',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/scipraxian',
    path: 'M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    name: 'X',
    href: 'https://x.com/scipraxian',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    name: 'Truth Social',
    href: 'https://truthsocial.com/@scipraxian',
    path: 'M4 4 H20 V7 H13.5 V20 H10.5 V7 H4 Z',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@scipraxian',
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/scipraxian/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    name: 'Reddit',
    href: 'https://www.reddit.com/user/Scipraxian/',
    path: 'M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.974 0 1.764.789 1.764 1.763 0 .726-.435 1.347-1.057 1.62a3.704 3.704 0 0 1 .052.622c0 3.097-3.553 5.605-7.94 5.605s-7.94-2.508-7.94-5.605c0-.213.018-.422.05-.625-.62-.273-1.054-.894-1.054-1.618 0-.974.79-1.763 1.764-1.763.477 0 .898.182 1.207.49 1.207-.864 2.88-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.111-.714zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z',
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/nGFFcxxV',
    path: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z',
  },
];

function SocialRow() {
  return (
    <section className={styles.socialRow}>
      <div className="container">
        <p className={styles.socialRowIntro}>Find us</p>
        <ul className={styles.socialRowList}>
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialRowItem}
                aria-label={link.name}
                title={link.name}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={link.path} />
                </svg>
              </a>
            </li>
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
      <IntroHero />
      <HomepageHeader />
      <main>
        <StatePulse />
        <FeaturedWalkthrough />
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
        <SocialRow />
        <VariablesStrip />
      </main>
    </Layout>
  );
}
