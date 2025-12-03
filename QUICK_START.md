# Quick Start Guide - Property Investment AI

Get the application running in 5 minutes!

## Prerequisites

- Node.js 20.11+
- PostgreSQL 12+
- npm or yarn

## Step 1: Environment Setup (1 minute)

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your values (minimum required)
NEXTAUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:password@localhost:5432/property_investment_ai"
```

## Step 2: Database Setup (1 minute)

```bash
# Create PostgreSQL database
createdb property_investment_ai

# Run migrations and seed initial questions
npm run db:migrate
npm run db:seed
```

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 in your browser

## Step 4: Test the App (2 minutes)

### Sign Up
1. Click "Get Started" button
2. Fill in email, password, and name
3. Click "Sign Up"
4. You'll be redirected to the login page
5. Log in with your credentials

### Try Property Analysis
1. Click "Analyze" or go to /questions
2. Answer the property questions
3. Click "Generate AI Report"
4. You'll be taken to your report page

### Check Dashboard
1. Click "Dashboard" in navigation
2. See your free trial status (30 days)
3. View your generated reports

## Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema to database
npm run db:migrate   # Create database migrations
npm run db:seed      # Seed initial questions
```

## File Structure

```
app/                 # Pages and API routes
├── api/            # API endpoints
├── home/           # Home page
├── about/          # About page
├── pricing/        # Pricing page
├── questions/      # Question form
├── report/         # Report view
├── dashboard/      # User dashboard
├── login/          # Login page
└── signup/         # Sign up page

lib/                # Utilities
├── auth.ts         # Auth helpers
├── stripe.ts       # Stripe helpers
└── prisma.ts       # Database client

prisma/             # Database
├── schema.prisma   # Database schema
└── seed.ts         # Initial data

components/         # React components
├── Navigation.tsx  # Nav bar
└── Providers.tsx   # Session provider
```

## Key Features

✅ User authentication (email/password + Google OAuth)
✅ Property analysis questionnaire
✅ AI-powered report generation (stub)
✅ Free 30-day trial
✅ Stripe payment integration ($3/month)
✅ Family account management
✅ Responsive mobile-first design
✅ Database with Prisma ORM

## Test Credentials

After signup, use these to test:
- **Email**: your-email@example.com
- **Password**: your-password

## Environment Variables Explained

```env
DATABASE_URL         # PostgreSQL connection string
NEXTAUTH_SECRET      # Secret for NextAuth sessions
NEXTAUTH_URL         # Application URL
GOOGLE_CLIENT_ID     # Google OAuth (optional)
GOOGLE_CLIENT_SECRET # Google OAuth (optional)
STRIPE_*             # Stripe keys (optional, for payments)
OPENAI_API_KEY       # OpenAI API (optional, for AI)
```

See `.env.local.example` for full list.

## Common Issues

### "Database connection failed"
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists: `createdb property_investment_ai`

### "NextAuth session error"
- Regenerate NEXTAUTH_SECRET: `openssl rand -base64 32`
- Clear browser cookies
- Restart development server

### "Port 3000 in use"
- Kill process: `lsof -ti:3000 | xargs kill -9`
- Or use: `npm run dev -- -p 3001`

### "Prisma migration failed"
- Delete `prisma/migrations` folder
- Run: `npm run db:migrate`
- Run: `npm run db:seed`

## Next Steps

1. **Add Google OAuth**
   - Get credentials from Google Cloud Console
   - Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

2. **Set Up Stripe**
   - Create Stripe account
   - Get API keys
   - Create price for Pro plan ($3/month)
   - Add keys to environment

3. **Implement AI Features**
   - Get OpenAI API key
   - Implement report generation
   - Test with real property data

4. **Deploy to Vercel**
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables
   - Deploy!

## Documentation

- **README.md** - Full project overview
- **SETUP.md** - Detailed setup instructions
- **API.md** - Complete API reference
- **PROJECT_SUMMARY.md** - Project status and roadmap

## Support

If you get stuck:
1. Check the documentation files above
2. Review the error message carefully
3. Check PostgreSQL is running
4. Check environment variables are set
5. Review Next.js/Prisma documentation

## Ready to Build?

The foundation is complete! Next steps are:
- Implement OpenAI integration for AI analysis
- Add Google Docs export
- Set up email notifications
- Add Stripe webhook handlers
- Deploy to production

Good luck! 🚀
