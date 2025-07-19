# Testing Authentication Locally

## 🧪 Test the New Authentication System

Before deploying to production, test the authentication system locally:

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test User Creation

1. Go to `http://localhost:5173/signup`
2. Create a test account with your email
3. The system will automatically assign you a role based on your email:
   - `thisisfrankgonzalez@gmail.com` → Admin
   - `thisisjasongonzalez@gmail.com` → Sourcer
   - Any other email → Client

### 3. Test Authentication Flow

1. **Sign Up**: Create a new account
2. **Sign In**: Test the login functionality
3. **Role-Based Access**: Verify you can only access appropriate pages
4. **Sign Out**: Test the logout functionality

### 4. Test Role-Based Features

**For Client Users:**
- Submit a job request
- View candidates for your jobs
- Access subscription plans

**For Sourcer Users:**
- Browse available jobs
- Claim a job
- Submit candidates

**For Admin Users:**
- Access admin dashboard
- View all users and data
- Manage system settings

### 5. Test RLS Policies

The Row Level Security policies ensure:
- Clients only see their own jobs and candidates
- Sourcers only see unclaimed jobs and their claimed jobs
- Admins can see all data

### 6. Verify User Menu

- Click the user icon in the top-right corner
- Verify it shows your role and email
- Test the sign-out functionality

## 🐛 Common Issues

1. **"Cannot find module" errors**: Run `npm install`
2. **Supabase connection errors**: Check your `.env` file
3. **Authentication not working**: Verify Supabase Auth is enabled
4. **Role not assigned**: Check the database trigger in Supabase

## ✅ Success Indicators

- ✅ Can sign up with any email
- ✅ Can sign in with created account
- ✅ Role is automatically assigned
- ✅ Can only access role-appropriate pages
- ✅ User menu shows correct information
- ✅ Can sign out successfully
- ✅ Data is properly filtered by role

Once these tests pass, you're ready to deploy to production! 