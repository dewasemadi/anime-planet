import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { IoIosAdd } from 'react-icons/io'
import { ROUTES } from '@/constants/routes'
import { useLiveQuery } from 'dexie-react-hooks'
import useDeviceType from '@/hooks/useDeviceType'
import { getCollections } from '@/database/controller'
import { useGlobalContext } from '@/context/globalContext'
import { Show, FloatingButton, Pagination } from '@/components'
import { Anime, AnimeQueryResult, GET_ANIME } from '@/services/queries'
import { AnimeCard, AnimeCardSkeleton, Container, Grid, Seo, AddAnimeToCollectionModal } from '@/components'

export default function Home() {
  const router = useRouter()
  const { isMobile } = useDeviceType()

  const { page, setPage, setToast } = useGlobalContext()
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)

  const [data, setData] = useState<Anime[]>([])
  const [isShowModal, setIsShowModal] = useState(false)
  const collection = useLiveQuery(getCollections, [])

  const { data: queryData, loading } = useQuery<AnimeQueryResult>(GET_ANIME, {
    variables: {
      page: page,
      perPage: 10,
      search: null,
    },
  })

  const isAnimeExistInCollection = (animeId: number) => {
    if (!collection) return false
    return collection.some((collection) => collection.items.some((item: any) => item.id === animeId))
  }

  const modalProps = {
    isOpen: isShowModal,
    collection: collection,
    selectedAnime: selectedAnime,
    setToast: setToast,
    setSelectedAnime: setSelectedAnime,
    onClose: () => setIsShowModal(false),
  }

  useEffect(() => {
    setData([])
  }, [page])

  useEffect(() => {
    if (!!queryData) setData(queryData.Page.media)
  }, [queryData])

  return (
    <Container>
      <Seo />

      <Grid gridTemplateColumns={`repeat(auto-fill, minmax(200px, 1fr))`} gridGap={4} py={32}>
        <Show when={loading}>
          {Array.from({ length: 10 }).map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))}
        </Show>

        <Show when={!!data}>
          {data.map((item: Anime, index: number) => (
            <AnimeCard
              key={index}
              title={item.title.romaji}
              seasonYear={item?.seasonYear}
              image={isMobile ? item.coverImage.medium : item.coverImage.large}
              isExistInCollection={isAnimeExistInCollection(item?.id)}
              onCardClick={() => router.push(ROUTES.ANIME_DETAIL(item?.id))}
              onAddToCollection={() => {
                setIsShowModal(true)
                setSelectedAnime(item)
              }}
            />
          ))}
        </Show>
      </Grid>

      <Pagination
        page={page}
        isLoading={loading}
        setPrev={() => setPage(page - 1)}
        setNext={() => setPage(page + 1)}
        isShowPrev={page > 1}
        isShowNext={queryData?.Page?.pageInfo?.hasNextPage || loading}
      />

      <FloatingButton onClick={() => setIsShowModal(true)}>
        <IoIosAdd color='white' size={isMobile ? 28 : 36} />
      </FloatingButton>

      <AddAnimeToCollectionModal {...modalProps} />
    </Container>
  )
}
