import InputLabelMui from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import { PasswordElement, TextFieldElement } from 'react-hook-form-mui'
import React from 'react'

export const Input = (props: any) => <TextFieldElement variant="standard" {...props} />
export const Password = (props: any) => <PasswordElement variant="standard" {...props} />
export const InputMui = (props: any) => <TextField variant="standard" {...props} />
export const InputLabel = (props: any) => <InputLabelMui variant="standard" {...props} />
