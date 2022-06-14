import React, { useEffect, useState } from 'react'
import MainWrapper from '../../src/components/MainWrapper'
import { Roles, Theme } from '../../src/utils/enums'
import { Background, Content, Title, Subtitle, Fields, Icon } from './index.style'

import MainHeader from '../../src/components/MainHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useAuth } from '../api/AuthProvider'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const status = {
  PENDING: 'Pendente',
  UPDATED: 'Atualizado',
  UPDATED_PARTIALlY: 'Atualizado parcialmente',
  UNKNOWN: 'Desconhecido',
}

const GraduateList: React.FC = () => {
  const [graduates, setGraduates] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const getGraduates = async () => {
      const response = await fetch(`${GRADUATE_API}/v1/graduate`, {
        credentials: 'include',
      })
      const result = await response.json()
      console.log('graduates', result)
      setGraduates(result)
    }
    getGraduates()
  }, [])

  const router = useRouter()
  const onClickEdit = () => {
    if (user.role === Roles.ADMIN) router.push('/secretaria')
    else router.push('/editar')
  }

  return (
    <>
      <MainWrapper themeName={Theme.gray} hasContent={false}>
        <Background>
          <MainHeader />
          <Content>
            <Title>Listagem de Egressos</Title>
            <table>
              <thead>
                <tr className="table-header">
                  <td>
                    <Fields>Nome</Fields>
                  </td>
                  <td>
                    <Fields>Status</Fields>
                  </td>
                  <td>
                    <Fields>Local de Trabalho</Fields>
                  </td>
                  <td>
                    <Fields>Cargo</Fields>
                  </td>
                  <td>
                    <Fields>Editar</Fields>
                  </td>
                </tr>
              </thead>
              <tbody>
                {/* {pendentes.map((pendente: any) => ( */}
                {/*   <tr key={pendente.id}> */}
                {/*     <td> */}
                {/*       <Subtitle>{pendente.nome}</Subtitle> */}
                {/*     </td> */}
                {/*     <td> */}
                {/*       <Subtitle className="pendente">Pendente</Subtitle> */}
                {/*     </td> */}
                {/*     <td> */}
                {/*       <Subtitle>-</Subtitle> */}
                {/*     </td> */}
                {/*     <td> */}
                {/*       <Subtitle>-</Subtitle> */}
                {/*     </td> */}
                {/*     <td> */}
                {/*       <Icon> */}
                {/*         <FontAwesomeIcon icon={faPencilAlt} /> */}
                {/*       </Icon> */}
                {/*     </td> */}
                {/*   </tr> */}
                {/* ))} */}
                {graduates.map((graduate: any) => (
                  <tr key={graduate.id}>
                    <td>
                      <Subtitle>{graduate.name}</Subtitle>
                    </td>
                    <td>
                      <Subtitle className="atualizado">{status[graduate.status]}</Subtitle>
                    </td>
                    <td>
                      <Subtitle>{graduate.workPlace.name}</Subtitle>
                    </td>
                    <td>
                      <Subtitle>{graduate.position}</Subtitle>
                    </td>
                    <td>
                      <Icon>
                        <FontAwesomeIcon onClick={onClickEdit} icon={faPencilAlt} />
                      </Icon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default GraduateList
