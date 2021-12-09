import React, { useState } from 'react'
import Head from 'next/head'
import MainWrapper from '../../src/components/MainWrapper'
import { Theme } from '../../src/utils/enums'
import { useForm } from 'react-hook-form'
import {
  Background,
  Content,
  Title,
  Subtitle,
  Fields,
  Icon,
  Editar
} from './index.style'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//import { Content, Title } from '../../src/styles/index.style'
import fotoIcUff from '../../public/fotoicuff.jpg'
import logo from '../../public/logo-ic-uff-branca.png'
import Image from 'next/image'
import MainHeader from "../../src/components/MainHeader";



const Listagem: React.FC = () => {
  const [egressos, setEgressos] = useState([
    {
      id: '1',
      nome: 'Luiza',
      status: 'Pendente',
      localDeTrabalho: 'Itaú',
      cargo: 'Analista',
    },
    {
      id: '2',
      nome: 'Bruno Henrique',
      status: 'Pendente',
      localDeTrabalho: 'Flamengo',
      cargo: 'Jogador',
    },
    {
      id: '3',
      nome: 'Dan Lessa',
      status: 'Atualizado',
      localDeTrabalho: 'Kiritolandia',
      cargo: 'Player',
    },
    {
      id: '4',
      nome: 'Gabizinha',
      status: 'Atualizado',
      localDeTrabalho: 'Flamengo',
      cargo: 'Jogador',
    },
  ])

  const [pendentes, setPendentes] = useState([
    {
      id: '1',
      nome: 'Jazias Soares',
    },
    {
      id: '2',
      nome: 'Projota Benfica',
    },
    {
      id: '3',
      nome: 'Leonardo Dicaprio',
    },
  ])

  const onSubmit = data => {
    fetch('http://localhost:8080/')
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
                {pendentes.map((pendente: any) => (
                  <tr key={pendente.id}>
                    <td><Subtitle>{pendente.nome}</Subtitle></td>
                    <td><Subtitle className="pendente">Pendente</Subtitle></td>
                    <td><Subtitle>-</Subtitle></td>
                    <td><Subtitle>-</Subtitle></td>
                    <td><Icon><FontAwesomeIcon icon={faPencilAlt} /></Icon></td>
                  </tr>
                ))}
                {egressos.map((egresso: any) => (
                  <tr key={egresso.id}>
                    <td><Subtitle>{egresso.nome}</Subtitle></td>
                    <td><Subtitle className="atualizado">Atualizado</Subtitle></td>
                    <td><Subtitle>{egresso.localDeTrabalho}</Subtitle></td>
                    <td>
                      <Subtitle>{egresso.cargo}</Subtitle>
                    </td>
                    <td><Icon><FontAwesomeIcon icon={faPencilAlt} /></Icon></td>
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

export default Listagem
