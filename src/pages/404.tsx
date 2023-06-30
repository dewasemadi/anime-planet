import { Seo } from '@/components'
import { useRouter } from 'next/router'
import { ROUTES } from '@/constants/routes'
import { Button, Empty, Container } from '@/components'

export default function Custom404() {
  const router = useRouter()

  return (
    <Container>
      <Seo title='404 - Page Not Found' />

      <Empty
        text='404 - Page Not Found'
        button={
          <Button mt={16} onClick={() => router.push(ROUTES.HOME)}>
            Back to Home
          </Button>
        }
      />
    </Container>
  )
}
