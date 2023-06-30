import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { RiDeleteBinLine } from 'react-icons/ri'
import { AiOutlineEdit } from 'react-icons/ai'
import { ROUTES } from '@/constants/routes'
import useDeviceType from '@/hooks/useDeviceType'
import { BiArrowBack } from 'react-icons/bi'
import { Collection } from '@/database/db'
import { useTheme } from '@emotion/react'
import { useGlobalContext } from '@/context/globalContext'
import { Box, BaseButton, Flex, TextWithEllipsis } from '@/components/Core'
import { getCollectionById, deleteCollections } from '@/database/controller'
import { CreateOrEditCollectionModal, Button, Show, ConfirmationModal, Text } from '@/components'

export function Header() {
  const router = useRouter()
  const { isMobile } = useDeviceType()
  const theme = useTheme()

  const { setPage, setToast } = useGlobalContext()
  const [isShowModal, setIsShowModal] = useState({
    deleteAll: false,
    edit: false,
  })

  const [collection, setCollection] = useState<Collection | null>(null)
  const isCollection = router?.pathname?.includes(ROUTES.COLLECTION)
  const header = isCollection && !!collection ? collection.name : isCollection ? 'My Collection' : 'Anime Planet'

  const onLogoClick = () => {
    if (isCollection) return
    setPage(1)
    router.push(isCollection ? ROUTES.COLLECTION : ROUTES.HOME)
  }

  const deleteAllCollection = async () => {
    try {
      await deleteCollections()
      setToast({ isOpen: true, message: 'All collection has been deleted', type: 'success' })
      setIsShowModal((prev) => ({ ...prev, deleteAll: false }))
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to delete all collection', type: 'error' })
    }
  }

  const modalCreateAndEditProps = {
    isOpen: isShowModal.edit,
    selectedCollection: collection,
    onClose: () => setIsShowModal((prev) => ({ ...prev, edit: false })),
  }

  useEffect((): any => {
    const id = parseInt(router.query.id as string, 10)
    if (!router.isReady || isNaN(id)) return

    const getCollectionData = async () => {
      try {
        const collection = await getCollectionById(id)
        setCollection(collection)
      } catch (error) {
        router.replace(ROUTES.NOT_FOUND)
      }
    }

    if (isCollection && id) getCollectionData()
  }, [router])

  useEffect(() => {
    setCollection(null)
  }, [router.pathname])

  return (
    <Box
      py={14}
      top={0}
      width='100%'
      zIndex={100}
      px={[14, 24, 32]}
      position='sticky'
      backgroundColor='secondary.main'
      borderBottom='1px solid #252833'
    >
      <Flex maxWidth={1200} justifyContent='space-between' alignItems='center' m='auto'>
        <Flex alignItems='center' gap={24}>
          <Show when={isCollection}>
            <BaseButton onClick={() => router.back()} aria-label='back'>
              <BiArrowBack color='white' size={isMobile ? 18 : 24} />
            </BaseButton>
          </Show>

          <Flex alignItems='center' gap={12}>
            <TextWithEllipsis
              color='gray.100'
              fontWeight={600}
              onClick={onLogoClick}
              fontSize={[18, 24, 32]}
              style={{ cursor: 'pointer' }}
              maxWidth={isMobile ? 200 : 500}
            >
              {header}
            </TextWithEllipsis>

            <Show when={isCollection && !!collection}>
              <BaseButton onClick={() => setIsShowModal((prev) => ({ ...prev, edit: true }))} aria-label='edit'>
                <AiOutlineEdit color='white' size={isMobile ? 18 : 24} />
              </BaseButton>
            </Show>
          </Flex>
        </Flex>

        <Show when={!isCollection}>
          <Button onClick={() => router.push(ROUTES.COLLECTION)} variant='text'>
            <Text color='gray.100' fontSize={[14, 16, 18]} style={{ textDecoration: 'underline' }}>
              My Collection
            </Text>
          </Button>
        </Show>

        <Show when={router.pathname === ROUTES.COLLECTION}>
          <BaseButton
            onClick={() => setIsShowModal((prev) => ({ ...prev, deleteAll: true }))}
            aria-label='delete all collection'
          >
            <RiDeleteBinLine color={theme.colors.danger.main} size={22} />
          </BaseButton>
        </Show>
      </Flex>

      {/* edit modal */}
      <CreateOrEditCollectionModal {...modalCreateAndEditProps} />

      {/* modal delete all */}
      <ConfirmationModal
        title='Delete All Collection'
        description='Are you sure you’d like to delete all collection? It can’t be undone.'
        isOpen={isShowModal.deleteAll}
        onClose={() => setIsShowModal((prev) => ({ ...prev, deleteAll: false }))}
        onDone={deleteAllCollection}
      />
    </Box>
  )
}
