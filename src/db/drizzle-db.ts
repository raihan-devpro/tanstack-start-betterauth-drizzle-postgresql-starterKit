import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema.ts'

export const dbDrizzle = drizzle(process.env.DATABASE_URL!, { schema })
