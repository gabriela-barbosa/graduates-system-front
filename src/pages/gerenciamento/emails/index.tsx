import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css'

import {
  ActionIcon,
  Button,
  MainWrapper,
  showDeletedToast,
  showSavedToast,
  ToastContainer,
} from '@components'
import { Theme, USER_TOKEN_NAME } from '@utils/enums'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Pagination,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { getAPIClient } from '../../../services/axios'
import { parseCookies } from 'nookies'
import { deleteEmail, getEmails, saveEmail, updateEmail } from '@modules/Emails/api'
import { Email } from '@modules/Emails/types'
import { PaginationType } from '@modules/Commons/types'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import GraduatesTable from '@modules/Egressos/GraduatesTable'
import { showErrorToast } from '@components/Toast'

const pageSize = 10

interface Props {
  emails: Email[]
  meta: PaginationType
}

const EmailConfig = ({ emails, meta }: Props) => {
  const apiClient = getAPIClient()
  const [emailsList, setEmailsList] = useState<Email[]>(emails)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const [previousEmail, setPreviousEmail] = useState<Email>({
    buttonText: '',
    buttonURL: '',
    content: '',
    id: '',
    isGraduateEmail: false,
    name: '',
    title: '',
    active: false,
  })
  const [currentEmail, setCurrentEmail] = useState<Email>({
    buttonText: '',
    buttonURL: '',
    content: '',
    id: '',
    isGraduateEmail: false,
    name: '',
    title: '',
    active: false,
  })
  const [show, setShow] = useState(false)
  const router = useRouter()

  const { id } = currentEmail

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleClickBack = () => {
    router.push('/gerenciamento')
  }

  const cleanEmailFields = () => {
    setCurrentEmail({
      active: false,
      buttonText: '',
      buttonURL: '',
      content: '',
      isGraduateEmail: false,
      name: '',
      title: '',
      id: undefined,
    })
  }

  const handleChangePagination = async (page: number) => {
    try {
      const { data, meta } = await getEmails(apiClient, pageSize, page)
      setEmailsList(data)
      setPagination(meta)
    } catch (error) {
      showErrorToast('Erro ao trocar de página')
    }
  }

  const handleDeleteEmail = async (id: string) => {
    try {
      await deleteEmail(apiClient, id)
      showDeletedToast()
      await router.replace(router.asPath)
    } catch (error) {
      showErrorToast('Ocorreu um problema na deleção!')
    }
  }

  const handleSaveEmail = async (email: Email) => {
    try {
      await saveEmail(apiClient, email)
      showSavedToast()
      setShow(false)
      cleanEmailFields()
      await router.replace(router.asPath)
    } catch (error) {
      showErrorToast('Ocorreu um problema ao salvar.')
    }
  }

  const handleUpdateInstitution = async (email: Email) => {
    try {
      await updateEmail(apiClient, email)
      showSavedToast()
      setShow(false)
      cleanEmailFields()
      await router.replace(router.asPath)
    } catch (error) {
      showErrorToast('Ocorreu um problema ao atualizar email.')
    }
  }

  const handleOpenEdit = (current: Email) => {
    setShow(true)
    setCurrentEmail(current)
    setPreviousEmail(current)
  }

  const columns = [
    { name: 'Nome' },
    { name: 'Tipo do Email' },
    { name: 'Status' },
    { name: 'Ações' },
  ]

  const rows = emailsList?.map(email => {
    return [
      {
        body: email.name,
      },
      {
        body: email.isGraduateEmail ? 'Egresso' : 'Orientador',
      },
      {
        body: email.active ? 'Ativo' : 'Inativo',
      },
      {
        body: (
          <section>
            <ActionIcon onClick={() => handleOpenEdit(email)}>
              <EditRoundedIcon />
            </ActionIcon>
            {email.id && (
              <ActionIcon onClick={() => handleDeleteEmail(email.id as string)}>
                <DeleteForeverRoundedIcon />
              </ActionIcon>
            )}
          </section>
        ),
      },
    ]
  })

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent hasHeader>
        <PageWrapper>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>Atualizar Informações do Email</Title>
            </Grid>
            <Grid item xs={12}>
              <GraduatesTable columns={columns} rows={rows} />
            </Grid>
            <Grid item xs={12}>
              {pagination && (
                <Pagination
                  count={Math.ceil(pagination.total / pageSize)}
                  page={pagination.page + 1}
                  onChange={event => handleChangePagination(event.target as unknown as number)}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button
                    size={'large'}
                    variant={'contained'}
                    onClick={() => {
                      cleanEmailFields()
                      handleShow()
                    }}
                  >
                    Adicionar Novo Email
                  </Button>
                </Grid>
                <Grid item>
                  <Button size={'large'} variant={'outlined'} onClick={handleClickBack}>
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <ToastContainer />
          </Grid>
        </PageWrapper>
      </MainWrapper>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields>{id ? 'Editar' : 'Adicionar'} Email</Fields>
        </Modal.Header>
        <Modal.Body>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.name}
                  disabled={!!id}
                  required
                  name={'name'}
                  label={'Nome do emails'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, name: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.title}
                  required
                  name={'title'}
                  label={'Título'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, title: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.content}
                  required
                  name={'content'}
                  label={'Conteúdo'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, content: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.buttonText}
                  required
                  name={'buttonText'}
                  label={'Texto do Botão'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, buttonText: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.buttonURL}
                  required
                  name={'buttonURL'}
                  label={'URL do botão'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, buttonURL: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={'active'}
                      disabled={previousEmail.active}
                      checked={currentEmail.active}
                      onChange={() =>
                        setCurrentEmail({
                          ...currentEmail,
                          active: !currentEmail.active,
                        })
                      }
                    />
                  }
                  label="Email ativo?"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id={'isGraduateEmailLabel'}> Destinatário do email:</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="isGraduateEmailLabel"
                  name="isGraduateEmailLabel"
                  value={currentEmail.isGraduateEmail}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, isGraduateEmail: target.value === 'true' })
                  }
                >
                  <FormControlLabel
                    disabled={!!id}
                    value={true}
                    control={<Radio />}
                    label={'Egresso'}
                  />
                  <FormControlLabel
                    disabled={!!id}
                    value={false}
                    control={<Radio />}
                    label={'Orientador'}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size={'large'}
            variant={'contained'}
            onClick={() =>
              id ? handleUpdateInstitution(currentEmail) : handleSaveEmail(currentEmail)
            }
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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
  const { data, meta } = await getEmails(apiClient, pageSize)

  return {
    props: {
      emails: data ?? [],
      meta: meta ?? {},
    },
  }
}

export default EmailConfig