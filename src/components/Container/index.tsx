import { Box } from '@/components/Core'

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <Box width='100%' px={[14, 24, 32]}>
      <Box maxWidth={1200} m='auto'>
        {children}
      </Box>
    </Box>
  )
}
