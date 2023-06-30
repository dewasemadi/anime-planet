import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta name='application-name' content='Anime Planet' />
        <meta name='theme-color' content='#0f1014' />
        <link rel='icon' type='image/png' sizes='192x192' href='/favicon/android-chrome-192x192.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon-180x180.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
