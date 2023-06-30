import { Button, Show } from '@/components'
import { Flex, Text } from '@/components/Core'
import useDeviceType from '@/hooks/useDeviceType'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

type PaginationProps = {
  page: number
  setPrev: (page: number) => void
  setNext: (page: number) => void
  isLoading: boolean
  isShowNext: boolean
  isShowPrev: boolean
}

export function Pagination(props: PaginationProps) {
  const { page, setPrev, setNext, isLoading, isShowNext, isShowPrev } = props
  const { isMobile } = useDeviceType()

  const prev = isMobile ? <IoIosArrowBack color='white' size={18} /> : 'Previous'
  const next = isMobile ? <IoIosArrowForward color='white' size={18} /> : 'Next'

  return (
    <Flex
      mb={isMobile ? 20 : 32}
      width='100%'
      alignItems='center'
      gap={isMobile ? 8 : 16}
      justifyContent={isMobile ? 'start' : 'center'}
    >
      <Show when={isShowPrev}>
        <Button
          disabled={isLoading}
          onClick={setPrev}
          variant='secondary'
          size={isMobile ? 'sm' : 'md'}
          minWidth={isMobile ? 'unset' : 90}
        >
          {prev}
        </Button>
      </Show>

      <Text color='gray.100' fontSize={[14, 16]}>
        {page}
      </Text>

      <Show when={isShowNext}>
        <Button
          variant='secondary'
          onClick={setNext}
          disabled={isLoading}
          size={isMobile ? 'sm' : 'md'}
          minWidth={isMobile ? 'unset' : 90}
          data-cy='next-button'
        >
          {next}
        </Button>
      </Show>
    </Flex>
  )
}
