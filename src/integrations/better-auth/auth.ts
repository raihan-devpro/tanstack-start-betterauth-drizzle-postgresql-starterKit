import { betterAuth } from 'better-auth'
import { emailOTP } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { dbDrizzle } from '@/db/drizzle-db'
import { env } from '@/env'
import { resend } from '@/integrations/resend/resend'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    tanstackStartCookies(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        const { data, error } = await resend.emails.send({
          from: 'RverseStack <onboarding@resend.dev>',
          to: [email],
          subject: 'Verify Your RverseStack Account',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #2c3e50;">Welcome to RverseStack!</h2>
              <p>Hi there,</p>
              <p>Thank you for creating an account with us. Please verify your email address to complete your registration.</p>
              <p style="font-size: 1.2em; font-weight: bold;">Your verification code is:</p>
              <p style="font-size: 1.5em; font-weight: bold; color: #2c3e50;">${otp}</p>
              <p>This code will expire in 10 minutes.</p>
              <p>If you did not create this account, please ignore this email.</p>
              <br />
              <p>Best regards,</p>
              <p><strong>RverseStack Team</strong></p>
            </div>
          `,
        })
        console.log(data, error)
      },
    }),
  ],
  database: drizzleAdapter(dbDrizzle, {
    provider: 'pg',
  }),
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: true,
        unique: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Auto-generate a username for social sign-in users who don't have one
          if (!user.username) {
            // Derive from name or email prefix, then append random suffix for uniqueness
            const base = user.email
              ? user.email
                  .split('@')[0]
                  .toLowerCase()
                  .replace(/[^a-z0-9_]/g, '')
              : user.name
                  .toLowerCase()
                  .replace(/\s+/g, '_')
                  .replace(/[^a-z0-9_]/g, '')
            const suffix = await Math.random().toString(36).slice(2, 7)
            return {
              data: {
                ...user,
                username: `${base}_${suffix}`,
              },
            }
          }
          return { data: user }
        },
        after: async () => {
          // await dbDrizzle.insert(stream).values({
          //   title: `${user.username}'s stream`,
          //   description: '',
          //   isLive: false,
          //   userId: user.id,
          //   id: crypto.randomUUID(),
          // })
        },
      },
    },
  },
})
