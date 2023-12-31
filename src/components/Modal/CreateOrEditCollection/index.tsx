import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { collectionSchema } from '@/utils/schema'
import { Button, Flex } from '@/components'
import { useRouter } from 'next/router'
import { ROUTES } from '@/constants/routes'
import { Collection } from '@/database/db'
import { joiResolver } from '@hookform/resolvers/joi'
import { useGlobalContext } from '@/context/globalContext'
import { Modal as ModalComponent, TextField } from '@/components'
import { createCollection, renameCollectionById } from '@/database/controller'

type ModalProps = {
  isOpen: boolean
  selectedCollection: Collection | null
  onClose: () => void
}

export function CreateOrEditCollectionModal(props: ModalProps) {
  const router = useRouter()

  const { isOpen, selectedCollection, onClose } = props
  const { setToast } = useGlobalContext()

  const form = useForm({ resolver: joiResolver(collectionSchema) })
  const { handleSubmit, register, formState, reset } = form
  const { errors } = formState

  const onCreate = async (data: any) => {
    try {
      await createCollection(data?.name)
      setToast({ isOpen: true, message: 'Collection created successfully', type: 'success' })
      onResetState()
    } catch (error: any) {
      const isNotUnique = error?.name === 'ConstraintError'
      const message = isNotUnique ? 'Collection name already exist' : 'Failed to create collection'
      setToast({ isOpen: true, message: message, type: 'error' })
    }
  }

  const onUpdate = async (data: any) => {
    if (!selectedCollection) return setToast({ isOpen: true, message: 'Failed to rename collection', type: 'error' })

    try {
      await renameCollectionById(selectedCollection?.id, data?.name)
      setToast({ isOpen: true, message: 'Collection renamed successfully', type: 'success' })
      onResetState()

      const isCollection = router.pathname?.includes(ROUTES.COLLECTION)
      const isIdExist = router.query?.id

      if (isCollection && isIdExist) router.replace(ROUTES.COLLECTION_DETAIL(selectedCollection.id))
    } catch (error) {
      setToast({ isOpen: true, message: 'Failed to rename collection', type: 'error' })
    }
  }

  const onResetState = () => {
    reset()
    onClose()
  }

  useEffect(() => {
    reset({ name: selectedCollection?.name })
  }, [selectedCollection])

  useEffect(() => {
    reset()
  }, [isOpen])

  return (
    <ModalComponent
      {...props}
      minWidth={500}
      data-cy='modal-title'
      title={selectedCollection ? 'Rename Collection' : 'Create Collection'}
    >
      <form onSubmit={handleSubmit(selectedCollection ? onUpdate : onCreate)}>
        <TextField
          name='name'
          errors={errors}
          register={register}
          placeholder='Collection name'
          dataCy='collection-name-text-field'
        />
        <Flex justifyContent='flex-end' gap={8} mt={32}>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' data-cy='save-collection-button'>
            Save
          </Button>
        </Flex>
      </form>
    </ModalComponent>
  )
}
