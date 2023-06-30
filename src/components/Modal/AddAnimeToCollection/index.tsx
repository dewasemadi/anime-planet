import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ROUTES } from '@/constants/routes'
import { useForm } from 'react-hook-form'
import { Toast } from '@/context/globalContext'
import { useQuery } from '@apollo/client'
import useDeviceType from '@/hooks/useDeviceType'
import { collectionSchema } from '@/utils/schema'
import useDebounce from '@/hooks/useDebounce'
import { Collection } from '@/database/db'
import { joiResolver } from '@hookform/resolvers/joi'
import { Anime, AnimeQueryResult, GET_ANIME } from '@/services/queries'
import { createCollection, addAnimeToCollection } from '@/database/controller'
import { CollectionItem, Empty, AnimeItem, AnimeItemSkeleton } from '@/components'
import { Show, Modal, Text, Flex, TextField, Box, Button, ConfirmationModal } from '@/components'

enum STEP {
  SELECT_ANIME,
  SELECT_COLLECTION,
}

type ModalProps = {
  isOpen: boolean
  collection: Collection[] | undefined
  selectedAnime: Anime | null
  onClose: () => void
  setToast: (toast: Toast) => void
  setSelectedAnime: (anime: Anime | null) => void
}

export function AddAnimeToCollectionModal(props: ModalProps) {
  const router = useRouter()
  const { isMobile } = useDeviceType()

  const { isOpen, collection, selectedAnime, setSelectedAnime, setToast, onClose } = props
  const totalCollection = collection?.length || 0

  const [isShowConfirmationModal, setIsShowConfirmationModal] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<Collection[]>([])
  const [step, setStep] = useState(STEP.SELECT_ANIME)

  const [isShowCreateCollection, setIsShowCreateCollection] = useState(false)
  const isUnSelect = selectedCollection?.length === 0

  const [selectedAnimeList, setSelectedAnimeList] = useState<Anime[]>([])
  const [search, setSearch] = useState<string>('')
  const debounceSearch = useDebounce(search, 500)

  const isMultiple = Array.isArray(selectedAnime)
  const singleAnime = !selectedAnime ? 'Add to Collection' : `Add "${selectedAnime?.title?.romaji}" to Collection`
  const modalTitle = isMultiple ? 'Add to Collection' : singleAnime

  const [data, setData] = useState<Anime[] | null>(null)
  const { data: queryData, loading } = useQuery<AnimeQueryResult>(GET_ANIME, {
    variables: {
      page: null,
      perPage: null,
      search: debounceSearch,
    },
    skip: !search,
  })

  const form = useForm({ resolver: joiResolver(collectionSchema) })
  const { handleSubmit, register, formState, reset } = form
  const { errors } = formState

  const onModalClose = () => {
    setSelectedCollection([])
    setSelectedAnime(null)
    setSelectedAnimeList([])
    onClose()
  }

  const isAnimeAdded = (anime: Anime) => selectedAnimeList.some((selectedItem) => selectedItem.id === anime.id)
  const isCollectionSelected = (id: number) => selectedCollection.some((selectedItem) => selectedItem.id === id)

  const isAnimeAddedToCollectionById = (id: number) => {
    if (!collection) return false

    const data = collection.find((collection) => collection.id === id)
    if (!data) return false

    return data.items.some((item) => item.id === selectedAnime?.id)
  }

  const onAnimeClick = (anime: Anime) => {
    if (isAnimeAdded(anime)) {
      setSelectedAnimeList(selectedAnimeList.filter((selectedItem) => selectedItem !== anime))
      return
    }

    setSelectedAnimeList([...selectedAnimeList, anime])
  }

  const onCollectionClick = (collection: Collection) => {
    if (isCollectionSelected(collection.id)) {
      setSelectedCollection(selectedCollection.filter((selectedItem) => selectedItem !== collection))
      return
    }

    setSelectedCollection([...selectedCollection, collection])
  }

  const onCreate = async (data: any) => {
    try {
      await createCollection(data?.name)
      reset()
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to create collection', type: 'warning' })
    }
  }

  const onAddToCollection = async () => {
    const animeData = selectedAnime || selectedAnimeList

    try {
      const anime = selectedAnime ? [selectedAnime] : selectedAnimeList
      const animeIds = anime.map((anime) => anime.id)

      const collectionIds = selectedCollection.map((anime) => anime.id)
      await addAnimeToCollection(collectionIds, animeData)
      setToast({ isOpen: true, message: 'Success add anime to collection', type: 'success' })
      onModalClose()
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to add anime to collection', type: 'warning' })
    }
  }

  useEffect(() => {
    setIsShowCreateCollection(false)
  }, [selectedAnime])

  useEffect(() => {
    if (!!queryData) setData(queryData.Page.media)
  }, [queryData])

  useEffect(() => {
    setSearch('')
    setData(null)
    setSelectedAnimeList([])

    if (selectedAnime) setStep(STEP.SELECT_COLLECTION)
    else setStep(STEP.SELECT_ANIME)
  }, [isOpen])

  useEffect(() => {
    setData(null)
  }, [debounceSearch])

  return (
    <Modal
      minWidth={600}
      maxWidth={600}
      isOpen={isOpen}
      onClose={onModalClose}
      title={step === STEP.SELECT_ANIME ? 'Search and Select Anime' : modalTitle}
    >
      {/* select anime step */}
      <Show when={step === STEP.SELECT_ANIME}>
        <TextField
          name='search'
          value={search}
          placeholder='Type anime name here'
          onChange={(e) => setSearch(e.target.value)}
        />

        <Show when={(data?.length === 0 || !data) && !loading}>
          <Text color='gray.500' fontSize={[12, 14, 14]} mt={18} textAlign='end'>
            {selectedAnimeList?.length} anime selected
          </Text>
          <Empty text='No anime found' mt={20} height='fit-content' />
        </Show>

        <Box mt={18} maxHeight={isMobile ? 300 : 500} overflowY='auto'>
          <Show when={loading}>
            {Array.from({ length: 3 }).map((_, index) => (
              <AnimeItemSkeleton key={index} />
            ))}
          </Show>

          <Show when={!!data && data?.length > 0}>
            <Flex alignItems='center' justifyContent='space-between'>
              <Text color='gray.300' mb={18}>
                Found {data?.length} anime
              </Text>
              <Text color='gray.500' fontSize={[12, 14, 14]}>
                {selectedAnimeList?.length} anime selected
              </Text>
            </Flex>

            {data?.map((item, index: number) => (
              <AnimeItem
                key={index}
                title={item.title.romaji}
                seasonYear={item?.seasonYear}
                isSelected={isAnimeAdded(item)}
                onClick={() => onAnimeClick(item)}
                image={isMobile ? item.coverImage.medium : item.coverImage.large}
              />
            ))}
          </Show>
        </Box>

        <Show when={(!!data && data?.length > 0) || selectedAnimeList?.length > 0}>
          <Button onClick={() => setStep(STEP.SELECT_COLLECTION)} ml='auto' mt={18}>
            Next
          </Button>
        </Show>
      </Show>

      {/* select collection step */}
      <Show when={step === STEP.SELECT_COLLECTION}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Button
            variant='text'
            onClick={() => {
              setIsShowCreateCollection(!isShowCreateCollection)
              reset()
            }}
          >
            {isShowCreateCollection ? 'Cancel' : 'Create Collection'}
          </Button>
          <Show when={totalCollection > 0}>
            <Text color='gray.500' fontSize={[12, 14, 14]}>
              {totalCollection} Collection
            </Text>
          </Show>
        </Flex>

        <Show when={isShowCreateCollection}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Flex gap={8} mt={18}>
              <TextField placeholder='Collection Name' name='name' register={register} errors={errors} />
              <Button type='submit' height='fit-content' style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                Save
              </Button>
            </Flex>
          </form>
        </Show>

        <Show when={totalCollection === 0}>
          <Empty text='You don’t have any collection yet.' mt={20} height='fit-content' />
        </Show>

        <Show when={!!collection && totalCollection > 0}>
          <Box mt={18} maxHeight={isMobile ? 300 : 500} overflowY='auto'>
            {collection?.map((item, index) => (
              <CollectionItem
                key={index}
                name={item.name}
                totalItems={item.items?.length}
                isSelected={isCollectionSelected(item.id)}
                onDetailClick={() => router.push(ROUTES.COLLECTION_DETAIL(item.id))}
                isExist={isAnimeAddedToCollectionById(item.id)}
                onCardClick={() => {
                  const isExist = isAnimeAddedToCollectionById(item.id)
                  if (isExist) return
                  onCollectionClick(item)
                }}
              />
            ))}
          </Box>

          <Flex justifyContent={isUnSelect ? 'space-between' : 'flex-end'} alignItems='center' gap={8} mt={18}>
            <Show when={isUnSelect}>
              <Text color='gray.500' fontSize={[12, 14, 14]}>
                Select at least 1 collection
              </Text>
            </Show>
            <Show when={!isUnSelect}>
              <Button variant='text' onClick={() => setSelectedCollection([])} style={{ marginRight: 'auto' }}>
                <Text color='gray.500' fontSize={[12, 14, 14]} style={{ textDecoration: 'underline' }}>
                  Unselect all
                </Text>
              </Button>
            </Show>
            <Flex gap={8}>
              <Button variant='secondary' onClick={selectedAnime ? onModalClose : () => setStep(STEP.SELECT_ANIME)}>
                {selectedAnime ? 'Cancel' : 'Back'}
              </Button>
              <Button onClick={onAddToCollection} isDisabled={isUnSelect}>
                Save
              </Button>
            </Flex>
          </Flex>
        </Show>
      </Show>

      {/* confirmation modal */}
      <ConfirmationModal
        title='Anime Already Added to Collection'
        description='Are you sure want to add this/these anime to selected collection? This will overwrite the existing anime in the collection.'
        isOpen={isShowConfirmationModal}
        onClose={() => setIsShowConfirmationModal(false)}
        onDone={() => setIsShowConfirmationModal(false)}
      />
    </Modal>
  )
}
