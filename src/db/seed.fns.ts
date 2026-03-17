import fs from 'node:fs/promises'
import path from 'node:path'
import { createServerFn } from '@tanstack/react-start'
import { seedController } from './seedController'

const DEFAULT_DATA_FILE = path.join(process.cwd(), 'src/data/data.json')
export async function readJsonFile(filePath: string) {
  console.log('Reading JSON file:', DEFAULT_DATA_FILE)
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

export const startSeed = createServerFn({ method: 'POST' }).handler(
  async () => {
    try {
      await seedController.start()

      return { success: true }
    } catch (error) {
      console.error('❌ Failed to start seed:', error)
      return { success: false }
    }
  },
)

export const stopSeed = createServerFn({ method: 'POST' }).handler(async () => {
  await seedController.stop()
  return { success: true }
})
