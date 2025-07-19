# Deployment Guide - Super Recruiter Platform

## 🚀 Quick Deployment Steps

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `super-recruiter-platform`
4. Make it **Public** (for Netlify free tier)
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### 2. Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your project directory:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/super-recruiter-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to Netlify

1. Go to [Netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your `super-recruiter-platform` repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

### 4. Environment Variables

After deployment, add these environment variables in Netlify:

1. Go to Site settings → Environment variables
2. Add these variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 5. Supabase Setup

1. Go to your Supabase project dashboard
2. Apply the database migrations:
   ```bash
   # In your local project directory
   npx supabase db push
   ```
3. Set up authentication providers in Supabase Auth settings
4. Configure your domain in Supabase Auth → URL Configuration

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Important Notes

- **Authentication**: The app now uses real Supabase authentication
- **RLS Policies**: Database has proper Row Level Security
- **Role-Based Access**: Users can only see data appropriate for their role
- **Environment Variables**: Make sure to set up all required environment variables

## 🐛 Troubleshooting

### Common Issues:

1. **Build fails**: Check that all dependencies are installed
2. **Authentication not working**: Verify Supabase environment variables
3. **Database errors**: Ensure RLS policies are applied
4. **Routing issues**: Check that Netlify redirects are configured

### Support:

- Check the browser console for errors
- Verify Supabase connection in the dashboard
- Test authentication flow locally first 