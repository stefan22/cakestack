export interface Author {
  name: string;
  role: string;
  initials: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  tag: string;
  cover: string;
  author: Author;
  featured?: boolean;
}

export const authors: Author[] = [
  { name: 'Mike Corleone', role: 'Head of Design', initials: 'MC' },
  { name: 'Sam Hansan', role: 'Staff Engineer', initials: 'SH' },
  { name: 'Elena Voss', role: 'Product Lead', initials: 'EV' },
  { name: 'Jessica Burns', role: 'Growth Marketer', initials: 'JB' },
  { name: 'Marcus Aurelius', role: 'Research Lead', initials: 'MA' },
];

export const posts: BlogPost[] = [
  {
    slug: 'tailwind-drop-down-animation',
    title: 'Designing A Chatting Humanoid',
    excerpt:
      "Animation should clarify hierarchy and state, not decorate it. Here's how we decide what deserves to move.",
    content: [
      'Every animation on a page is a small promise to the user: this changed, look here, this is now interactive. When that promise is broken — motion for its own sake — interfaces start to feel noisy rather than alive.',
      "We treat motion as a layer of feedback, not decoration. Before shipping a transition we ask three questions: does it clarify what just happened, does it respect the user's sense of continuity, and can it be skipped without losing information.",
      'In practice this means short, purposeful easing curves, staggered reveals that follow reading order, and hover states that respond within a single frame budget. The goal is an interface that feels immediate, never busy.',
    ],
    date: '2026-03-12',
    tag: 'Design',
    cover: '/images/covers/cover-02.jpg',
    author: authors[0],
    featured: true,
  },
  {
    slug: 'tree-shaking',
    title: 'The Case for Scroll-Triggered Reveals',
    excerpt:
      'Fading content into view as it enters the viewport can guide attention — if you resist the urge to overdo it.',
    content: [
      "Scroll-triggered reveals work because they mirror how attention already moves down a page. Content appearing just ahead of the reader's focus feels responsive rather than gimmicky, as long as the timing tracks scroll speed instead of fighting it.",
      'The failure mode is over-application: if every paragraph fades and slides, the technique stops signaling importance and just adds latency to reading. We reserve it for section-level content — cards, feature blocks, testimonials — and leave body copy alone.',
      'A single shared intersection threshold, animating once per element, keeps the pattern predictable across a long page without re-triggering awkwardly when users scroll back up.',
    ],
    date: '2026-03-06',
    tag: 'Engineering',
    cover: '/images/covers/cover-05.jpg',
    author: authors[1],
    featured: true,
  },
  {
    slug: 'react-v19',
    title: 'Building a Theme Toggle That Feels Instant',
    excerpt:
      "A dark mode switch is a tiny interaction, but it's one of the most-used controls in the whole product.",
    content: [
      'Because the theme toggle is used constantly and casually, any lag or flash reads as a defect even if the rest of the product is fast. We optimized for perceived speed first: the icon animates immediately, and the color-scheme swap follows via CSS variables rather than a full re-render.',
      'Persisting the choice locally and reading it before first paint avoids the classic flash-of-wrong-theme on load, which matters more for trust than almost any other performance metric on the page.',
    ],
    date: '2026-02-24',
    tag: 'Engineering',
    cover: '/images/covers/cover-06.jpg',
    author: authors[1],
  },
  {
    slug: 'prisma-orm-notes',
    title: 'What Makes a Card Hover Feel Good',
    excerpt:
      'A subtle scale, a shadow that deepens, an icon that slides in — small details that separate a static grid from an inviting one.',
    content: [
      "Hover states on cards are a chance to reward curiosity without asking for a click. A slight image scale, a softened shadow, and a secondary action fading into a corner all say 'this is interactive' before the user commits.",
      'We keep the motion budget small — around 300ms with an eased curve — so the effect reads as responsiveness, not a performance. Anything longer starts to feel like the interface is showing off.',
    ],
    date: '2026-02-18',
    tag: 'Design',
    cover: '/images/covers/cover-07.jpg',
    author: authors[0],
  },
  {
    slug: 'app-router-vs-pages-router',
    title: 'Shared Layout Transitions Between Pages',
    excerpt:
      "Carrying an element's position and size across a navigation makes two separate pages feel like one continuous space.",
    content: [
      "When a thumbnail on a list page becomes the hero image on a detail page, animating that continuity — rather than cutting between two static states — preserves the user's spatial model of where they are.",
      "This only works when it's fast and interruptible. If a shared transition blocks input or breaks on a quick back-and-forth navigation, it does more harm than a plain page load would have.",
    ],
    date: '2026-02-09',
    tag: 'Engineering',
    cover: '/images/covers/cover-04.jpg',
    author: authors[4],
  },
  {
    slug: 'js-map-filter-and-reduce',
    title: 'Writing Microcopy for Empty States',
    excerpt:
      "An empty search result or a blank dashboard is not a dead end — it's an opportunity to tell the user what to do next.",
    content: [
      "Empty states get skipped in design reviews because there's 'nothing there' — which is exactly why they need attention. A good empty state explains why the space is empty and gives one clear next action.",
      "We write these last, after the happy path is settled, but budget real time for them. They're often the first thing a new user sees.",
    ],
    date: '2026-01-29',
    tag: 'Product',
    cover: '/images/covers/cover-01.jpg',
    author: authors[2],
  },
  {
    slug: 'lazy-loading',
    title: 'Staggered Lists and Perceived Performance',
    excerpt:
      'Rendering a list all at once can feel like a delay. Staggering the reveal by a few milliseconds per item can feel instant.',
    content: [
      "Counterintuitively, adding a small stagger to a list's entrance animation often makes it feel faster than rendering everything simultaneously. The eye tracks the first item appearing almost immediately, and the rest follow in its peripheral vision.",
      "We cap the stagger at around 60ms per item and never let total sequence time exceed roughly half a second, so a long list doesn't feel like it's trickling in.",
    ],
    date: '2026-01-14',
    tag: 'Design',
    cover: '/images/covers/cover-03.jpg',
    author: authors[0],
  },
  {
    slug: 'performance-balance',
    title: 'Search-as-You-Type Without the Jank',
    excerpt:
      "Filtering a grid in real time only feels good if the layout doesn't jump around while items enter and exit.",
    content: [
      'Live filtering fails visually when removed items just vanish and the grid snaps into its new shape. Animating both the exit and the reflow — even briefly — keeps the list feeling like one continuous object instead of a series of replacements.',
      'Debouncing the input by a small amount and animating layout changes together, rather than per-keystroke, is what keeps this smooth on longer lists.',
    ],
    date: '2025-12-18',
    tag: 'Engineering',
    cover: '/images/covers/cover-09.jpg',
    author: authors[1],
  },
  {
    slug: 'json-web-tokens',
    title: 'The Quiet Work of Easing Curves',
    excerpt:
      "Linear motion reads as mechanical. The right easing curve is the difference between an animation you notice and one you don't.",
    content: [
      "Most default easing functions overshoot or undershoot in ways that feel slightly off once you've seen the alternative. We standardized on a small set of custom cubic-bezier curves tuned for entrances, exits, and hover response, so every animation in the product shares the same physical feel.",
      "The best compliment an easing curve can get is that nobody mentions it. If motion is noticeable as motion, it's usually the curve, not the concept, that needs work.",
    ],
    date: '2025-12-02',
    tag: 'Design',
    cover: '/images/covers/cover-08.jpg',
    author: authors[4],
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getFeaturedPosts() {
  return posts.filter((post) => post.featured);
}

export function getRelatedPosts(slug: string, count = 3) {
  const current = getPostBySlug(slug);
  if (!current) return posts.slice(0, count);
  return posts
    .filter((post) => post.slug !== slug && post.tag === current.tag)
    .concat(
      posts.filter((post) => post.slug !== slug && post.tag !== current.tag)
    )
    .slice(0, count);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}
