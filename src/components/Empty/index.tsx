import Image from 'next/image'
import { Flex, Text } from '@/components/Core'

type EmptyProps = {
  text: string | React.ReactNode
  button?: React.ReactNode
  mt?: number | number[]
  height?: number | string
}

export function Empty(props: EmptyProps) {
  const { text, button, mt, height } = props

  return (
    <Flex
      alignItems='center'
      flexDirection='column'
      justifyContent='center'
      height={height || '100vh'}
      mt={mt || [-50, -58, -68]}
    >
      <Image alt='empty' src='/images/empty.svg' width={200} height={200} />
      <Text color='gray.300' mt={4} textAlign='center' fontSize={[12, 14, 16]}>
        {text}
      </Text>
      {!!button && button}
    </Flex>
  )
}
