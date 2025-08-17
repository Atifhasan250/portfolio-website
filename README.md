# 🚀 Modern Portfolio Website

> A sleek, responsive portfolio website built with cutting-edge web technologies to showcase professional skills and projects.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Atifhasan250/portfolio-website)

## ✨ Features

- **🎨 Modern Design**: Clean, professional interface with smooth animations
- **📱 Fully Responsive**: Optimized for all devices and screen sizes
- **⚡ Lightning Fast**: Built with Vite for optimal performance
- **🌙 Dark Mode**: Seamless light/dark theme switching
- **📬 Contact Form**: Integrated contact system with real-time validation
- **🔧 Tech Stack Showcase**: Interactive display of skills and technologies
- **📊 Projects Gallery**: Beautiful showcase of work and achievements
- **♿ Accessible**: WCAG compliant with semantic HTML

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Wouter** - Lightweight routing solution
- **Shadcn/ui** - Beautiful, accessible component library
- **TanStack Query** - Powerful data synchronization

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Full-stack type safety
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database

### Development & Build Tools
- **Vite** - Next-generation frontend build tool
- **ESBuild** - Extremely fast JavaScript bundler
- **PostCSS** - CSS transformation tool
- **TSX** - TypeScript execution environment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git for version control

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
   cp .env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   VITE_CONTACT_API_URL=your_contact_api_endpoint
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to see your portfolio in action!

## 📁 Project Structure

```
portfolio-website/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   └── index.html         # HTML template
├── server/                # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schema & types
├── package.json           # Dependencies & scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript configuration
└── vercel.json            # Vercel deployment config
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment with zero configuration:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the settings
   - Click "Deploy"

3. **Environment Variables**
   Add these environment variables in your Vercel dashboard:
   ```
   DATABASE_URL=your_postgresql_connection_string
   VITE_CONTACT_API_URL=your_contact_api_endpoint
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository for continuous deployment

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

## 🎨 Customization

### Colors & Theming
Update the color palette in `client/src/index.css`:

```css
:root {
  --primary: 220 90% 56%;
  --secondary: 210 40% 98%;
  /* Add your custom colors */
}
```

### Content Updates
- **Personal Info**: Update `client/src/components/hero-section.tsx`
- **About Section**: Modify `client/src/components/about-section.tsx`
- **Projects**: Edit `client/src/components/works-section.tsx`
- **Skills**: Update `client/src/components/tech-stack-section.tsx`

### Adding New Sections
1. Create a new component in `client/src/components/`
2. Import and add it to `client/src/pages/portfolio.tsx`
3. Update navigation if needed in `client/src/components/navbar.tsx`

### Updating Images
- **Profile Image**: Replace `client/public/profile-image.png` with your photo
- **Project Images**: Replace project images in `client/public/` (project-*.png files)
- Images are automatically optimized during build process

## 📧 Contact Form Setup

The contact form uses a backend API. To set it up:

1. **Database Setup**: The contact form stores submissions in PostgreSQL
2. **API Endpoint**: Contact submissions are handled at `/api/contacts`
3. **Validation**: Form validation uses Zod schemas for type safety

## 🔧 Configuration Files

### Vercel Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **Module resolution errors**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Run type checking
   npm run type-check
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide React](https://lucide.dev/) for the icon library

---

**Made with ❤️ and modern web technologies**

*Ready to showcase your work to the world? Deploy this portfolio today!*