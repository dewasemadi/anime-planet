import styled from '@emotion/styled'
import { Show } from '@/components'
import { IoClose } from 'react-icons/io5'
import { useGlobalContext } from '@/context/globalContext'
import { useTheme } from '@emotion/react'
import useDeviceType from '@/hooks/useDeviceType'
import { Box, Text, BaseButton, Flex } from '@/components/Core'

const StyledFlex = styled(Flex)`
  animation: slide-in 0.2s ease-out forwards, fade-in 0.3s ease-out forwards;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export function Toast() {
  const { toast, setToast } = useGlobalContext()
  const { isOpen, message, type } = toast

  const { isMobile } = useDeviceType()
  const theme = useTheme()

  const getColor = () => {
    switch (type) {
      case 'success':
        return { bgColor: theme.colors.success.main, borderColor: theme.colors.success.border }
      case 'warning':
        return { bgColor: theme.colors.warning.main, borderColor: theme.colors.warning.border }
      case 'error':
        return { bgColor: theme.colors.danger.main, borderColor: theme.colors.danger.border }
      default:
        return { bgColor: theme.colors.success.main, borderColor: theme.colors.success.main }
    }
  }

  const { bgColor, borderColor } = getColor()

  return (
    <Show when={isOpen}>
      <StyledFlex
        position='fixed'
        top={[60, 68, 78]}
        right={20}
        backgroundColor={bgColor}
        zIndex={10000}
        borderRadius={4}
        overflow='hidden'
      >
        <Box width={5} backgroundColor={borderColor} />
        <Flex p={12} minWidth={isMobile ? 'unset' : 300} alignItems='center' justifyContent='space-between'>
          <Text color='gray.900' fontSize={[12, 14, 16]} fontWeight={500} data-cy='toast-text'>
            {message}
          </Text>

          <BaseButton onClick={() => setToast((prev) => ({ ...prev, isOpen: false }))} aria-label='close'>
            <IoClose color={borderColor} size={isMobile ? 18 : 24} style={{ marginLeft: isMobile ? '16px' : 0 }} />
          </BaseButton>
        </Flex>
      </StyledFlex>
    </Show>
  )
}
