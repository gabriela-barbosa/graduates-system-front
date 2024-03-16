import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material'
import { Subtitle } from '@styles/index.style'
import React, { useEffect, useState } from 'react'
import { getCourses } from '../WorkHistoryEdit/api'
import { DatePicker, Divider, Input } from '@components'
import { Controller, useController } from 'react-hook-form'
import { SelectItem } from '@utils/types'
import { useRouter } from 'next/router'
import { getCNPQLevelsOptions, getInstitutionTypesOptions } from '@modules/Commons/api'
import dayjs, { Dayjs } from 'dayjs'
import { PostDoctorateInfo } from '@modules/User/index'

interface Props {
  institutionTypes: SelectItem[]
  control: any
}

const GraduateInfo = ({ control, institutionTypes }: Props) => {
  const router = useRouter()
  const [cnpqLevels, setCNPQLevels] = useState<SelectItem[]>([])
  const [, setCourses] = useState<SelectItem[]>([])

  const redirectToLoginIfError = response => {
    if ('response' in response) router.push('/')
  }

  useEffect(() => {
    getCNPQLevelsOptions().then(response => {
      redirectToLoginIfError(response)
      setCNPQLevels(response as SelectItem[])
    })
    getCourses().then(response => {
      redirectToLoginIfError(response)
      setCourses(response as SelectItem[])
    })
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Subtitle>Informações do Egresso</Subtitle>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PostDoctorateInfo control={control} institutionTypes={institutionTypes} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container rowSpacing={4} columnSpacing={4}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={'cnpqId'}>Bolsa CNPQ</InputLabel>
                  <Controller
                    control={control}
                    name={'graduate.cnpqScholarship'}
                    render={({ field: { value, ...rest } }) => (
                      <Select {...rest} multiple value={value ?? []} label={'Bolsa CNPQ'}>
                        {cnpqLevels.map(level => (
                          <MenuItem key={level.id} value={level.id}>
                            {level.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <Input label={'Casos de Sucesso'} name={'successCase'} rows={4} multiline />
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container rowSpacing={4} columnSpacing={4}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor={'courses'}>Cursos</InputLabel>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormLabel>Concluiu o doutorado no PGC/UFF?</FormLabel>
          <Controller
            control={control}
            name={'graduate.hasFinishedDoctorateOnUFF'}
            render={({ field: { value, ...rest } }) => (
              <RadioGroup
                {...rest}
                row
                value={value}
                onChange={(event, value) => rest.onChange(value)}
              >
                <FormControlLabel control={<Radio />} label={'Não informar'} value={'unknown'} />
                <FormControlLabel control={<Radio />} label={'Sim'} value={true} />
                <FormControlLabel control={<Radio />} label={'Não'} value={false} />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormLabel>Concluiu o mestrado no PGC ou CAA - UFF ?</FormLabel>
          <Controller
            control={control}
            name={'graduate.hasFinishedMasterDegreeOnUFF'}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel control={<Radio />} label={'Não informar'} value={'unknown'} />
                <FormControlLabel control={<Radio />} label={'Sim'} value={true} />
                <FormControlLabel control={<Radio />} label={'Não'} value={false} />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default GraduateInfo
