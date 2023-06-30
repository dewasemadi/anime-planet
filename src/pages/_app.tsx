import '@/styles/globals.css'
import theme from '@/styles/theme'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import { Box, Header, Toast } from '@/components'
import { client } from '@/services/client'
import NextNProgress from 'nextjs-progressbar'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@emotion/react'
import { SkeletonTheme } from 'react-loading-skeleton'

const inter = Inter({ subsets: ['latin'] })

const NoSSRGlobalProvider = dynamic(() => import('@/context/globalContext'), {
  ssr: false,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSSRGlobalProvider>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <SkeletonTheme baseColor='#16181f' highlightColor='#444'>
            <Box className={inter.className} position='relative'>
              <NextNProgress
                height={2}
                color='#095AE5'
                stopDelayMs={200}
                startPosition={0.3}
                options={{ showSpinner: false }}
              />
              <Header />
              <Component {...pageProps} />
              <Toast />
            </Box>
          </SkeletonTheme>
        </ThemeProvider>
      </ApolloProvider>
    </NoSSRGlobalProvider>
  )
}
