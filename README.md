# AnkFin - Smart Money Automation Platform

AnkFin is a smart money automation platform designed to help users automate the allocation of their income into bills, savings, taxes, and investments, based on personalized financial goals.

## Features

- Smart income allocation
- Automated bill payments
- Investment portfolio management
- Tax optimization
- Financial goal tracking
- Bank account integration
- Real-time financial insights

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: NextAuth.js
- Payment Processing: Stripe
- Bank Integration: Plaid

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/ankfin"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```