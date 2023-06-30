import React from 'react'
import { Show } from '@/components'
import { Box, Text } from '@/components/Core'
import styled from '@emotion/styled'
import { FieldValues, FieldErrors } from 'react-hook-form'

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  background-color: #252833;
  color: #fff;
  border: none;
  outline: none;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #fff !important;
  }
`

type TextFieldProps = {
  label?: string
  name: string
  register?: any
  errors?: FieldErrors<FieldValues> | any
  value?: string
  dataCy?: string
} & JSX.IntrinsicElements['input']

export function TextField(props: TextFieldProps) {
  const { label, name, register, errors, value, dataCy, ...rest } = props
  const error = errors?.[name]

  return (
    <Box width='100%'>
      <label htmlFor={name}>{label}</label>
      <Input type='text' value={value} {...(register ? register(name) : {})} {...rest} data-cy={dataCy} />
      <Show when={error}>
        <Text fontSize={[12, 14, 14]} mt={1} style={{ marginLeft: '12px' }} color='danger.main'>
          {error?.message}
        </Text>
      </Show>
    </Box>
  )
}
