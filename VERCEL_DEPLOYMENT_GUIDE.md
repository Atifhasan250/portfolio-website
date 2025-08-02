# Deploy Your Portfolio to Vercel - Complete Guide

## Prerequisites
- GitHub account (free)
- Vercel account (free) - Sign up at https://vercel.com

## Step 1: Prepare Your Project Files

After downloading your portfolio ZIP file:

1. **Extract the ZIP file** to a folder on your computer
2. **Open Command Prompt/Terminal** in that folder
3. **Initialize Git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```

## Step 2: Push to GitHub

1. **Create a new repository** on GitHub:
   - Go to https://github.com
   - Click "New" repository
   - Name it: `portfolio-website` (or any name you prefer)
   - Make it **Public** (required for free Vercel deployment)
   - Don't initialize with README (since you already have files)
   - Click "Create repository"

2. **Connect your local project to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Configure for Vercel Deployment

Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/dist/**",
      "use": "@vercel/static"
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "outputDirectory": "client/dist"
}
```

## Step 4: Update Package.json for Vercel

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run build"
  }
}
```

## Step 5: Deploy to Vercel

### Option A: Using Vercel Website (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository**:
   - Select your `portfolio-website` repository
   - Click "Import"

5. **Configure deployment settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

6. **Environment Variables** (if needed):
   - Add `NODE_ENV` = `production`
   - Add any other environment variables your app needs

7. **Click "Deploy"**

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy your project**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **N**
   - What's your project's name? **portfolio-website**
   - In which directory is your code located? **./`
   - Want to override settings? **N**

## Step 6: Custom Domain (Optional)

After deployment:

1. **Go to your project dashboard** on Vercel
2. **Click "Domains"** tab
3. **Add your custom domain** (if you have one)
4. **Follow DNS configuration** instructions

## Step 7: Automatic Deployments

Your site will automatically redeploy when you:
1. **Make changes** to your code
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push
   ```

Vercel will automatically detect changes and redeploy your site.

## Important Notes

### File Structure for Vercel
```
your-portfolio/
├── client/                 # Frontend React app
│   ├── src/
│   ├── public/
│   └── dist/              # Built files (auto-generated)
├── server/                # Backend API
│   └── index.ts
├── vercel.json           # Vercel configuration
├── package.json
└── vite.config.ts
```

### Environment Variables
If your portfolio uses any secrets or API keys:
1. **Never commit secrets** to GitHub
2. **Add them in Vercel dashboard**:
   - Go to Project Settings → Environment Variables
   - Add variables like `FORMSPREE_API_KEY`, etc.

### Contact Form Configuration
Your Formspree contact form will work automatically. Make sure:
- Email is set to: `atifhasan000000@gmail.com`
- Form endpoint is configured in your React components

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally
- Check build logs in Vercel dashboard

### API Routes Not Working
- Ensure `server/index.ts` exports default function
- Check `vercel.json` configuration
- Verify API routes start with `/api/`

### Static Files Not Loading
- Check `vite.config.ts` base URL configuration
- Ensure assets are in `client/public/` folder
- Verify build output directory is correct

## Your Portfolio URLs

After successful deployment:
- **Production URL**: `https://your-project-name.vercel.app`
- **Custom Domain**: Your custom domain (if configured)

## Performance Optimization

Your portfolio includes:
✅ **Optimized Images**: Properly sized and compressed
✅ **Code Splitting**: Automatic with Vite
✅ **CDN Distribution**: Vercel's global CDN
✅ **Fast Loading**: Optimized React components
✅ **SEO Ready**: Proper meta tags and structure

## Next Steps After Deployment

1. **Test your live site** thoroughly
2. **Share your portfolio URL** with potential employers
3. **Monitor performance** in Vercel dashboard
4. **Update content** as needed - changes auto-deploy

Your portfolio is now live and professional! 🚀