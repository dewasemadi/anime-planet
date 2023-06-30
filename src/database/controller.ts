import { Anime } from '@/services/queries'
import { collections } from './db'

export const getCollections = async () => await collections.toArray()

export const getCollectionById = async (id: number) => await collections.get(id)

export const countTotalCollections = async () => await collections.count()

export const createCollection = async (name: string) => await collections.add({ name, items: [] })

export const deleteCollections = async () => await collections.clear()

export const deleteCollectionById = async (id: number) => await collections.delete(id)

export const renameCollectionById = async (id: number, name: string) => await collections.update(id, { name })

export const addAnimeToCollection = async (ids: number[], anime: Anime | Anime[]) => {
  const isArrayAnime = Array.isArray(anime)

  // helper function to update collection items
  const updateCollectionItems = async (id: number, items: Anime[]) => {
    const collection = await collections.get(id)
    if (!collection) return

    await collections.update(id, { items: [...items] })
  }

  const data: any[] = await Promise.all((ids as number[]).map((id) => collections.get(id)))
  if (!data) return []

  const updatedCollections = [...data]
  const animeIds = isArrayAnime ? (anime as Anime[]).map((item) => item.id) : [(anime as Anime).id]
  updatedCollections.forEach((collection) => {
    collection.items = collection.items.filter((item: Anime) => !animeIds.includes(item.id)) // remove duplicate
  })

  const updatedAnime = isArrayAnime ? [...(anime as Anime[])] : [anime as Anime]
  return await Promise.all(
    updatedCollections.map((collection) => updateCollectionItems(collection.id, [...collection.items, ...updatedAnime]))
  )
}

export const deleteAnimeFromCollectionById = async (id: number, animeId: number) => {
  const data = await collections.get(id)
  if (!data) return []

  await collections.update(id, { items: data.items.filter((item: any) => item.id !== animeId) })
}

export const getAnimeFromCollectionById = async (id: number) => {
  const data = await collections.get(id)
  if (!data) return []

  return data.items
}

export const getAllCollectionByGivenAnimeId = async (animeId: number) => {
  const data = await collections.toArray()
  if (!data) return []

  return data.filter((collection) => collection.items.some((item: any) => item.id === animeId))
}

export const getIsAnimeExistInCollection = async (animeId: number) => {
  const data = await collections.toArray()
  if (!data) return false

  return data.some((collection) => collection.items.some((item: any) => item.id === animeId))
}
