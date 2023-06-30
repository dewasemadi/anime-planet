import Head from 'next/head'

type Favicons = {
  rel: string
  href: string
  sizes?: string
  type?: string
}

const favicons: Array<Favicons> = [
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '512x512',
    href: '/favicon/android-chrome-512x512.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: '/favicon/android-chrome-192x192.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/favicon/apple-touch-icon-180x180.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon/favicon-16x16.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon/favicon-32x32.png',
  },
  {
    rel: 'manifest',
    href: '/manifest.json',
  },
]

type DefaultMeta = {
  title: string | string[] | undefined
  siteName: string
  description: string
  type: string
  robots: string
}

const defaultMeta: DefaultMeta = {
  title: 'Anime Planet',
  siteName: 'Anime Planet',
  description: 'Find your next anime to watch',
  type: 'website',
  robots: 'follow, index',
}

type SeoProps = {
  date?: string
  templateTitle?: string
} & Partial<typeof defaultMeta>

export function Seo(props: SeoProps) {
  const meta = {
    ...defaultMeta,
    ...props,
  }
  meta['title'] = props.templateTitle ? `${props.templateTitle} | ${meta.siteName}` : meta.title

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name='robots' content={meta.robots} />
      <meta content={meta.description} name='description' />
      <meta name='msapplication-TileColor' content='#0f1014' />
      <meta name='theme-color' content='#0f1014' />

      {meta.date && (
        <>
          <meta property='article:published_time' content={meta.date} />
          <meta name='publish_date' property='og:publish_date' content={meta.date} />
          <meta name='author' property='article:author' content='dewasemadi3@gmail.com' />
        </>
      )}

      {favicons.map((linkProps) => (
        <link key={linkProps.href} {...linkProps} />
      ))}
    </Head>
  )
}
