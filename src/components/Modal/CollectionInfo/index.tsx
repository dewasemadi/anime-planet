import { Collection } from '@/database/db'
import { useRouter } from 'next/router'
import { ROUTES } from '@/constants/routes'
import useDeviceType from '@/hooks/useDeviceType'
import { Modal, Box, CollectionItem } from '@/components'

type ModalProps = {
  isOpen: boolean
  collection: Collection[] | null
  onClose: () => void
}

export function CollectionInfoModal(props: ModalProps) {
  const { isOpen, collection, onClose } = props
  const { isMobile } = useDeviceType()

  const router = useRouter()

  return (
    <Modal minWidth={600} maxWidth={600} isOpen={isOpen} onClose={onClose} title='Anime Available in This Collection'>
      <Box mt={18} maxHeight={isMobile ? 300 : 500} overflowY='auto'>
        {collection?.map((item, index) => (
          <CollectionItem
            key={index}
            name={item.name}
            totalItems={item.items?.length}
            isSelected={true}
            onDetailClick={() => router.push(ROUTES.COLLECTION_DETAIL(item.id))}
            isExist={false}
          />
        ))}
      </Box>
    </Modal>
  )
}
