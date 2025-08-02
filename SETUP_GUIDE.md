# Portfolio Website Setup Guide

Complete step-by-step instructions to run the Atif Hasan portfolio website on your PC using VS Code.

## Prerequisites

Download and install these before starting:

1. **Node.js** (version 18 or newer)
   - Go to: https://nodejs.org/
   - Download the LTS version
   - Install with default settings
   - Verify: Open Command Prompt and type `node --version` and `npm --version`

2. **VS Code**
   - Go to: https://code.visualstudio.com/
   - Download and install

## Step-by-Step Setup Instructions

### Step 1: Extract the Project Files

1. **Download the ZIP file** containing the portfolio code
2. **Extract the ZIP file** to a location like:
   - Windows: `C:\Users\YourName\Desktop\portfolio-website`
   - Or any folder you prefer

### Step 2: Open in VS Code

1. **Launch VS Code**
2. **Open the project folder:**
   - Method 1: Drag the extracted folder onto VS Code window
   - Method 2: Click `File` → `Open Folder` → Select the extracted folder
   - Method 3: Press `Ctrl+K Ctrl+O` → Navigate to folder → Click "Select Folder"

### Step 3: Install Dependencies

1. **Open VS Code Terminal:**
   - Press `Ctrl + `` (backtick key)
   - Or go to `Terminal` → `New Terminal`
   - Or press `Ctrl+Shift+`` 

2. **Install all packages:**
   ```bash
   npm install
   ```
   
   Wait for installation to complete (may take 2-3 minutes)

### Step 4: Start the Website

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Look for this output:**
   ```
   [express] serving on port 5000
   ```

3. **Open your browser** and go to:
   ```
   http://localhost:5000
   ```

**That's it! Your portfolio website should now be running.**

## What You'll See

- **Hero Section** - Atif Hasan's introduction with profile picture
- **About Section** - Personal info and social media links
- **Projects Section** - Carousel of creative project showcases
- **Tech Stack Section** - Interactive technology categories with real icons
- **Contact Section** - Working contact form with Formspree integration

## Troubleshooting

### Common Issues and Solutions

**Problem: "npm is not recognized"**
- Solution: Node.js is not installed or not in PATH. Reinstall Node.js from nodejs.org

**Problem: "Port 5000 is already in use"**
- Solution: The server will automatically use the next available port (like 5001). Check terminal output for the actual port number.

**Problem: Dependencies installation fails**
- Solution: Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

**Problem: Website shows blank page**
- Solution: Check browser console (F12) for errors. Ensure all dependencies installed correctly.

**Problem: Images not loading**
- Solution: Ensure you have the complete project files including the `attached_assets` folder

### Additional Commands

- **Stop the server**: Press `Ctrl + C` in the terminal
- **Clear terminal**: Type `cls` (Windows) or `clear` (Mac/Linux)
- **Restart server**: Stop with `Ctrl + C`, then run `npm run dev` again

## Project Structure

```
portfolio-website/
├── client/                    # Frontend files
│   ├── src/
│   │   ├── components/       # React components (.tsx)
│   │   ├── components-jsx/   # JSX versions (.jsx)
│   │   ├── pages/           # Page components
│   │   └── index.css        # Styling
├── server/                   # Backend files
├── attached_assets/         # Project images
├── package.json            # Dependencies list
└── SETUP_GUIDE.md          # This guide
```

## Features Included

✅ **Fully Responsive Design** - Works on mobile, tablet, and desktop
✅ **Real Technology Icons** - Authentic brand icons for React, TypeScript, etc.
✅ **Creative Project Images** - AI-generated professional website mockups
✅ **Working Contact Form** - Integrated with Formspree for email handling
✅ **Smooth Animations** - Professional transitions and hover effects
✅ **Modern UI** - Dark theme with glassmorphism effects

## Need Help?

If you encounter any issues:
1. Check the terminal for error messages
2. Try refreshing your browser
3. Restart the development server
4. Ensure Node.js version 18+ is installed

The website is now ready to use and deploy!

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