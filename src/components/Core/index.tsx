import styled, { CSSObject } from '@emotion/styled'
import {
  space,
  width,
  fontSize,
  color,
  flexbox,
  layout,
  typography,
  grid,
  background,
  border,
  position,
  shadow,
  SpaceProps,
  WidthProps,
  FontSizeProps,
  ColorProps,
  FlexboxProps,
  LayoutProps,
  TypographyProps,
  GridProps,
  BackgroundProps,
  BorderProps,
  PositionProps,
  ShadowProps,
} from 'styled-system'

type StyledSystemProps = SpaceProps &
  WidthProps &
  FontSizeProps &
  ColorProps &
  FlexboxProps &
  LayoutProps &
  TypographyProps &
  GridProps &
  BackgroundProps &
  BorderProps &
  PositionProps &
  ShadowProps

export type BaseProps<T extends keyof JSX.IntrinsicElements> = Omit<StyledSystemProps, 'children'> & {
  css?: CSSObject & { children?: React.ReactNode }
} & JSX.IntrinsicElements[T]

export default function as<T extends keyof JSX.IntrinsicElements>(tag: T) {
  const Component = styled(tag)<BaseProps<T>>`
    ${space}
    ${width}
    ${fontSize}
    ${color}
    ${flexbox}
    ${layout}
    ${typography}
    ${grid}
    ${background}
    ${border}
    ${position}
    ${shadow}

    ${({ css }) => css}
  `

  return Component
}

type BoxProps = BaseProps<'div'> & JSX.IntrinsicElements['div'] & { cursor?: string }

export const Box = styled(as('div'))<BoxProps>`
  cursor: ${({ cursor }) => cursor || 'default'};
`

export const Text = as('p')

export const TextWithEllipsis = styled(Text)`
  max-width: ${({ maxWidth }) => maxWidth}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${({ whiteSpace }: { whiteSpace?: string }) => whiteSpace || 'nowrap'};
`

export const Heading = as('h1')

export const BaseButton = styled(as('button'))`
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Flex = styled(Box)`
  display: flex;
  cursor: ${({ cursor }: { cursor?: string }) => cursor || 'default'};
  gap: ${({ gap }: { gap?: number }) => gap}px;
`

export const Grid = styled(Box)`
  display: grid;
`

export const Overlay = styled(Box)`
  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(15, 16, 20, 1), rgba(0, 0, 0, 0));
    pointer-events: none;
  }
`
