# Atif Hasan - Portfolio Website

> A sleek, highly interactive, and responsive portfolio website built to showcase my professional skills and projects. Designed with an emphasis on smooth animations, tactile interactions, and a premium user experience.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Atifhasan250/portfolio-website)

## Key Features

- **Fluid Scrolling & Interactions**: High-performance momentum scrolling driven by `Lenis`, combined with a tactile, drag-and-snap project carousel using `Embla Carousel`.
- **Modern Animations**: Complex, smooth entrance and scroll-driven animations powered by `Framer Motion`.
- **Responsive Design**: Flawless layout adaptation across mobile, tablet, and desktop viewports.
- **Dynamic Theming**: Seamless transitioning between elegant Dark and Light modes.
- **Contact Form**: Integrated contact system with real-time validation via `React Hook Form` and `Zod`.
- **Accessible & Semantic**: Built with accessible Radix UI primitives and semantic HTML.

## Tech Stack

### Frontend

- **React 18** - UI Library
- **TypeScript** - Type safety and autocomplete
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Advanced UI animations
- **Embla Carousel** - Tactile swipe/drag carousels
- **Lenis** - Smooth scrolling engine
- **Shadcn/UI & Radix UI** - Accessible UI components
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching

### Backend

- **Node.js & Express.js** - API and server infrastructure
- **Drizzle ORM** - Type-safe database interactions
- **PostgreSQL** - Database (Neon Serverless)
- **SendGrid** - Email delivery

### Development

- **Vite** - Lightning-fast frontend build tool
- **ESBuild** - Bundler for the server

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Git for version control
- PostgreSQL Database (e.g., Neon)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Atifhasan250/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   _Update the `.env` file with your database and email credentials._

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to see the portfolio in action!

## Project Structure

```
portfolio-website/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components (Hero, Works, Navbar)
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions (QueryClient, etc.)
│   │   └── index.css      # Global styles and CSS variables
│   ├── public/            # Static assets (Project images, favicons)
│   └── index.html         # HTML entry point
├── server/                # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes for contact submissions
│   └── storage.ts         # Data storage layer
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schema & Zod types
├── package.json           # Dependencies & scripts
└── vite.config.ts         # Vite configuration
```

## Customization

### Theming

The website uses a custom CSS-variable-based theming system. To update the core colors, modify `client/src/index.css`:

```css
:root,
[data-theme="dark"] {
  --color-bg-page: #111318;
  --color-bg-card: #1a1d24;
  --color-text-heading: #e8e6e1;
  --color-btn-primary-bg: #e8e6e1;
  /* ... */
}

[data-theme="light"] {
  --color-bg-page: #f7f5f2;
  --color-bg-card: #eeeae4;
  --color-text-heading: #1a1918;
  /* ... */
}
```

### Content Updates

- **Personal Info**: Modify `client/src/components/hero-section.tsx` and `about-section.tsx`.
- **Projects Showcase**: Update the `allProjects` array inside `client/src/components/works-section.tsx`.
- **Tech Stack**: Edit `client/src/components/tech-stack-section.tsx`.

## Deployment

### Vercel (Recommended)

This project is configured out-of-the-box for Vercel.

1. Import the repository into your Vercel dashboard.
2. Add the required environment variables (`DATABASE_URL`, etc.).
3. Deploy! Vercel will automatically use the `vercel.json` configuration to build both the frontend and the Express backend.

## License

This project is licensed under the MIT License.

---

**Made with ❤️ by Atif Hasan**
