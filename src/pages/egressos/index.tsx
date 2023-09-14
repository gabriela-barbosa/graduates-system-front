import React, { useEffect, useState } from 'react'
import { MainWrapper, Input, Select, Button, ActionIcon } from '@components'
import { Theme, USER_TOKEN_NAME } from '@utils/enums'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import Pagination from '@mui/material/Pagination'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'

import { useRouter } from 'next/router'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'
import { useForm } from 'react-hook-form'
import { ListGraduatesFilters } from '@modules/Egressos/types'
import GraduatesTable from '@components/Table/CustomTable'
import { parseCookies } from 'nookies'
import { getAPIClient } from '../../services/axios'
import { getInstitutionTypes } from '@modules/WorkHistoryEdit'
import { PaginationType } from '@modules/Commons/types'
import { getGraduates } from '@modules/GraduatesList/api'
import { GraduatesListDetails } from '@modules/GraduatesList/types'
import { toast } from 'react-toastify'

const pageSize = 10

const status = {
  PENDING: 'Pendente',
  UPDATED: 'Atualizado',
  UPDATED_PARTIALLY: 'Atualizado parcialmente',
  UNKNOWN: 'Desconhecido',
}

interface Props {
  graduates: any[]
  institutionTypes: any[]
  meta: PaginationType
}

const GraduateList = ({ meta, graduates = [], institutionTypes = [] }: Props) => {
  const apiClient = getAPIClient()
  const [graduatesList, setGraduatesList] = useState(graduates)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const defaultInstitutionType = { id: 0, label: 'Nenhum tipo de instituição selecionado' }
  const router = useRouter()

  const formContext = useForm()
  const { getValues, reset } = formContext

  useEffect(() => {
    setGraduatesList(graduates)
    setPagination(meta)
  }, [graduates, meta])

  const onSend = async (data: ListGraduatesFilters) => {
    try {
      const { graduates: graduatesSend, meta: metaSend } = await getGraduates(apiClient, 1, data)
      setGraduatesList(graduatesSend)
      setPagination(metaSend)
    } catch (e) {
      toast.error('Erro ao buscar egressos.')
    }
  }

  const onClickEdit = graduate => {
    router.push(`/egressos/${graduate.userId}`)
  }

  const onChangePagination = async (event, value) => {
    const filters = getValues() as ListGraduatesFilters
    try {
      const { graduates: graduatesPagination, meta: metaPagination } = await getGraduates(
        apiClient,
        value,
        filters
      )
      setGraduatesList(graduatesPagination)
      setPagination(metaPagination)
    } catch (e) {
      toast.error('Erro ao buscar egressos.')
    }
  }

  const onClickClean = async () => {
    reset()
    try {
      const { graduates: graduatesClean, meta: metaClean } = await getGraduates(apiClient, 1)
      setGraduatesList(graduatesClean)
      setPagination(metaClean)
    } catch (e) {
      toast.error('Erro ao buscar egressos.')
    }
  }

  const columns = [
    { name: 'Nome' },
    { name: 'Status' },
    { name: 'Último Local de Trabalho' },
    { name: 'Tipo de Instituição' },
    { name: 'Último Cargo' },
    { name: 'Editar', width: '10%' },
  ]

  const rows = graduatesList?.map(graduate => {
    return [
      {
        body: graduate.name,
      },
      {
        body: <Fields status={graduate.status}>{status[graduate.status]}</Fields>,
      },
      {
        body: graduate.workPlace?.name ?? '-',
      },
      {
        body: graduate.workPlace?.type ?? '-',
      },
      {
        body: graduate.position ?? '-',
      },
      {
        body: (
          <ActionIcon onClick={() => onClickEdit(graduate)}>
            <EditRoundedIcon />
          </ActionIcon>
        ),
        width: '10%',
      },
    ]
  })

  return (
    <MainWrapper themeName={Theme.white}>
      <PageWrapper
        spacing={2}
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Title>Listagem de Egressos</Title>
            </Grid>
            <Grid item sx={{ paddingBottom: '20px' }}>
              <FormContainer formContext={formContext} onSuccess={onSend}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    sx={{
                      width: '350px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Input variant="standard" label="Nome do egresso" name="name" />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      width: '350px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Input
                        variant="standard"
                        label="Nome da instituição"
                        name="institutionName"
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      width: '350px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Select
                        variant="standard"
                        name={'institutionType'}
                        label={'Tipo da instituição'}
                        options={[defaultInstitutionType, ...institutionTypes]}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item alignSelf={'center'}>
                    <Button size={'large'} variant="contained" type="submit">
                      <SearchRoundedIcon />
                    </Button>
                  </Grid>
                  <Grid item alignSelf={'center'}>
                    <Button size={'large'} variant="outlined" onClick={onClickClean}>
                      <ClearRoundedIcon />
                    </Button>
                  </Grid>
                </Grid>
              </FormContainer>
            </Grid>
            <Grid item>
              {rows?.length !== 0 ? (
                <GraduatesTable columns={columns} rows={rows} />
              ) : (
                <Fields>Nenhum resultado encontrado.</Fields>
              )}
            </Grid>
          </Grid>
        </Grid>
        {pagination && rows?.length !== 0 && (
          <Grid item>
            <Pagination
              count={Math.ceil(pagination.total / pageSize)}
              page={pagination.page + 1}
              onChange={onChangePagination}
            />
          </Grid>
        )}
      </PageWrapper>
    </MainWrapper>
  )
}

export async function getServerSideProps(ctx) {
  const apiClient = getAPIClient(ctx)
  const { [USER_TOKEN_NAME]: token } = parseCookies(ctx)
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const promises = [getGraduates(apiClient), getInstitutionTypes(apiClient)]
  const responses = await Promise.all(promises)
  const someResult = responses.some(item => 'response' in item && item.response?.status === 403)
  if (someResult)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const [graduatesResponse, institutionTypes] = responses

  const { graduates, meta } = graduatesResponse as GraduatesListDetails

  console.log(graduates)
  return {
    props: {
      graduates: graduates ?? [],
      meta,
      institutionTypes,
    },
  }
}

export default GraduateList
