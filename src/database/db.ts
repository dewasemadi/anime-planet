import Dexie from 'dexie'
import { Anime } from '@/services/queries'

export type Collection = {
  id: number
  name: string
  items: Anime[]
}

const database = new Dexie('Database')
database.version(1).stores({
  collections: '++id, &name, *items',
})

export const collections = database.table('collections')
export default database
