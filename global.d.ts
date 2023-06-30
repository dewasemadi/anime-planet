import '@emotion/react'

declare module 'react-icons/go'

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: {
        main: string
        hover: string
        border: string
        disabled: string
      }
      secondary: {
        main: string
        hover: string
        border: string
        disabled: string
      }
      success: {
        main: string
        hover: string
        border: string
        disabled: string
      }
      warning: {
        main: string
        hover: string
        border: string
        disabled: string
      }
      danger: {
        main: string
        hover: string
        border: string
        disabled: string
      }
      gray: {
        100: string
        200: string
        300: string
        400: string
        500: string
        600: string
        700: string
        800: string
        900: string
      }
    }
    breakpoints: string[]
  }
}
