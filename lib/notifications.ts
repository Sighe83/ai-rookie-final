import { db } from './db'
import { NotificationType, NotificationChannel } from '@prisma/client'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export interface NotificationTemplate {
  title: string
  message: string
  emailSubject?: string
  emailBody?: string
}

export const notificationTemplates: Record<NotificationType, NotificationTemplate> = {
  BOOKING_CREATED: {
    title: 'Ny booking oprettet',
    message: 'Din booking er oprettet og afventer godkendelse fra eksperten.',
    emailSubject: 'Booking oprettet - Afventer godkendelse',
    emailBody: 'Din booking er oprettet og afventer godkendelse fra eksperten. Du vil modtage en bekræftelse når bookingen er godkendt.',
  },
  BOOKING_ACCEPTED: {
    title: 'Booking godkendt',
    message: 'Din booking er blevet godkendt! Du vil snart modtage et Zoom-link.',
    emailSubject: 'Booking godkendt - Zoom-link følger',
    emailBody: 'Din booking er blevet godkendt! Du vil snart modtage et Zoom-link til din session.',
  },
  BOOKING_REJECTED: {
    title: 'Booking afvist',
    message: 'Din booking er desværre blevet afvist. Betalingen er blevet refunderet.',
    emailSubject: 'Booking afvist - Refundering behandles',
    emailBody: 'Din booking er desværre blevet afvist. Betalingen vil blive refunderet inden for 3-5 arbejdsdage.',
  },
  REMINDER_24H: {
    title: 'Påmindelse: Session om 24 timer',
    message: 'Du har en session planlagt om 24 timer.',
    emailSubject: 'Påmindelse: Session i morgen',
    emailBody: 'Du har en session planlagt om 24 timer. Husk at forberede dig!',
  },
  REMINDER_1H: {
    title: 'Påmindelse: Session om 1 time',
    message: 'Du har en session planlagt om 1 time.',
    emailSubject: 'Påmindelse: Session om 1 time',
    emailBody: 'Du har en session planlagt om 1 time. Sørg for at have Zoom klar!',
  },
  REMINDER_5M: {
    title: 'Påmindelse: Session om 5 minutter',
    message: 'Din session starter om 5 minutter. Klik på Zoom-linket for at deltage.',
    emailSubject: 'Påmindelse: Session starter nu',
    emailBody: 'Din session starter om 5 minutter. Klik på Zoom-linket for at deltage.',
  },
  REVIEW_REQUEST: {
    title: 'Bedøm din session',
    message: 'Hvordan var din session? Giv din bedømmelse og hjælp andre.',
    emailSubject: 'Bedøm din session',
    emailBody: 'Hvordan var din session? Vi vil værdsætte din bedømmelse for at hjælpe andre brugere.',
  },
}

export async function createNotification({
  userId,
  type,
  channels = [NotificationChannel.IN_APP],
  customTitle,
  customMessage,
}: {
  userId: string
  type: NotificationType
  channels?: NotificationChannel[]
  customTitle?: string
  customMessage?: string
}) {
  const template = notificationTemplates[type]
  
  const notification = await db.notification.create({
    data: {
      userId,
      type,
      title: customTitle || template.title,
      message: customMessage || template.message,
      channels,
    },
    include: {
      user: true,
    },
  })

  // Send email if email channel is enabled
  if (channels.includes(NotificationChannel.EMAIL) && notification.user.email) {
    try {
      await sendEmail({
        to: notification.user.email,
        subject: template.emailSubject || template.title,
        body: template.emailBody || template.message,
      })

      await db.notification.update({
        where: { id: notification.id },
        data: { sentAt: new Date() },
      })
    } catch (error) {
      console.error('Error sending email:', error)
      await db.notification.update({
        where: { id: notification.id },
        data: { errorLog: String(error) },
      })
    }
  }

  return notification
}

async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">AI Rookie</h1>
        <p>${body}</p>
        <hr style="margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px;">
          Dette er en automatisk e-mail fra AI Rookie. Svar ikke på denne e-mail.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function scheduleReminders(bookingId: string, scheduledAt: Date) {
  // In a real app, you would use a job queue like Bull or Agenda.js
  // For now, we'll just create the notification records
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { learner: true, expert: true },
  })

  if (!booking) return

  const reminder24h = new Date(scheduledAt.getTime() - 24 * 60 * 60 * 1000)
  const reminder1h = new Date(scheduledAt.getTime() - 60 * 60 * 1000)
  const reminder5m = new Date(scheduledAt.getTime() - 5 * 60 * 1000)

  // Schedule reminders for both learner and expert
  const users = [booking.learner, booking.expert]
  
  for (const user of users) {
    // Schedule 24h reminder
    if (reminder24h > new Date()) {
      // In production, schedule this job
      console.log(`Schedule 24h reminder for ${user.email} at ${reminder24h}`)
    }
    
    // Schedule 1h reminder
    if (reminder1h > new Date()) {
      // In production, schedule this job
      console.log(`Schedule 1h reminder for ${user.email} at ${reminder1h}`)
    }
    
    // Schedule 5m reminder
    if (reminder5m > new Date()) {
      // In production, schedule this job
      console.log(`Schedule 5m reminder for ${user.email} at ${reminder5m}`)
    }
  }
}