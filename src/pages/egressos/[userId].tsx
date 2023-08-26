import React, { useEffect, useMemo } from 'react'
import { Button, MainWrapper, showSavedToast, ToastContainer } from '@components'
import { Role, Theme, USER_TOKEN_NAME } from '@utils/enums'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'

import { useAuth } from '@context/AuthProvider'
import { useRouter } from 'next/router'
import { PageWrapper, Title } from '@styles/index.style'
import { Grid } from '@mui/material'
import { FormContainer } from 'react-hook-form-mui'
import {
  AcademicInfo,
  Fields,
  getCNPQLevels,
  getGraduateInfoAndWorkHistory,
  getInstitutionTypes,
  GraduateWorkHistoriesInfo,
  InstitutionalLinkInfo,
  PersonalInfo,
} from '@modules/WorkHistoryEdit'
import { getAPIClient } from '../../services/axios'
import { parseCookies } from 'nookies'
import { SelectItem } from '@utils/types'
import { showErrorToast } from '@components/Toast'

interface Props {
  graduateInfo: GraduateWorkHistoriesInfo
  institutionTypes: SelectItem[]
  cnpqLevels: SelectItem[]
  hasCurrentWorkHistory: number
  hasCurrentCNPQScholarship: number
  hasPostDoctorate: number
}

const GraduateInfo = ({
  graduateInfo,
  institutionTypes,
  cnpqLevels,
  hasCurrentCNPQScholarship,
  hasPostDoctorate,
  hasCurrentWorkHistory,
}: Props) => {
  const isWorkHistoryPending = graduateInfo.pendingFields.indexOf('workHistory') !== -1
  const isCNPQScholarshipPending = graduateInfo.pendingFields.indexOf('cnpqScholarship') !== -1
  const isPostDoctoratePending = graduateInfo.pendingFields.indexOf('postDoctorate') !== -1

  const router = useRouter()

  const { currentRole } = useAuth()

  // const { graduateId } = router.query

  const formContext = useForm({
    defaultValues: useMemo(() => {
      return {
        ...graduateInfo,
        workHistories: [],
        hasCurrentWorkHistory,
        postDoctorateType: graduateInfo.postDoctorate?.institution.typeId,
        hasCurrentCNPQScholarship,
        hasPostDoctorate,
        institutionalLinks: [],
        currentInstitutionalLinks: [],
        cnpqScholarships: [],
        currentCNPQScholarships: [],
      }
    }, [graduateInfo]),
  })
  const { reset, control } = formContext

  // const [
  //   hasCurrentWorkHistory,
  //   institutionalLinks,
  //   hasCurrentCNPQScholarship,
  //   hasPostDoctorate,
  //   currentInstitutionalLinks,
  // ] = watch([
  //   'hasCurrentWorkHistory',
  //   'institutionalLinks',
  //   'hasCurrentCNPQScholarship',
  //   'hasPostDoctorate',
  //   'currentInstitutionalLinks',
  // ])

  const transformNumberToValue = (n: number) => (n === 1 ? true : n === 0 ? false : undefined)

  // console.log('currentInstitutionalLinks', currentInstitutionalLinks)

  useEffect(() => {
    reset({
      ...graduateInfo,
      postDoctorateType: graduateInfo.postDoctorate?.institution.typeId,
      workHistories: [],
      hasCurrentWorkHistory: isWorkHistoryPending ? -1 : 1,
      hasCurrentCNPQScholarship: isCNPQScholarshipPending ? -1 : 1,
      hasPostDoctorate: isPostDoctoratePending ? -1 : 1,
      institutionalLinks: [],
      currentInstitutionalLinks: [],
      cnpqScholarships: [],
      currentCNPQScholarships: [],
    })
  }, [graduateInfo])

  const onSend = async data => {
    console.log('passei aqui', data)
    const {
      graduateId,
      graduateName,
      email,
      postDoctorate,
      successCase,
      cnpqScholarships,
      hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF,
      hasCurrentWorkHistory,
      hasCurrentCNPQScholarship,
      hasPostDoctorate,
      institutionalLinks,
      // currentInstitutionalLinks,
      // currentCNPQScholarships,
    } = data

    const body = {
      graduateName,
      email,
      successCase,
      workHistories: institutionalLinks,
      cnpqScholarships,
      postDoctorate: hasPostDoctorate === 1 ? postDoctorate : null,
      hasCurrentCNPQScholarship: transformNumberToValue(hasCurrentCNPQScholarship),
      hasPostDoctorate: transformNumberToValue(hasPostDoctorate),
      hasCurrentWorkHistory: transformNumberToValue(hasCurrentWorkHistory),
      hasFinishedDoctorateOnUFF: hasFinishedDoctorateOnUFF
        ? hasFinishedDoctorateOnUFF === 'true'
        : graduateInfo?.hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF: hasFinishedMasterDegreeOnUFF
        ? hasFinishedMasterDegreeOnUFF === 'true'
        : graduateInfo?.hasFinishedMasterDegreeOnUFF,
    }

    const apiClient = getAPIClient()

    try {
      await apiClient.post(`v1/work-history?graduateId=${graduateId}`, { ...body })
      showSavedToast()
    } catch (err) {
      showErrorToast('Ocorreu algum erro.')
    }

    // const myInit = {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify(body),
    // }
    //
    // const result = await fetch(
    //   `${GRADUATE_API}/v1/work-history?graduateId=${graduateId}`,
    //   myInit as RequestInit
    // )
    // if (result.status === 201 || result.status === 204) {
    //   toast.success('Salvo com sucesso!')
    // } else {
    //   toast.error('Ocorreu algum problema.')
    // }
  }

  // const handleGetOnChangeValue = ({ target }) => {
  //   const { value } = target
  //   switch (value) {
  //     case 'true':
  //       return true
  //     case 'false':
  //       return false
  //     default:
  //       return null
  //   }
  // }

  // const handleSetValue = (event, setFunction) => {
  //   const value = handleGetOnChangeValue(event)
  //   setFunction(value)
  // }

  return (
    <MainWrapper themeName={Theme.white}>
      <PageWrapper spacing={2} container>
        <Grid item>
          <Grid container spacing={3}>
            <Grid item>
              <Title>Registro de Histórico do Egresso</Title>
            </Grid>
            <Grid item>
              <FormContainer formContext={formContext} onSuccess={onSend}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <PersonalInfo />
                  </Grid>
                  <Grid item xs={12}>
                    <InstitutionalLinkInfo
                      control={control}
                      graduateInfo={graduateInfo}
                      institutionTypes={institutionTypes}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AcademicInfo
                      control={control}
                      cnpqLevels={cnpqLevels}
                      graduateInfo={graduateInfo}
                      institutionTypes={institutionTypes}
                    />
                  </Grid>
                  <Grid item xs={12} alignSelf={'center'}>
                    <Grid container justifyContent={'center'} columnSpacing={3}>
                      {currentRole !== Role.GRADUATE ? (
                        <Grid item>
                          <Button
                            size={'large'}
                            variant="outlined"
                            onClick={() => router.push(`/egressos`)}
                          >
                            Voltar
                          </Button>
                        </Grid>
                      ) : null}

                      <Grid item>
                        <Button size={'large'} variant="contained" type="submit">
                          Enviar
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </FormContainer>
            </Grid>
          </Grid>
        </Grid>
        <ToastContainer />
      </PageWrapper>
    </MainWrapper>
  )
}

export async function getServerSideProps(ctx) {
  const { userId } = ctx.query
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

  const promises = [
    getGraduateInfoAndWorkHistory(apiClient, userId),
    getInstitutionTypes(apiClient),
    getCNPQLevels(apiClient),
  ]

  const response = await Promise.all(promises)

  const someResult = response.some(item => 'response' in item && item.response?.status === 403)
  if (someResult)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  const [graduateInfo, institutionTypes, cnpqLevels] = response

  const graduateInfoParsed = graduateInfo as GraduateWorkHistoriesInfo

  const getIfHasField = (field: Fields) => {
    return graduateInfoParsed.pendingFields.includes(field)
      ? -1
      : graduateInfoParsed.emptyFields.includes(field)
      ? 0
      : 1
  }

  return {
    props: {
      graduateInfo,
      institutionTypes,
      cnpqLevels,
      hasCurrentCNPQScholarship: getIfHasField(Fields.CNPQ_SCHOLARSHIP),
      hasPostDoctorate: getIfHasField(Fields.POST_DOCTORATE),
      hasCurrentWorkHistory: getIfHasField(Fields.WORK_HISTORY),
    },
  }
}

export default GraduateInfo