import { Show } from '@/components'
import { useTheme } from '@emotion/react'
import useDeviceType from '@/hooks/useDeviceType'
import styled from '@emotion/styled'
import { Box, BaseButton, Text, BaseProps } from '@/components/Core'

const StyledButton = styled(BaseButton)<any>`
  transition: all 0.2s ease-in-out;
  cursor: ${({ isDisabled }: { isDisabled: boolean }) => (isDisabled ? 'not-allowed' : 'pointer')};

  :hover {
    background-color: ${({ hoverColor }: { hoverColor: string }) => hoverColor} !important;
    transition: all 0.2s ease-in-out;
  }
`

/*
 * variant button
 */
type ButtonProps = {
  children: React.ReactNode | string
  isDisabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'text'
  size?: 'sm' | 'md' | 'lg'
  color?: string
  onClick: () => void
} & BaseProps<any>

export function Button(props: ButtonProps) {
  const theme = useTheme()
  const { colors } = theme

  const { children, variant = 'primary', size = 'md', color, onClick, isDisabled, ...rest } = props

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return { bgColor: colors.primary.main, hoverColor: colors.primary.hover, disabled: colors.primary.disabled }
      case 'secondary':
        return { bgColor: colors.gray[700], hoverColor: colors.gray[800], disabled: colors.gray[600] }
      case 'danger':
        return { bgColor: colors.danger, hoverColor: colors.danger.hover, disabled: colors.danger.disabled }
      case 'text':
        return { bgColor: 'transparent', hoverColor: 'transparent', disabled: 'transparent' }
      default:
        return { bgColor: colors.primary.main, hoverColor: colors.primary.hover, disabled: colors.primary.disabled }
    }
  }
  const { bgColor, hoverColor, disabled: disabledColor } = getBackgroundColor()

  const getSize = () => {
    switch (size) {
      case 'sm':
        return { px: 2, py: 2, fontSize: 14 }
      case 'md':
        return { px: 3, py: 2, fontSize: 16 }
      case 'lg':
        return { px: 4, py: 3, fontSize: 18 }
      default:
        return { px: 3, py: 2, fontSize: 16 }
    }
  }
  const { px, py, fontSize } = getSize()

  return (
    <StyledButton
      {...rest}
      borderRadius={5}
      onClick={onClick}
      aria-label='button'
      isDisabled={isDisabled}
      px={variant === 'text' ? 0 : px}
      py={variant === 'text' ? 0 : py}
      hoverColor={isDisabled ? disabledColor : hoverColor}
      bg={`${isDisabled ? disabledColor : bgColor} !important`}
    >
      <Show when={typeof children === 'string'}>
        <Text
          fontSize={fontSize}
          color={color || 'gray.200'}
          style={{ textDecoration: variant === 'text' ? 'underline' : 'unset' }}
        >
          {children}
        </Text>
      </Show>
      <Show when={typeof children !== 'string'}>{children}</Show>
    </StyledButton>
  )
}

const StyledFloatingButton = styled(BaseButton)`
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  background-color: #095ae5 !important;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    transition: all 0.3s ease-in-out;
    background-color: #074abe !important;
  }
`

/*
 * floating button
 */
type FloatingButtonProps = {
  children: React.ReactNode
  position?: 'left' | 'right'
  onClick: () => void
} & JSX.IntrinsicElements['button']

export function FloatingButton(props: FloatingButtonProps) {
  const { children, position = 'right', onClick, ...rest } = props
  const { isMobile } = useDeviceType()

  const getPosition = () => {
    switch (position) {
      case 'left':
        return {
          right: 'unset',
          left: isMobile ? 14 : 20,
        }
      case 'right':
        return {
          left: 'unset',
          right: isMobile ? 14 : 20,
        }
    }
  }
  const { left, right } = getPosition()

  return (
    <Box position='fixed' bottom={20} right={right} left={left}>
      <StyledFloatingButton
        {...rest}
        onClick={onClick}
        borderRadius='50%'
        aria-label='button'
        data-cy='floating-button'
        width={isMobile ? 45 : 55}
        height={isMobile ? 45 : 55}
      >
        {children}
      </StyledFloatingButton>
    </Box>
  )
}
