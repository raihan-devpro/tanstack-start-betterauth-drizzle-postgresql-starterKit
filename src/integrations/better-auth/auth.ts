import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { dbDrizzle } from '@/db/drizzle-db'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [tanstackStartCookies()],
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
