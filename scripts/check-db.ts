#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client'

async function main() {
  const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  
  if (!connectionUrl) {
    console.log('ℹ️  No database connection URL found—skipping DB checks')
    process.exit(0)
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionUrl
      }
    }
  })

  try {
    // Test connectivity
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch (error) {
      console.log('ℹ️  DB not reachable—skipping DB checks')
      process.exit(0)
    }

    console.log('🔍 Running database checks...')

    // 1. Check table existence
    const requiredTables = [
      'User', 'ExpertProfile', 'AvailabilitySlot', 'Booking',
      'Payment', 'Session', 'Review', 'Notification', 'AuditLog'
    ]

    const existingTables = await prisma.$queryRaw<{ table_name: string }[]>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY(${requiredTables})
    `

    const existingTableNames = existingTables.map(t => t.table_name)
    
    for (const tableName of requiredTables) {
      if (!existingTableNames.includes(tableName)) {
        console.error(`❌ Required table "${tableName}" not found`)
        process.exit(1)
      }
    }

    console.log(`✅ All ${requiredTables.length} core tables exist`)

    // 2. Check foreign key delete actions
    const fkConstraints = await prisma.$queryRaw<{
      conname: string
      source_table: string
      referenced_table: string
      confdeltype: string
      def: string
    }[]>`
      SELECT
        c.conname,
        t.relname AS source_table,
        rt.relname AS referenced_table,
        c.confdeltype,
        pg_get_constraintdef(c.oid) AS def
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      JOIN pg_class rt ON rt.oid = c.confrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE c.contype = 'f' AND n.nspname = 'public'
    `

    // Expected SET NULL constraints (confdeltype = 'n')
    const expectedSetNullFKs = [
      { source: 'Notification', target: 'User', column: 'toUserId' },
      { source: 'Notification', target: 'Booking', column: 'bookingId' },
      { source: 'Notification', target: 'Payment', column: 'paymentId' },
      { source: 'Notification', target: 'Session', column: 'sessionId' },
      { source: 'AuditLog', target: 'User', column: 'actorUserId' }
    ]

    for (const expectedFK of expectedSetNullFKs) {
      const matchingConstraint = fkConstraints.find(fk => 
        fk.source_table === expectedFK.source && 
        fk.referenced_table === expectedFK.target &&
        fk.def.toLowerCase().includes(expectedFK.column.toLowerCase())
      )

      if (!matchingConstraint) {
        console.error(`❌ Foreign key constraint not found: ${expectedFK.source}.${expectedFK.column} -> ${expectedFK.target}`)
        process.exit(1)
      }

      if (matchingConstraint.confdeltype !== 'n') {
        const actionMap = { 'a': 'NO ACTION', 'r': 'RESTRICT', 'c': 'CASCADE', 'n': 'SET NULL', 'd': 'SET DEFAULT' }
        console.error(`❌ Wrong DELETE action for ${expectedFK.source}.${expectedFK.column} -> ${expectedFK.target}`)
        console.error(`   Expected: SET NULL, Got: ${actionMap[matchingConstraint.confdeltype] || matchingConstraint.confdeltype}`)
        process.exit(1)
      }
    }

    console.log('✅ All required foreign key constraints have correct ON DELETE SET NULL')

    // 3. Check denormalization sanity
    const bookingCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "Booking"
    `

    if (Number(bookingCount[0].count) === 0) {
      console.log('⚠️  No booking data found—skipping denormalization checks')
    } else {
      const denormMismatches = await prisma.$queryRaw<{
        booking_id: string
        expert_user_id: string
        profile_user_id: string
      }[]>`
        SELECT 
          b.id as booking_id,
          b."expertUserId" as expert_user_id,
          ep."userId" as profile_user_id
        FROM "Booking" b
        JOIN "ExpertProfile" ep ON ep.id = b."expertProfileId"
        WHERE b."expertUserId" != ep."userId"
        LIMIT 5
      `

      if (denormMismatches.length > 0) {
        console.error(`❌ Denormalization mismatch found in Booking.expertUserId:`)
        for (const mismatch of denormMismatches) {
          console.error(`   Booking ${mismatch.booking_id}: expertUserId="${mismatch.expert_user_id}" != ExpertProfile.userId="${mismatch.profile_user_id}"`)
        }
        process.exit(1)
      }

      console.log('✅ Denormalization integrity verified')
    }

    console.log('✅ DB checks passed')

  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ DB check failed:', error.message)
    process.exit(1)
  })
}