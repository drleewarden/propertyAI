# Setup Guide - Property Investment AI

Complete step-by-step guide to set up the application locally and deploy it to production.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [External Services Setup](#external-services-setup)
5. [Running the Application](#running-the-application)
6. [Vercel Deployment](#vercel-deployment)

## Local Development Setup

### Prerequisites

- **Node.js**: 20.11 or higher
- **PostgreSQL**: 12 or higher
- **npm** or **yarn**
- **Git**

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Copy Environment Variables

```bash
cp .env.local.example .env.local
```

### Step 3: Update Environment Variables

Edit `.env.local` with your actual values. See [Environment Variables](#environment-variables) section.

### Step 4: Setup Database

#### Option A: Using PostgreSQL locally

1. Install PostgreSQL if you haven't already
2. Create a new database:
   ```bash
   createdb property_investment_ai
   ```
3. Run migrations:
   ```bash
   npm run db:migrate
   ```
4. (Optional) Seed with sample questions:
   ```bash
   npm run db:seed
   ```

#### Option B: Using Docker

```bash
docker run --name property-ai-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=property_investment_ai \
  -p 5432:5432 \
  -d postgres:15
```

Then update your `.env.local`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/property_investment_ai"
```

## Environment Variables

Create `.env.local` file in the root directory with the following variables:

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/property_investment_ai"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Optional but Recommended

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PLAN_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Database Setup

### Initialize Prisma

The Prisma schema is already set up. Run migrations:

```bash
# Create and apply migrations
npm run db:migrate

# Or push schema directly
npm run db:push
```

### Seed Sample Data

The application comes with a seed script to populate initial property analysis questions:

```bash
npm run db:seed
```

This will create 15 sample questions covering:
- Property information (address, type, bedrooms, bathrooms, etc.)
- Market information (price, conditions, rental income)
- Financial information (taxes, insurance, maintenance)
- Additional information (conditions, investment goals)

## External Services Setup

### 1. Google OAuth Setup

#### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Search for "Google+ API"
   - Click Enable
4. Create OAuth 2.0 Consent Screen:
   - Go to "Credentials"
   - Click "Create OAuth 2.0 Consent Screen"
   - Select "External" and fill required fields
5. Create OAuth 2.0 Client ID:
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Select "Web application"
   - Add Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Copy Client ID and Client Secret to `.env.local`

### 2. Stripe Setup

#### Create Stripe Account and API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API Keys:
   - Publishable Key (starts with `pk_test_`)
   - Secret Key (starts with `sk_test_`)
3. Create a Product and Price for Pro Plan:
   - Go to Products → Create Product
   - Name: "Pro Plan"
   - Pricing: $3/month (recurring)
   - Copy the Price ID
4. Set up Webhooks (for production):
   - Go to Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhooks`
   - Listen to: `checkout.session.completed`, `customer.subscription.updated`
   - Copy Webhook Signing Secret

5. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PLAN_PRICE_ID="price_..."
   STRIPE_WEBHOOK_SECRET="whsec_..." # Optional, for production
   ```

### 3. OpenAI Setup (Optional)

For AI-powered property analysis:

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `.env.local`:
   ```env
   OPENAI_API_KEY="sk-..."
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Available Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:migrate` - Create and apply database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run prisma:generate` - Generate Prisma client

## Vercel Deployment

### Prerequisites

- GitHub account with repository
- Vercel account (free tier available)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/property-investment-ai.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Set Environment Variables

In Vercel Dashboard:

1. Go to Settings → Environment Variables
2. Add all variables from `.env.local` EXCEPT `NEXTAUTH_URL`
3. For production, add:
   - `NEXTAUTH_URL`: `https://yourdomain.vercel.app`
   - `DATABASE_URL`: Your production PostgreSQL URL (e.g., from Supabase, Railway, or AWS RDS)
   - `STRIPE_SECRET_KEY`: Production Stripe key
   - `STRIPE_PLAN_PRICE_ID`: Production price ID
   - etc.

### Step 4: Configure PostgreSQL

You'll need a PostgreSQL database for production. Options:

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel as `DATABASE_URL`

#### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project with PostgreSQL
3. Get connection URL
4. Add to Vercel as `DATABASE_URL`

#### Option C: AWS RDS

Create a PostgreSQL instance on AWS and get the connection string.

### Step 5: Run Migrations on Vercel

Option 1: Use Vercel's build command (configure in `vercel.json`):

```json
{
  "buildCommand": "npm run build && npx prisma generate && npx prisma migrate deploy"
}
```

Option 2: Manually run:

```bash
# Install Vercel CLI
npm install -g vercel

# Link to your project
vercel link

# Run migrations
vercel env pull  # Get env variables
npx prisma migrate deploy
```

### Step 6: Deploy

Push to GitHub, and Vercel will automatically deploy:

```bash
git push origin main
```

Vercel will:
1. Run `npm install`
2. Run build command
3. Deploy to production

## Troubleshooting

### Database Connection Issues

- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

### NextAuth Issues

- Ensure `NEXTAUTH_SECRET` is set
- Check OAuth redirect URIs match exactly
- Clear cookies and try again

### Stripe Issues

- Use test keys for development
- Switch to live keys for production
- Check webhook configuration for production

### Vercel Deployment Issues

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Check database migrations ran successfully

## Next Steps

1. Add OpenAI integration for AI property analysis
2. Implement Google Docs API for report export
3. Set up email notifications
4. Add analytics
5. Implement webhook handlers for Stripe
6. Add tests (Jest, Playwright)

## Support

For issues, check:
- Application logs: `npm run dev` console output
- Vercel dashboard: Settings → Function Logs
- Prisma errors: Check `.env.local` DATABASE_URL
- NextAuth errors: Check console and network tab

---

Happy deploying! 🚀
