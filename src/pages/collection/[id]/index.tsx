import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Anime } from '@/services/queries'
import { ROUTES } from '@/constants/routes'
import useDeviceType from '@/hooks/useDeviceType'
import { useGlobalContext } from '@/context/globalContext'
import { Container, Seo, Show, Empty, Grid, AnimeCard, ConfirmationModal } from '@/components'
import { deleteAnimeFromCollectionById, getAnimeFromCollectionById } from '@/database/controller'

export default function CollectionDetail() {
  const router = useRouter()
  const { isMobile } = useDeviceType()
  const { setToast } = useGlobalContext()

  const [id, setId] = useState<number | null>(null)
  const [anime, setAnime] = useState<Anime[]>([])

  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [isShowModalDelete, setIsShowModalDelete] = useState(false)
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false)

  const deleteAnime = async () => {
    if (!id || !selectedAnime?.id) return setToast({ isOpen: true, message: 'Something went wrong', type: 'error' })

    try {
      await deleteAnimeFromCollectionById(id, selectedAnime?.id)
      setToast({ isOpen: true, message: 'Anime deleted', type: 'success' })
      setIsShowModalDelete(false)
      setIsDeleteSuccess(true)
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to delete anime', type: 'error' })
    }
  }

  useEffect((): any => {
    const getCollectionData = async () => {
      const id = parseInt(router.query.id as string, 10)
      if ((router.isReady && !isNaN(id)) || isDeleteSuccess) {
        try {
          const collection = await getAnimeFromCollectionById(id)
          setAnime(collection)
          setId(id)
          setIsDeleteSuccess(false)
        } catch (error) {
          router.replace(ROUTES.NOT_FOUND)
        }
      }
    }

    getCollectionData()
  }, [router, isDeleteSuccess])

  return (
    <Container>
      <Seo title='My Collection' />

      <Show when={anime?.length === 0}>
        <Empty text='You don’t have any anime in this collection yet' />
      </Show>

      <Show when={!!anime}>
        <Grid gridTemplateColumns={`repeat(auto-fill, minmax(200px, 1fr))`} gridGap={4} py={32}>
          {anime?.map((item: Anime, index: number) => (
            <AnimeCard
              key={index}
              title={item.title.romaji}
              seasonYear={item.seasonYear}
              isExistInCollection={true}
              onCardClick={() => router.push(ROUTES.ANIME_DETAIL(item?.id))}
              image={isMobile ? item.coverImage.medium : item.coverImage.large}
              onRemoveFromCollection={() => {
                setSelectedAnime(item)
                setIsShowModalDelete(true)
              }}
            />
          ))}
        </Grid>
      </Show>

      {/* modal delete */}
      <ConfirmationModal
        title={`Delete ${selectedAnime?.title.romaji}`}
        description={`Are you sure you’d like to delete ${selectedAnime?.title.romaji}? It can’t be undone.`}
        isOpen={isShowModalDelete}
        onClose={() => setIsShowModalDelete(false)}
        onDone={deleteAnime}
      />
    </Container>
  )
}
