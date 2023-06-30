import { Modal } from '../Base'
import { Button, Flex, Text } from '@/components'

type ConfirmationModalProps = {
  isOpen: boolean
  title: string
  description: string
  onDone: () => void
  onClose: () => void
}

export function ConfirmationModal(props: ConfirmationModalProps) {
  const { isOpen, title, description, onDone, onClose } = props

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose} width={500} minWidth='unset'>
      <Text color='gray.100' fontSize={[12, 14, 16]}>
        {description}
      </Text>
      <Flex justifyContent='flex-end' gap={8} mt={32}>
        <Button variant='secondary' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={onDone}>
          Yes
        </Button>
      </Flex>
    </Modal>
  )
}
