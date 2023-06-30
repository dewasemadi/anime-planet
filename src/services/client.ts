import { onError } from '@apollo/client/link/error'
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'

const httpLink = new HttpLink({
  uri: 'https://graphql.anilist.co',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd) return

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`)
    )
  }

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})
