import { useState, useRef } from 'react'
import Image from 'next/image'
import styled from '@emotion/styled'
import { Show } from '@/components/Show'
import useDeviceType from '@/hooks/useDeviceType'
import { BsThreeDotsVertical } from 'react-icons/bs'
import useOutsideClick from '@/hooks/useOutsideClick'
import { Box, Flex, Text, TextWithEllipsis, BaseButton } from '@/components/Core'

const StyledFlex = styled(Flex)`
  transition: all 0.3s ease-in-out;

  :hover {
    background-color: #20222c;
    transition: all 0.3s ease-in-out;
  }
`

const StyledText = styled(Text)`
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  :hover {
    background-color: #4c525e;
    transition: all 0.3s ease-in-out;
  }
`

type CardProps = {
  image?: string
  title?: string
  totalItems?: number
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}

export function Card(props: CardProps) {
  const { image, title, totalItems = 0, onClick, onEdit, onDelete } = props

  const ref = useRef(null)
  const { isMobile } = useDeviceType()

  const [showMenu, setShowMenu] = useState(false)
  useOutsideClick(ref, () => setShowMenu(false))

  const options = [
    {
      title: 'Rename',
      color: 'gray.100',
      dataCy: 'rename-button',
      onClick: onEdit,
    },
    {
      title: 'Delete',
      color: 'danger.main',
      dataCy: 'delete-button',
      onClick: onDelete,
    },
  ]

  return (
    <StyledFlex backgroundColor='#16181f' borderRadius={8}>
      <Box width={isMobile ? 120 : 120} cursor='pointer' position='relative' height={120}>
        <Image
          fill
          sizes='100%'
          onClick={onClick}
          placeholder='blur'
          data-cy='banner-image'
          alt={title || 'default'}
          blurDataURL='/images/placeholder.png'
          src={image || '/images/placeholder.png'}
          style={{
            cursor: 'pointer',
            objectFit: 'cover',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
          }}
        />
      </Box>

      <Flex justifyContent='space-between' p={[12, 16, 20]} width='100%' cursor='pointer' onClick={onClick}>
        <Box cursor='pointer' onClick={onClick}>
          <TextWithEllipsis color='white' fontSize={[16, 18, 20]} maxWidth={200} data-cy='collection-name'>
            {title}
          </TextWithEllipsis>
          <Text color='gray.500' mt={2} fontSize={[12, 14, 16]}>
            {totalItems} {totalItems > 1 ? 'items' : 'item'}
          </Text>
        </Box>
        <Box position='relative'>
          <BaseButton
            aria-label='menu'
            data-cy='menu-button'
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
          >
            <BsThreeDotsVertical color='white' size={18} />
          </BaseButton>

          <Show when={showMenu}>
            <Box
              ref={ref}
              top={30}
              right={0}
              minWidth={150}
              borderRadius={4}
              overflow='hidden'
              position='absolute'
              backgroundColor='#2D313A'
            >
              {options.map(({ title, color, onClick, dataCy }, index) => (
                <StyledText
                  py={12}
                  px={16}
                  key={index}
                  color={color}
                  minWidth={120}
                  data-cy={dataCy}
                  fontSize={[14, 14, 16]}
                  onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                    setShowMenu(false)
                  }}
                >
                  {title}
                </StyledText>
              ))}
            </Box>
          </Show>
        </Box>
      </Flex>
    </StyledFlex>
  )
}
