import 'react-loading-skeleton/dist/skeleton.css'
import Image from 'next/image'
import { useState } from 'react'
import styled from '@emotion/styled'
import { Show } from '@/components/Show'
import Skeleton from 'react-loading-skeleton'
import { useTheme } from '@emotion/react'
import { useRouter } from 'next/router'
import { ROUTES } from '@/constants/routes'
import useDeviceType from '@/hooks/useDeviceType'
import { RiDeleteBinLine } from 'react-icons/ri'
import { GoBookmark, GoBookmarkFill } from 'react-icons/go'
import { Box, TextWithEllipsis, BaseButton, Text, Flex } from '@/components/Core'

type CardProps = {
  image: string
  title: string
  seasonYear?: number | null
  isExistInCollection?: boolean
  onCardClick: () => void
  onAddToCollection?: () => void
  onRemoveFromCollection?: () => void
}

const StyledBox = styled(Box)`
  margin: auto;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;

  :hover {
    transform: scale(1.03);
    background-color: #16181f;
    transition: all 0.3s ease-in-out;
  }
`

export function Card(props: CardProps) {
  const { image, title, seasonYear, isExistInCollection = false } = props
  const { onCardClick, onAddToCollection, onRemoveFromCollection } = props

  const theme = useTheme()
  const { isMobile, isTablet } = useDeviceType()

  const [isHovered, setIsHovered] = useState(false)
  const width = isMobile ? '100%' : isTablet ? 200 : 215

  const route = useRouter()
  const isHome = route.pathname === ROUTES.HOME

  return (
    <StyledBox
      maxWidth={width}
      cursor='pointer'
      width={isMobile ? '100%' : 'unset'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box height={isMobile ? 280 : 300} position='relative' width={width}>
        <Image
          fill
          src={image}
          alt={title}
          placeholder='blur'
          onClick={onCardClick}
          blurDataURL='/images/placeholder.png'
          style={{
            cursor: 'pointer',
            objectFit: 'cover',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        />
      </Box>
      <Box p={2} cursor='pointer'>
        <Flex justifyContent='space-between' alignItems='center' gap={8} cursor='pointer'>
          <TextWithEllipsis color='gray.100' maxWidth={200} fontSize={[16, 18, 20]} fontWeight={600}>
            {title}
          </TextWithEllipsis>

          <Show when={(isHovered && !isExistInCollection && isHome) || (isMobile && !isExistInCollection)}>
            <BaseButton onClick={onAddToCollection} aria-label='collection'>
              <GoBookmark color='white' size={isMobile ? 20 : 24} />
            </BaseButton>
          </Show>

          <Show when={isExistInCollection}>
            <BaseButton
              onClick={!!onRemoveFromCollection ? onRemoveFromCollection : onAddToCollection}
              aria-label='button'
            >
              {isHome && <GoBookmarkFill color='white' size={isMobile ? 20 : 24} />}
              {!isHome && <RiDeleteBinLine color={theme.colors.danger.main} size={22} />}
            </BaseButton>
          </Show>
        </Flex>
        <Text color='gray.500' mt={2} fontSize={[12, 14, 16]}>
          {seasonYear}
        </Text>
      </Box>
    </StyledBox>
  )
}

export function CardSkeleton() {
  const { isMobile, isTablet } = useDeviceType()
  const width = isMobile ? '100%' : isTablet ? 200 : 215

  return (
    <Box width={width} m='auto' mt={-1}>
      <Skeleton height={isMobile ? 280 : 300} width={width} />
      <Skeleton height={20} style={{ marginTop: '8px' }} />
      <Skeleton height={15} width={100} style={{ marginTop: '8px' }} />
    </Box>
  )
}

export default Card
