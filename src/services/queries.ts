import { gql } from '@apollo/client'

export interface pageInfo {
  total: number
  currentPage: number
  lastPage: number
  hasNextPage: boolean
  perPage: number
}

export interface Anime {
  id: number
  title: {
    romaji: string
  }
  coverImage: {
    large: string
    medium: string
  }
  seasonYear: number | null
}

export interface AnimeDetail extends Anime {
  bannerImage: string
  description: string
  genres: string[]
}

export type AnimeQueryResult = {
  Page: {
    pageInfo: pageInfo
    media: Anime[]
  }
}

export type AnimeDetailQueryResult = {
  Media: AnimeDetail
}

export const GET_ANIME = gql`
  query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(search: $search) {
        id
        title {
          romaji
        }
        coverImage {
          large
          medium
        }
        seasonYear
      }
    }
  }
`

export const GET_ANIME_DETAIL = gql`
  query ($id: Int) {
    Media(id: $id) {
      id
      title {
        romaji
      }
      coverImage {
        large
        medium
      }
      bannerImage
      description
      genres
      averageScore
      popularity
      episodes
      duration
      season
      seasonYear
    }
  }
`
