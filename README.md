# AI Rookie

A comprehensive platform connecting learners with expert developers for personalized coding sessions.

## Features

- **User Authentication**: Magic link and Google OAuth login
- **Role-based Access**: Separate interfaces for learners and experts
- **Expert Profiles**: Detailed profiles with expertise, rates, and availability
- **Booking System**: Full booking lifecycle with payment authorization
- **Payment Processing**: Stripe integration with manual capture
- **Zoom Integration**: Automatic meeting creation with waiting rooms
- **Notification System**: In-app and email notifications
- **Review System**: Post-session reviews and ratings
- **Admin Dashboard**: Booking and payment management
- **Responsive Design**: Mobile-first design system

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Payments**: Stripe with manual capture
- **Video Meetings**: Zoom API
- **Styling**: Tailwind CSS + Radix UI
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Monitoring**: Sentry
- **Email**: Nodemailer
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account
- Stripe account
- Zoom Pro account

### Environment Setup

1. Clone and install dependencies:
```bash
git clone <repository>
cd ai-rookie-final
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Configure your `.env.local`:

```env
# Database - Supabase Connections
DATABASE_URL="postgresql://pooled-connection-url"      # Pooled (runtime queries)
DIRECT_URL="postgresql://direct-connection-url"        # Direct (migrations only)

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-key"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Zoom
ZOOM_CLIENT_ID="your-zoom-client-id"
ZOOM_CLIENT_SECRET="your-zoom-client-secret"
ZOOM_ACCOUNT_ID="your-zoom-account-id"

# Auth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Sentry
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-public-sentry-dsn"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Database Setup

**Important**: This project uses Supabase with both pooled and direct connections:

- `DATABASE_URL`: Pooled connection for runtime queries (better performance)
- `DIRECT_URL`: Direct connection for migrations (required by Prisma)

Both URLs can be found in your Supabase project settings under Database → Connection pooling.

1. Run database migrations:
```bash
npm run db:migrate
```

**Note**: Database-level constraints (e.g., `endAt > startAt`, `rating 1..5`) should be added via raw SQL migrations if required, as Prisma schema doesn't support `@@check` directives.

2. Generate Prisma client:
```bash
npm run db:generate
```

3. Seed the database with test data:
```bash
npm run db:seed
```

### Development

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)

3. View database with Prisma Studio:
```bash
npm run db:studio
```

## Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript type checking

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with test data
- `npm run db:reset` - Reset database and reseed

### Testing
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with Playwright UI

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
ai-rookie-final/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── (routes)/          # Page routes
├── components/            # React components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication helpers
│   ├── db.ts             # Database connection
│   ├── stripe.ts         # Stripe integration
│   ├── zoom.ts           # Zoom integration
│   └── notifications.ts   # Notification system
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seed script
├── e2e/                  # E2E tests
└── src/test/             # Test utilities
```

## Key Features Implementation

### Authentication Flow
1. User enters email
2. Magic link sent via Supabase Auth
3. First-time users select role (learner/expert)
4. Automatic user creation in database

### Booking Flow
1. Learner browses experts
2. Selects available time slot
3. Payment authorized (not captured)
4. Expert receives notification
5. Expert accepts/rejects booking
6. If accepted: payment captured + Zoom meeting created
7. If rejected: payment authorization released

### Payment System
- Stripe payment intents with manual capture
- Authorization on booking creation
- Capture only after expert acceptance
- Automatic refunds for cancellations
- Webhook handling for payment status updates

### Notification System
- Template-based notifications
- Multiple channels (in-app, email)
- Scheduled reminders (24h, 1h, 5min before session)
- Error logging and retry mechanisms

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - Magic link login

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/[id]` - Update booking status
- `DELETE /api/bookings/[id]` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/capture` - Capture payment
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Experts
- `GET /api/experts` - List experts
- `GET /api/experts/[id]` - Get expert details
- `GET /api/experts/[id]/availability` - Get availability slots

## Database Schema

### Key Models
- **User**: Basic user information with role
- **ExpertProfile**: Expert-specific data (rates, bio, expertise)
- **AvailabilitySlot**: Expert availability (recurring + exceptions)
- **Booking**: Booking details and status
- **Payment**: Payment tracking with Stripe IDs
- **Session**: Zoom meeting information
- **Review**: Post-session reviews
- **Notification**: System notifications
- **AuditLog**: Activity logging

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Business logic testing
- Database model testing

### Integration Tests
- API endpoint testing
- Payment flow testing
- Zoom integration testing

### E2E Tests
- Complete booking flow
- Authentication flow
- Payment and refund flow
- Notification delivery

## Deployment

### Production Setup
1. Set up production database
2. Configure environment variables
3. Set up Stripe webhooks
4. Configure Zoom app
5. Set up Sentry monitoring
6. Configure SMTP for emails

### Environment Variables
Ensure all production environment variables are configured with production values.

### Database Migrations
```bash
npx prisma migrate deploy
```

## Monitoring and Maintenance

### Health Checks
- `/api/health` - Application health endpoint
- Database connectivity checks
- External service status

### Error Tracking
- Sentry integration for error monitoring
- Client and server-side error tracking
- Performance monitoring

### Logging
- Audit logs for all critical actions
- Payment transaction logging
- User activity tracking

## Security Considerations

- Role-based access control
- Secure payment handling
- No sensitive data in client
- CSRF protection
- Rate limiting on API endpoints
- Secure cookie handling

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions, please contact the development team.
