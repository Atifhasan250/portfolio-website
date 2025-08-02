# How to Run Your Portfolio in VS Code - Complete Guide

## Prerequisites
1. **Install Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Verify installation: Open terminal and type `node --version`

2. **Install VS Code**
   - Download from: https://code.visualstudio.com/
   - Install the recommended extensions (VS Code will suggest them)

## Step-by-Step Setup Instructions

### Step 1: Download Your Portfolio Files
1. Download all your portfolio files to a folder on your computer
2. Make sure you have all these folders and files:
   ```
   your-portfolio/
   ├── client/
   ├── server/
   ├── shared/
   ├── package.json
   ├── package-lock.json
   ├── vite.config.ts
   ├── tailwind.config.ts
   └── other config files
   ```

### Step 2: Open Project in VS Code
1. Open VS Code
2. Click "File" → "Open Folder"
3. Select your portfolio folder
4. VS Code will open with your project

### Step 3: Install Dependencies
1. Open the **Terminal** in VS Code:
   - Click "Terminal" → "New Terminal" (or press `Ctrl+`` )
2. Make sure you're in the project root directory
3. Run this command to install all dependencies:
   ```bash
   npm install
   ```
4. Wait for installation to complete (this may take 2-3 minutes)

### Step 4: Set Up Environment Variables (Optional)
1. Create a file called `.env` in the root directory
2. Add any environment variables if needed:
   ```
   NODE_ENV=development
   ```

### Step 5: Start the Development Server

#### Option 1: Use the Windows Batch Files (Easiest for Windows)
**For Windows Command Prompt users:**
- Double-click `start-windows.bat` file in your project folder
- Or in VS Code terminal, run: `start-windows.bat`

**For Windows PowerShell users:**
- Right-click `start-windows.ps1` → "Run with PowerShell"
- Or in VS Code terminal, run: `./start-windows.ps1`

#### Option 2: Manual Commands
**Windows Command Prompt:**
```cmd
set NODE_ENV=development && npx tsx server/index.ts
```

**Windows PowerShell:**
```powershell
$env:NODE_ENV="development"; npx tsx server/index.ts
```

**Mac/Linux:**
```bash
npm run dev
```

#### All Users:
2. You should see output like:
   ```
   9:12:30 AM [express] serving on port 5000
   ```
3. Your portfolio will be available at: `http://localhost:5000`

### Step 6: Open in Browser
1. Open your web browser
2. Go to: `http://localhost:5000`
3. Your portfolio should load with all your content

## Important Notes

### File Structure
- **client/**: Contains your React frontend code
- **server/**: Contains your Express backend code  
- **shared/**: Contains shared TypeScript types
- All your components are in `client/src/components/`

### Making Changes
1. Edit files in VS Code
2. Save your changes (`Ctrl+S`)
3. The browser will automatically refresh with your changes
4. No need to restart the server for most changes

### Contact Form Setup
Your contact form is already configured with Formspree. Messages will be sent to your email: **atifhasan000000@gmail.com**

### Stopping the Server
- Press `Ctrl+C` in the terminal to stop the development server

### Restarting the Server
- If you need to restart, run `npm run dev` again

## Troubleshooting

### If npm install fails:
1. Delete the `node_modules` folder and `package-lock.json`
2. Run `npm install` again

### If the server won't start:
1. Make sure Node.js is installed: `node --version`
2. Make sure you're in the correct directory
3. **Windows users**: Try the manual command:
   ```cmd
   set NODE_ENV=development && npx tsx server/index.ts
   ```
4. **Mac/Linux users**: Try: `npm run dev`

### If changes don't appear:
1. Check the terminal for errors
2. Refresh the browser (`F5`)
3. Clear browser cache (`Ctrl+F5`)

### Common Commands:
- `npm run dev` - Start development server
- `npm install` - Install dependencies
- `npm run build` - Build for production

## VS Code Extensions (Recommended)
Install these extensions for better development experience:
1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **TypeScript Importer**
4. **Auto Rename Tag**
5. **Prettier - Code formatter**

## Your Portfolio Features
✅ Dark theme with glassmorphism design
✅ Google Fonts (Poppins & Montserrat)
✅ Responsive design for all devices
✅ Interactive tech stack with real SVG logos
✅ Working contact form with Formspree
✅ All your personal information and social links
✅ Professional portfolio sections

Your portfolio is production-ready and will work perfectly in VS Code!