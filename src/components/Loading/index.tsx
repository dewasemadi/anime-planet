import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Flex } from '@/components'

const spinAnimation = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  border: 4px solid #4c525e;
  border-top: 4px solid #095ae5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spinAnimation} 1s linear infinite;
`

type LoadingProps = {
  mt?: number | number[]
  height?: number | string
}

export function Loading(props: LoadingProps) {
  const { mt, height } = props

  return (
    <Flex
      alignItems='center'
      flexDirection='column'
      justifyContent='center'
      height={height || '100vh'}
      mt={mt || [-50, -58, -68]}
    >
      <Spinner />
    </Flex>
  )
}
