import { Button } from '@/components/Button'
import { Box, Flex, Text } from '@/components/Core'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Show } from '@/components/Show'

const StyledBox = styled(Box)`
  transition: all 0.2s ease-in-out;

  ${({ isExist }: { isExist: boolean }) => {
    if (!isExist)
      return css`
        :hover {
          border: 1px solid #095ae5;
          transition: all 0.2s ease-in-out;
        }
      `
  }}
`

type CollectionItemProps = {
  name: string
  totalItems: number
  isSelected: boolean
  isExist: boolean
  onCardClick?: () => void
  onDetailClick: () => void
}

export function CollectionItem(props: CollectionItemProps) {
  const { name, totalItems, isSelected, isExist, onCardClick, onDetailClick } = props

  return (
    <StyledBox
      p={3}
      mb={2}
      borderRadius={4}
      isExist={isExist}
      onClick={onCardClick}
      data-cy='collection-item-card'
      cursor={isExist || !onCardClick ? 'not-allowed' : 'pointer'}
      border={isSelected ? ' 1px solid #095ae5' : 'unset'}
      backgroundColor={isSelected ? 'rgba(9, 90, 229, 0.05)' : '#252833'}
    >
      <Text color='gray.100' fontSize={[14, 16, 18]}>
        {name}
      </Text>
      <Flex justifyContent='space-between' alignItems='center' mt={2}>
        <Flex alignItems='center' gap={6}>
          <Text color='gray.500' fontSize={[12, 14, 16]}>
            {totalItems} {totalItems > 1 ? 'items' : 'item'}
          </Text>

          <Show when={isExist}>
            <Text color='gray.500' fontSize={[12, 14, 16]}>
              • added to collection
            </Text>
          </Show>
        </Flex>

        <Button variant='text' color='gray.500' fontSize={[12, 14, 16]} onClick={onDetailClick} data-cy='detail-button'>
          Detail
        </Button>
      </Flex>
    </StyledBox>
  )
}
