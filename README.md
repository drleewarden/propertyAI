# Property Investment AI

An AI-powered property analysis and report generation platform built with Next.js, TypeScript, and React.

## Features

- **AI-Powered Property Analysis**: Answer comprehensive questions about properties and get detailed analysis reports
- **Google Docs Export**: Automatically generate professional reports in Google Docs format
- **User Accounts**: Secure authentication with NextAuth 5
- **Family Accounts**: Parents can manage child accounts for collaborative analysis
- **Stripe Payments**: Flexible subscription model with 30-day free trial
- **Mobile-First Design**: Responsive UI built with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Authentication**: NextAuth 5 (next-auth)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **Payments**: Stripe
- **Hosting**: Vercel
- **API**: RESTful with Next.js API Routes

## Prerequisites

- Node.js 20.11+ (or newer compatible version)
- PostgreSQL 12+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd property-investment-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit with your configuration
nano .env.local
```

4. Set up the database:
```bash
# Create PostgreSQL database
createdb property_investment_ai

# Run Prisma migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with initial questions
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/property_investment_ai"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PLAN_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."
```

See `.env.local.example` for a complete list of variables.

## Project Structure

```
app/
├── api/                    # API routes
│   ├── auth/              # Authentication endpoints
│   ├── questions/         # Property questions
│   ├── reports/           # Report generation and management
│   ├── dashboard/         # Dashboard data
│   ├── stripe/            # Stripe payment endpoints
│   └── subscription/      # Subscription management
├── (pages)/               # UI pages
│   ├── home/             # Home page
│   ├── about/            # About page
│   ├── pricing/          # Pricing page
│   ├── questions/        # Question form
│   ├── report/           # Report view
│   ├── signup/           # Sign up page
│   ├── login/            # Login page
│   └── dashboard/        # User dashboard
├── components/            # Reusable components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── stripe.ts         # Stripe helpers
│   └── prisma.ts         # Prisma client
└── prisma/
    └── schema.prisma      # Database schema
```

## Key Features Implementation

### Authentication
- Email/password authentication with bcrypt hashing
- Google OAuth integration
- NextAuth 5 for session management
- Protected routes for authenticated users

### Subscription Management
- 30-day free trial for all new users
- $3/month Pro plan
- Cancel anytime feature
- Trial expiration checking

### Database Schema
- Users with parent-child relationships
- Subscription tracking
- Property storage
- Report generation and storage
- Property answer tracking

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Create a new project and connect your repository
4. Set environment variables in the Vercel dashboard
5. Deploy!

The `vercel.json` file contains deployment configuration.

## Setting Up External Services

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (OAuth consent screen)
5. Copy Client ID and Client Secret to environment variables

### Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from dashboard
3. Create a price for the Pro plan ($3/month)
4. Set up webhook for subscription events
5. Copy keys to environment variables

### OpenAI
1. Create account at [platform.openai.com](https://platform.openai.com/)
2. Get API key
3. Set `OPENAI_API_KEY` in environment variables

## To-Do / Future Features

- [ ] Google Docs API integration for automatic report export
- [ ] OpenAI integration for AI property analysis
- [ ] Stripe webhook handling for subscription events
- [ ] Email notifications for trial expiration
- [ ] Property image upload and analysis
- [ ] Advanced analytics dashboard
- [ ] API documentation
- [ ] Mobile app

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub or contact support.
