import React, { useRef } from 'react'
import { Show } from '@/components'
import { IoClose } from 'react-icons/io5'
import useDeviceType from '@/hooks/useDeviceType'
import useOutsideClick from '@/hooks/useOutsideClick'
import { useTheme } from '@emotion/react'
import { Box, Flex, Text, BaseButton } from '@/components/Core'

type ModalProps = {
  title?: string
  children: React.ReactNode
  isOpen: boolean
  minWidth?: number | string
  maxWidth?: number | string
  width?: number | string
  onClose: () => void
}

export function Modal(props: ModalProps) {
  const { title, children, isOpen, minWidth = 640, maxWidth, width, onClose } = props
  const { isMobile } = useDeviceType()

  const ref = useRef(null)
  useOutsideClick(ref, onClose)

  const theme = useTheme()

  return (
    <Show when={isOpen}>
      <Box
        top={0}
        left={0}
        ref={ref}
        width='100%'
        height='100%'
        zIndex={1000}
        display='flex'
        position='fixed'
        px={[14, 24, 32]}
        onClick={onClose}
        alignItems='center'
        justifyContent='center'
        backgroundColor='rgba(0, 0, 0, 0.8)'
      >
        <Box
          p={[20, 24, 24]}
          borderRadius={8}
          backgroundColor='#181B23'
          width={isMobile ? '100%' : width}
          onClick={(e) => e.stopPropagation()}
          maxWidth={isMobile ? '100%' : maxWidth}
          minWidth={isMobile ? 'unset' : minWidth}
        >
          <Flex justifyContent='space-between' alignItems='center' width='100%' gap={16}>
            <Text color='gray.200' fontWeight={600} fontSize={[16, 18, 20]}>
              {title}
            </Text>
            <BaseButton onClick={onClose} aria-label='close'>
              <IoClose color={theme.colors.gray[500]} size={isMobile ? 18 : 24} />
            </BaseButton>
          </Flex>
          <Box pt={[16, 20, 24]}>{children}</Box>
        </Box>
      </Box>
    </Show>
  )
}
