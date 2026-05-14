export const profile = {
  name: 'navfolio',
  handle: '@navfolio',
  role: 'A Cat Developer',
  company: 'Independent Studio',
  location: 'Remote',
  email: 'hello@navfolio.site',
  website: 'https://astro.navfolio.site/',
  github: 'https://github.com/navfolio',
  meta: 'Open-source maintainer',
  avatar: '/images/logo.png',
};

export const navigationLinks = [
  {
    icon: 'compass',
    title: 'Portfolio',
    subtitle: 'Selected work and case studies',
    href: profile.website,
  },
  {
    icon: 'pen',
    title: 'Blog',
    subtitle: 'Essays, notes, and field reports',
    href: '/blog',
  },
  {
    icon: 'briefcase',
    title: 'Resume',
    subtitle: 'Career profile and experience',
    href: 'https://resume.navfolio.site/',
  },
  {
    icon: 'github',
    title: 'Open Source',
    subtitle: 'Code, experiments, and tools',
    href: profile.github,
  },
];

export const quote = {
  text: ['Navigate your world,', 'Showcase your story,', 'and keep everything in one place.'],
  image: '/images/logo-with-name.png',
};

export const intro = {
  title: 'here is navfolio',
  name: 'navfolio',
  body: [
    'The name combines "Navigation" and "Portfolio".',
    'Navfolio focuses on lightweight organization, smooth reading experience, and developer-friendly aesthetics.',
    'It feels less like a resume, and more like a personal operating system for your ideas, projects, notes, and online presence.',
  ],
  image: '/images/logo-cat.png',
};

export const connectLinks = [
  { label: 'GitHub', href: profile.github, icon: 'github' },
  { label: 'Website', href: profile.website, icon: 'compass' },
  { label: 'Blog', href: '/blog', icon: 'book' },
  { label: 'Projects', href: 'https://github.com/example?tab=repositories', icon: 'repo' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
];

export const doingItems = [
  { text: 'Shipping a personal dashboard template', mark: '01' },
  { text: 'Writing reusable notes for future projects', mark: '02' },
  { text: 'Improving static-site publishing workflow', mark: '03' },
  { text: 'Collecting useful developer resources', mark: '04' },
  { text: 'Exploring small open-source ideas', mark: '05' },
];
