-- AI Rookie Database Schema
-- Copy and paste this into the Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('LEARNER', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'AWAITING_CONFIRMATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'NO_SHOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('REQUIRES_CAPTURE', 'PAID', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM ('IN_APP', 'EMAIL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('BOOKING_CREATED', 'BOOKING_ACCEPTED', 'BOOKING_REJECTED', 'REMINDER_24H', 'REMINDER_1H', 'REMINDER_5M', 'REVIEW_REQUEST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar TEXT,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expert_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    expertise TEXT[] DEFAULT '{}',
    hourly_rate INTEGER NOT NULL,
    currency TEXT DEFAULT 'DKK',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability_slots (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    expert_id TEXT NOT NULL REFERENCES expert_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE,
    specific_date TIMESTAMP WITH TIME ZONE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    learner_id TEXT NOT NULL REFERENCES users(id),
    expert_id TEXT NOT NULL REFERENCES users(id),
    availability_slot_id TEXT NOT NULL REFERENCES availability_slots(id),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status DEFAULT 'PENDING',
    total_amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'DKK',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'DKK',
    capture_on_accept BOOLEAN DEFAULT TRUE,
    status payment_status DEFAULT 'REQUIRES_CAPTURE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    learner_id TEXT NOT NULL REFERENCES users(id),
    expert_id TEXT NOT NULL REFERENCES users(id),
    zoom_meeting_id TEXT,
    zoom_join_url TEXT,
    zoom_start_url TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    giver_id TEXT NOT NULL REFERENCES users(id),
    receiver_id TEXT NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, giver_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channels notification_channel[] DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_bookings_learner_id ON bookings(learner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_expert_id ON bookings(expert_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_availability_slots_expert_id ON availability_slots(expert_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies for now)
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Experts can view their own profiles" ON expert_profiles
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Anyone can view availability slots" ON availability_slots
    FOR SELECT USING (true);

CREATE POLICY "Experts can manage their slots" ON availability_slots
    FOR ALL USING (expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid()::text));

CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid()::text = learner_id OR auth.uid()::text = expert_id);

CREATE POLICY "Learners can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid()::text = learner_id);

CREATE POLICY "Experts can update bookings" ON bookings
    FOR UPDATE USING (auth.uid()::text = expert_id);

-- Similar policies for other tables...
-- (Additional RLS policies can be added as needed)

COMMIT;