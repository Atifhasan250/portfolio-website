import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { timelineItems } from '@/data/timeline';

const SITE_URL = 'https://atifhasan.com';
const SOCIAL_IMAGE = `${SITE_URL}/social-preview.png`;

const timelineGraph = {
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#timeline`,
  name: "Atif Hasan's timeline",
  description: "Key milestones in Atif Hasan's learning and development journey.",
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: timelineItems.length,
  itemListElement: timelineItems.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Event',
      name: item.title,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      about: { '@id': `${SITE_URL}/#person` },
    },
  })),
};

const personGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Atif Hasan',
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Atif Hasan',
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/profile-image.png`,
      jobTitle: 'Full-Stack and AI Developer',
      description: 'IUT Civil Engineering student and developer with 6+ years of experience building full-stack, AI, mobile, SaaS, and IoT projects.',
      homeLocation: { '@type': 'Place', name: 'Bogura, Bangladesh' },
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: 'Islamic University of Technology',
        alternateName: 'IUT',
      },
      knowsAbout: ['Full-stack development', 'AI integration', 'AI automation', 'SaaS development', 'Mobile app development', 'IoT systems'],
      sameAs: [
        'https://github.com/atifhasan250',
        'https://www.linkedin.com/in/atifhasan250/',
        'https://www.facebook.com/atifhasan250',
        'https://www.instagram.com/_atif_hasan_/',
      ],
    },
    timelineGraph,
  ],
};

const pageConfigs = {
  home: {
    title: 'Atif Hasan | Full-Stack & AI Developer',
    description: 'Atif Hasan is an IUT Civil Engineering student and developer with 6+ years of experience building full-stack, AI, mobile, SaaS, and IoT projects.',
    canonical: `${SITE_URL}/`,
    imageAlt: 'Atif Hasan, Full-Stack and AI Developer',
    structuredData: personGraph,
  },
  projects: {
    title: 'Projects | Atif Hasan',
    description: "Explore Atif Hasan's full-stack, AI, SaaS, mobile, and IoT projects, including practical products built for clients and personal use.",
    canonical: `${SITE_URL}/projects`,
    imageAlt: 'Selected projects by Atif Hasan',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/projects#page`,
      url: `${SITE_URL}/projects`,
      name: 'Projects | Atif Hasan',
      description: 'A collection of full-stack, AI, SaaS, mobile, and IoT projects by Atif Hasan.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#person` },
      inLanguage: 'en',
    },
  },
} as const;

function setNamedMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function setPropertyMeta(property: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function ClientSeo() {
  const [location] = useLocation();

  useEffect(() => {
    const isAdmin = location.startsWith('/admin');
    const config = location === '/' ? pageConfigs.home : location === '/projects' ? pageConfigs.projects : null;
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const structuredData = document.getElementById('page-structured-data');

    if (!config) {
      document.title = isAdmin ? 'Admin | Atif Hasan' : 'Page Not Found | Atif Hasan';
      setNamedMeta('robots', isAdmin ? 'noindex, nofollow, noarchive' : 'noindex, nofollow');
      canonical?.remove();
      structuredData?.remove();
      return;
    }

    document.title = config.title;
    setNamedMeta('description', config.description);
    setNamedMeta('robots', 'index, follow, max-image-preview:large');
    setNamedMeta('twitter:card', 'summary_large_image');
    setNamedMeta('twitter:title', config.title);
    setNamedMeta('twitter:description', config.description);
    setNamedMeta('twitter:image', SOCIAL_IMAGE);
    setNamedMeta('twitter:image:alt', config.imageAlt);
    setPropertyMeta('og:title', config.title);
    setPropertyMeta('og:description', config.description);
    setPropertyMeta('og:type', 'website');
    setPropertyMeta('og:url', config.canonical);
    setPropertyMeta('og:image', SOCIAL_IMAGE);
    setPropertyMeta('og:image:alt', config.imageAlt);

    const canonicalLink = canonical ?? document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = config.canonical;
    if (!canonical) document.head.appendChild(canonicalLink);

    const jsonLd = structuredData ?? document.createElement('script');
    jsonLd.id = 'page-structured-data';
    jsonLd.setAttribute('type', 'application/ld+json');
    jsonLd.textContent = JSON.stringify(config.structuredData);
    if (!structuredData) document.head.appendChild(jsonLd);
  }, [location]);

  return null;
}
