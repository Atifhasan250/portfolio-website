# Portfolio Website Setup Guide

This guide will help you set up and run the Atif Hasan portfolio website on your local machine using VS Code.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (version 18 or later)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **VS Code**
   - Download from: https://code.visualstudio.com/

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Step-by-Step Setup Instructions

### Step 1: Extract and Open the Project

1. **Extract the ZIP file** to your desired location (e.g., Desktop, Documents)
2. **Open VS Code**
3. **Open the project folder:**
   - Click `File` → `Open Folder`
   - Navigate to the extracted folder and select it
   - Click "Select Folder"

### Step 2: Install Dependencies

1. **Open the integrated terminal in VS Code:**
   - Press `Ctrl + `` (backtick) or go to `Terminal` → `New Terminal`

2. **Install project dependencies:**
   ```bash
   npm install
   ```
   
   This will install all required packages including React, Express, Tailwind CSS, and other dependencies.

### Step 3: Start the Development Server

1. **Run the development command:**
   ```bash
   npm run dev
   ```

2. **Wait for the server to start** - you should see output like:
   ```
   [express] serving on port 5000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

### Step 4: Project Structure Overview

```
portfolio-website/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Original TypeScript components
│   │   ├── components-jsx/   # JSX versions (deployment ready)
│   │   ├── pages/           # TypeScript pages
│   │   ├── pages-jsx/       # JSX pages (deployment ready)
│   │   ├── index.css        # Global styles
│   │   └── main.tsx         # Application entry point
│   └── index.html           # HTML template
├── server/                   # Backend Express server
├── attached_assets/         # Generated project images
└── package.json            # Project dependencies
```

## Available Commands

- **`npm run dev`** - Start development server (frontend + backend)
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally

## Using JSX Components (Deployment Ready)

The project includes both TypeScript (.tsx) and JavaScript (.jsx) versions:

- **TypeScript components**: `client/src/components/` (current active)
- **JSX components**: `client/src/components-jsx/` (deployment ready)

To switch to JSX components for easier deployment:

1. **Update the main portfolio page** (`client/src/pages/portfolio.tsx`):
   ```jsx
   // Change imports from:
   import HeroSection from '../components/hero-section';
   // To:
   import HeroSection from '../components-jsx/hero-section';
   ```

2. **Or use the ready JSX page** at `client/src/pages-jsx/portfolio.jsx`

## Troubleshooting

### Common Issues and Solutions

1. **Port already in use:**
   - If port 5000 is busy, the server will automatically use the next available port
   - Check the terminal output for the actual port number

2. **Dependencies not installing:**
   ```bash
   # Clear npm cache and try again
   npm cache clean --force
   npm install
   ```

3. **Images not loading:**
   - Ensure all images are in the `attached_assets/` folder
   - Check that import paths are correct

4. **Node.js version issues:**
   - Make sure you're using Node.js version 18 or later
   - Update Node.js if needed: https://nodejs.org/

### VS Code Extensions (Recommended)

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Auto Rename Tag**
4. **Prettier - Code formatter**
5. **Bracket Pair Colorizer**

## Features

- **Responsive Design** - Works on all device sizes
- **Real Technology Icons** - Authentic brand icons using react-icons
- **Creative Project Images** - AI-generated project screenshots
- **Contact Form** - Integrated with Formspree
- **Smooth Animations** - CSS transitions and animations
- **Modern UI** - Glassmorphism and dark theme

## Deployment Options

### 1. Vercel (Recommended)
1. Push code to GitHub repository
2. Connect GitHub to Vercel
3. Deploy automatically

### 2. Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### 3. Traditional Hosting
1. Build the project: `npm run build`
2. Upload `dist` folder to your web server

## Support

If you encounter any issues:

1. Check the browser console for errors (F12 → Console)
2. Check the terminal output for error messages
3. Ensure all dependencies are installed correctly
4. Verify Node.js version compatibility

## Project Features

### Technology Stack Section
- **Mobile Optimized**: Responsive grid layout (2×2 on mobile, up to 6 columns on desktop)
- **Real Icons**: Authentic technology brand icons
- **Square Cards**: Clean, consistent card design
- **Smooth Animations**: Staggered loading animations

### Projects Section
- **Creative Images**: AI-generated project mockups
- **Interactive Carousel**: Navigate through projects
- **Technology Tags**: Show tech stack for each project
- **Responsive Layout**: Adapts to screen size

### Contact Section
- **Working Form**: Integrated with Formspree
- **Social Links**: Direct links to social media profiles
- **Responsive Design**: Mobile-friendly layout

The website is now ready to run and fully optimized for both development and production deployment!