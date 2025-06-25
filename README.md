# AnkFin - A Personal CFO In Your pockets

Think of it as an AI-powered CFO in your pocket, that manages your cash flow, bills, and goals automatically. Ankfin actually thinks ahead for you by preserving your present financial situation, protects your goals, and helps you realize your future. We're not building a dashboard or another budget app. It's the financial brain that thinks, plans, and protects your money automatically. Takes in consideration of financial reality, makes decisions, and protects users in real time.

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