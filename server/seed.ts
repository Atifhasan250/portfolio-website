import { getProjectsCollection } from './db';

const SEED_PROJECTS = [
  {
    title: 'IT Resource Zone',
    description: 'An IT learning portal with live exams, practice mode, leaderboards, dashboards, habits, and curated resources.',
    imageUrl: '',
    imagekitFileId: '',
    link: 'https://irz.atifhasan.com/',
    technologies: ['Next.js', 'MongoDB', 'Clerk', 'Tailwind CSS', 'PWA'],
    featured: true,
    order: 1,
    createdAt: new Date(),
  },
  {
    title: 'Stitch Drive',
    description: 'A Google Drive file organizing app that helps you manage files of multiple Google Drive accounts.',
    imageUrl: '',
    imagekitFileId: '',
    link: 'https://stitchdrive.vercel.app/',
    technologies: ['Next.js', 'MongoDB', 'Google Drive API', 'Clerk', 'Tailwind CSS'],
    featured: true,
    order: 2,
    createdAt: new Date(),
  },
  {
    title: 'Shortened Link',
    description: 'A powerful, easy-to-use URL shortener with custom links, instant redirects, and link previews.',
    imageUrl: '',
    imagekitFileId: '',
    link: 'https://shortened-link.vercel.app/',
    technologies: ['Next.js', 'MongoDB', 'Tailwind CSS'],
    featured: false,
    order: 3,
    createdAt: new Date(),
  },
  {
    title: 'Monthly Todo Planner',
    description: 'A monthly goal planner that helps you keep track of your progress and tracks daily habit. (Android App)',
    imageUrl: '',
    imagekitFileId: '',
    link: 'https://monthly-todo-planner.netlify.app/',
    technologies: ['React.js', 'MongoDB', 'Expo', 'Tailwind CSS'],
    featured: false,
    order: 4,
    createdAt: new Date(),
  },
  {
    title: 'IntelliPlan',
    description: 'Your all-in-one study planner with task management, goal setting, and timer to focus. (For students)',
    imageUrl: '',
    imagekitFileId: '',
    link: 'https://intelliplan.vercel.app/',
    technologies: ['Next.js', 'Firebase', 'Clerk'],
    featured: true,
    order: 5,
    createdAt: new Date(),
  },
  {
    title: 'Classnote Sorter',
    description: 'Optimize your classnote PDFs with Classnote Sorter, a web app for changing layouts and reducing costs of printing PDF class notes.',
    imageUrl: '',
    imagekitFileId: '',
    link: 'https://classnote-sorter.vercel.app/',
    technologies: ['Next.js', 'MongoDB', 'Firebase', 'Tailwind CSS'],
    featured: false,
    order: 6,
    createdAt: new Date(),
  },
  {
    title: 'Shad Jatra',
    description: 'Explore the rich flavors of Bangladeshi cuisine. Step-by-step guides in a user-friendly web app.',
    imageUrl: '',
    imagekitFileId: '',
    link: 'https://shad-jatra.vercel.app/',
    technologies: ['Next.js', 'Recipe API', 'Clerk', 'MongoDB'],
    featured: false,
    order: 7,
    createdAt: new Date(),
  },
  {
    title: 'Capital Balance',
    description: 'Track and manage your personal capital with ease. Finance dashboard built with Next.js, React, TypeScript, and Recharts for data visualization.',
    imageUrl: '',
    imagekitFileId: '',
    link: 'https://capital-balance.vercel.app/',
    technologies: ['Next.js', 'MongoDB', 'Clerk', 'Recharts'],
    featured: false,
    order: 8,
    createdAt: new Date(),
  },
];

export async function seedProjects(): Promise<void> {
  const col = getProjectsCollection();
  const count = await col.countDocuments();

  if (count > 0) {
    console.log(`[Seed] Projects collection already has ${count} documents — skipping seed.`);
    return;
  }

  await col.insertMany(SEED_PROJECTS);
  console.log(`[Seed] Inserted ${SEED_PROJECTS.length} projects successfully.`);
}
