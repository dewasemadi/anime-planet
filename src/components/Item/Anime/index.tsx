import 'react-loading-skeleton/dist/skeleton.css'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import useDeviceType from '@/hooks/useDeviceType'
import { Box, Flex, Text } from '@/components/Core'

const StyledFlex = styled(Flex)`
  cursor: pointer !important;
  transition: all 0.2s ease-in-out;

  :hover {
    border: 1px solid #095ae5;
    transition: all 0.2s ease-in-out;
  }
`

type CardProps = {
  image: string
  title: string
  seasonYear?: number | null
  isSelected: boolean
  onClick: () => void
}

export function AnimeItem(props: CardProps) {
  const { image, title, seasonYear = 0, isSelected, onClick } = props
  const { isMobile } = useDeviceType()

  return (
    <StyledFlex
      mb={3}
      borderRadius={4}
      onClick={onClick}
      border={isSelected ? '1px solid #095ae5' : 'unset'}
      backgroundColor={isSelected ? 'rgba(9, 90, 229, 0.05)' : '#16181f'}
    >
      <Box width={isMobile ? 80 : 120} height={120} cursor='pointer' position='relative'>
        <Image
          fill
          alt={title}
          placeholder='blur'
          blurDataURL='/images/placeholder.png'
          src={image || '/images/placeholder.png'}
          style={{
            objectFit: 'cover',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
          }}
        />
      </Box>

      <Flex justifyContent='space-between' p={[12, 16, 20]} width='100%'>
        <Box cursor='pointer'>
          <Text color='white' fontSize={[16, 18, 20]}>
            {title}
          </Text>
          <Text color='gray.500' mt={2} fontSize={[12, 14, 16]}>
            {seasonYear}
          </Text>
        </Box>
      </Flex>
    </StyledFlex>
  )
}

export function AnimeItemSkeleton() {
  const { isMobile } = useDeviceType()

  return (
    <Flex mb={3}>
      <Box width={isMobile ? 100 : 120} height={isMobile ? 'auto' : 120}>
        <Skeleton width='100%' height='100%' />
      </Box>

      <Box p={[12, 16, 20]} width='100%'>
        <Skeleton height={25} />
        <Skeleton height={15} width={100} style={{ marginTop: '8px' }} />
      </Box>
    </Flex>
  )
}
