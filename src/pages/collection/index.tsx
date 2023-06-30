import { useState } from 'react'
import { useRouter } from 'next/router'
import { ROUTES } from '@/constants/routes'
import useDeviceType from '@/hooks/useDeviceType'
import { useLiveQuery } from 'dexie-react-hooks'
import { useGlobalContext } from '@/context/globalContext'
import { Collection as CollectionType } from '@/database/db'
import { Box, Text, CollectionCard, Grid, CreateOrEditCollectionModal } from '@/components'
import { Container, Seo, Empty, Show, Button, Flex, ConfirmationModal } from '@/components'
import { deleteCollectionById, getCollections } from '@/database/controller'

export default function Collection() {
  const router = useRouter()
  const { isMobile } = useDeviceType()
  const { setToast } = useGlobalContext()

  const collections = useLiveQuery(getCollections, [])
  const totalCollection = collections?.length || 0
  const buttonCopy = isMobile ? 'Create' : 'Create new collection'

  const [selectedCollection, setSelectedCollection] = useState<CollectionType | null>(null)
  const [isShowModal, setIsShowModal] = useState({
    create: false,
    edit: false,
    delete: false,
    addAnime: false,
  })

  const deleteCollection = async () => {
    if (!selectedCollection) return setIsShowModal((prev) => ({ ...prev, delete: false }))

    try {
      await deleteCollectionById(selectedCollection?.id)
      setIsShowModal((prev) => ({ ...prev, delete: false }))
      setToast({ isOpen: true, message: 'Collection has been deleted', type: 'success' })
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to delete collection', type: 'error' })
    }
  }

  const modalAddAndEditProps = {
    isOpen: isShowModal.create || isShowModal.edit,
    selectedCollection: selectedCollection,
    onClose: () => {
      setSelectedCollection(null)
      setIsShowModal((prev) => ({ ...prev, create: false, edit: false }))
    },
  }

  return (
    <Container>
      <Seo title='My Collection' />

      <Box pt={32} pb={64}>
        <Show when={totalCollection === 0}>
          <Empty
            text='You don’t have any collection yet.'
            button={
              <Button
                mt={16}
                data-cy='create-collection-button'
                onClick={() => {
                  setSelectedCollection(null)
                  setIsShowModal((prev) => ({ ...prev, create: true }))
                }}
              >
                Create new collection
              </Button>
            }
          />
        </Show>

        <Show when={totalCollection > 0}>
          <Flex alignItems='center' gap={14}>
            <Button
              data-cy='create-collection-button'
              onClick={() => {
                setSelectedCollection(null)
                setIsShowModal((prev) => ({ ...prev, create: true }))
              }}
            >
              {buttonCopy}
            </Button>
            <Text color='gray.500' fontSize={[12, 14, 16]}>
              {totalCollection} Collection
            </Text>
          </Flex>

          <Grid gridTemplateColumns={`repeat(auto-fill, minmax(300px, 1fr))`} gridGap={4} py={32}>
            {collections?.map((item: CollectionType, index: number) => (
              <CollectionCard
                key={index}
                title={item.name}
                totalItems={item.items.length}
                image={isMobile ? item.items?.[0]?.coverImage.medium : item.items?.[0]?.coverImage?.large}
                onClick={() => router.push(ROUTES.COLLECTION_DETAIL(item.id))}
                onDelete={() => {
                  setSelectedCollection(item)
                  setIsShowModal((prev) => ({ ...prev, delete: true }))
                }}
                onEdit={() => {
                  setSelectedCollection(item)
                  setIsShowModal((prev) => ({ ...prev, edit: true }))
                }}
              />
            ))}
          </Grid>
        </Show>

        {/* add or edit */}
        <CreateOrEditCollectionModal {...modalAddAndEditProps} />

        {/* modal delete */}
        <ConfirmationModal
          title={`Delete ${selectedCollection?.name}`}
          description={`Are you sure you’d like to delete ${selectedCollection?.name} collection? It can’t be undone.`}
          isOpen={isShowModal.delete}
          onClose={() => setIsShowModal((prev) => ({ ...prev, delete: false }))}
          onDone={deleteCollection}
        />
      </Box>
    </Container>
  )
}
