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
- SMS notifications via Telynx

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: NextAuth.js
- Payment Processing: Stripe
- Bank Integration: Plaid
- SMS: Telynx

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

# Telynx SMS API Configuration
TELYNX_API_KEY="your_telynx_api_key_here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### SMS Configuration

To enable SMS notifications:

1. Sign up for a Telynx account at https://portal.telynx.com/
2. Get your API key from the Telynx portal
3. Add your API key to the `TELYNX_API_KEY` environment variable
4. The app will use your registered US number (+1-856-492-8674) to send welcome SMS messages

## Updating Database Schema and Redeploying

If you make changes to the Prisma schema (e.g., adding a new model):

1. Apply the migration and update your database:
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```
   Replace `<migration_name>` with a descriptive name (e.g., `add_goal_model`).

2. Commit and push the updated migration and schema files:
   ```bash
   git add .
   git commit -m "Add Goal model to Prisma schema"
   git push origin main
   ```

3. Redeploy your app on Netlify (trigger a new deploy from the Netlify dashboard or by pushing to the main branch).