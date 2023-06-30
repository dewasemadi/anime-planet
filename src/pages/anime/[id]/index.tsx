import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ROUTES } from '@/constants/routes'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { Collection } from '@/database/db'
import useDeviceType from '@/hooks/useDeviceType'
import { useLiveQuery } from 'dexie-react-hooks'
import { useGlobalContext } from '@/context/globalContext'
import { GoBookmark, GoBookmarkFill } from 'react-icons/go'
import { Overlay, Flex, BaseButton, AddAnimeToCollectionModal, Empty } from '@/components'
import { Anime, AnimeDetailQueryResult, GET_ANIME_DETAIL } from '@/services/queries'
import { Container, Box, Seo, Loading, Show, Text, CollectionInfoModal, Button } from '@/components'
import { getAllCollectionByGivenAnimeId, getIsAnimeExistInCollection, getCollections } from '@/database/controller'

export default function Anime() {
  const router = useRouter()
  const id = parseInt(router.query.id as string, 10)

  const { isMobile } = useDeviceType()
  const { setToast } = useGlobalContext()

  const collection = useLiveQuery(getCollections, [])
  const [isExistInCollection, setIsExistInCollection] = useState(false)

  const [isShowModal, setIsShowModal] = useState({
    add: false,
    info: false,
  })
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [collectionInfo, setCollectionInfo] = useState<Collection[] | null>(null)

  const {
    data: queryData,
    loading,
    error,
  } = useQuery<AnimeDetailQueryResult>(GET_ANIME_DETAIL, {
    variables: {
      id: id,
    },
    skip: !id,
    errorPolicy: 'all',
  })
  const data = queryData?.Media

  const getIsExistInCollection = async () => {
    try {
      const isExist = await getIsAnimeExistInCollection(id)
      setIsExistInCollection(isExist)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const getCollectionByAnimeId = async () => {
    try {
      const data = await getAllCollectionByGivenAnimeId(id)
      setCollectionInfo(data)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const onBookmarkIconClick = async () => {
    if (isExistInCollection) setIsShowModal((prev) => ({ ...prev, info: true }))
    else setIsShowModal((prev) => ({ ...prev, add: true }))
  }

  const modalProps = {
    isOpen: isShowModal.add,
    collection: collection,
    selectedAnime: selectedAnime,
    setToast: setToast,
    setSelectedAnime: () => {},
    onClose: () => setIsShowModal((prev) => ({ ...prev, add: false })),
  }

  useEffect(() => {
    if (id) getIsExistInCollection()
    if (!!data) setSelectedAnime(data)
  }, [id, data])

  useEffect((): void => {
    if (!router.isReady) return
    if (error && error?.message?.includes('404')) router.replace(ROUTES.NOT_FOUND)
  }, [router, error])

  useEffect(() => {
    getIsExistInCollection()
    getCollectionByAnimeId()
  }, [isShowModal.add, isShowModal.info])

  return (
    <>
      <Seo title={data?.title.romaji} />

      <Box>
        <Show when={!!error}>
          <Empty
            text='Something went wrong. Check your internet connection and try again.'
            button={
              <Button onClick={() => router.reload()} mt={4}>
                Reload
              </Button>
            }
          />
        </Show>
        <Show when={loading}>
          <Loading />
        </Show>

        <Show when={!!data}>
          <Box position='relative' height={250}>
            <Image
              fill
              sizes='100vw'
              placeholder='blur'
              alt={data?.title.romaji || 'banner image'}
              src={data?.bannerImage || '/images/placeholder.png'}
              blurDataURL={data?.bannerImage || '/images/placeholder.png'}
              style={{ objectFit: data?.bannerImage ? 'cover' : 'contain', backgroundColor: '#f8fafb' }}
            />
            <Overlay />
          </Box>

          <Container>
            <Box maxWidth={1200} position='relative'>
              <Image
                placeholder='blur'
                width={isMobile ? 200 : 250}
                height={isMobile ? 300 : 350}
                data-cy='anime-detail-cover-image'
                alt={data?.title.romaji || 'cover image'}
                blurDataURL={data?.bannerImage || '/images/placeholder.png'}
                src={
                  isMobile
                    ? data?.coverImage.medium || '/images/placeholder.png'
                    : data?.coverImage?.large || '/images/placeholder.png'
                }
                style={{
                  top: -200,
                  borderRadius: 10,
                  objectFit: 'cover',
                  position: 'absolute',
                  right: isMobile ? '100%' : 0,
                  transform: isMobile ? 'translateX(100%)' : 'unset',
                  boxShadow: '0 2px 20px rgba(255, 255, 255, 0.2)',
                }}
              />
            </Box>
          </Container>

          <Container>
            <Box pt={isMobile ? 150 : 30} pr={isMobile ? 0 : 300} pb={32}>
              <Flex justifyContent='space-between'>
                <Box>
                  <Text fontSize={[20, 24, 28]} fontWeight='bold' color='gray.100' data-cy='anime-detail-title'>
                    {data?.title.romaji}
                  </Text>

                  <Text color='gray.500' mt={2} fontSize={[14, 16, 16]}>
                    {data?.seasonYear}
                  </Text>
                </Box>

                <Show when={true}>
                  <BaseButton onClick={onBookmarkIconClick} aria-label='collection' data-cy='add-to-collection-icon'>
                    {isExistInCollection && <GoBookmarkFill color='white' size={isMobile ? 24 : 32} />}
                    {!isExistInCollection && <GoBookmark color='white' size={isMobile ? 24 : 32} />}
                  </BaseButton>
                </Show>
              </Flex>

              <Text
                color='gray.500'
                mt={isMobile ? 3 : 4}
                fontSize={[14, 16, 16]}
                dangerouslySetInnerHTML={{ __html: data?.description || '' }}
              />

              <Flex mt={5} gap={isMobile ? 10 : 14} flexWrap='wrap'>
                {data?.genres?.map((genre, index) => (
                  <Text
                    key={index}
                    py={2}
                    px={3}
                    color='gray.500'
                    borderRadius={4}
                    fontSize={[12, 14, 14]}
                    backgroundColor='#20222c'
                    data-cy='anime-detail-genre'
                  >
                    {genre}
                  </Text>
                ))}
              </Flex>
            </Box>
          </Container>
        </Show>

        {/* modal add anime */}
        <AddAnimeToCollectionModal {...modalProps} />

        {/* modal collection info */}
        <CollectionInfoModal
          isOpen={isShowModal.info}
          collection={collectionInfo}
          onClose={() => setIsShowModal((prev) => ({ ...prev, info: false }))}
        />
      </Box>
    </>
  )
}
