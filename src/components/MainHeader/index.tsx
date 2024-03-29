import Image from 'next/image'
import Link from 'next/link'
import { Header, Title, ProfileIcon } from './index.style'
import logo from '@public/logo-ic-uff-png.png'
import React from 'react'
import { useAuth } from '@context/AuthProvider'
import Router from 'next/router'
import { Role, RoleTranslation } from '@utils/enums'
import {
  Button,
  Grid,
  SelectMui,
  LogoutRoundedIcon as Logout,
  Box,
  Divider,
  FormControl,
  InputLabel,
  KeyboardArrowDownRoundedIcon,
  AccountCircleIcon,
  SettingsIcon,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@components'
import Head from 'next/head'
import { getHomeUrlAccordingRole } from '@utils/functions'

const MainHeader: React.FC = () => {
  const { user, currentRole, logout, updateCurrentRole } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const open = Boolean(anchorEl)

  const onClickConfig = () => {
    Router.push('/gerenciamento')
  }

  const userNames = user?.name.split(' ')
  const userFirstAndSecondName = userNames
    ? userNames.length > 1
      ? userNames?.slice(0, 2).join(' ')
      : userNames[0]
    : ''

  const logoLink = currentRole && user ? getHomeUrlAccordingRole(currentRole, user.id) : '/'

  return (
    <Grid item minWidth="1000px">
      <Header>
        <Head>
          <title>Sistema Egressos</title>
        </Head>
        <Grid container px={11} alignItems="center" height="100%" width="100%">
          <Box>
            <Link href={logoLink} passHref>
              <Image src={logo} width={108} alt="Logo IC-UFF" />
            </Link>
          </Box>

          <Grid item pl={3} alignSelf="center">
            <Title> Sistema de Egressos </Title>
          </Grid>
          <Grid item xs>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid item pr={1}>
                <FormControl>
                  <InputLabel variant="outlined" id="currentRoleLabel">
                    Papel do Usuário
                  </InputLabel>
                  <SelectMui
                    sx={{ minWidth: '120px' }}
                    labelId={'currentRoleLabel'}
                    id={'currentRoleLabel'}
                    name={'currentRole'}
                    label={'Papel do Usuário'}
                    value={currentRole || ''}
                    onChange={async event => {
                      if (event.target.value) {
                        const role = Role[event.target.value as keyof typeof Role]
                        updateCurrentRole(role)
                      }
                    }}
                  >
                    {user?.roles.map((role, index) => (
                      <MenuItem key={index} value={role}>
                        {RoleTranslation[role]}
                      </MenuItem>
                    ))}
                  </SelectMui>
                </FormControl>
              </Grid>
              <Grid item pl={2}>
                <ProfileIcon>
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                </ProfileIcon>
              </Grid>
              <Button
                variant="text"
                size="medium"
                sx={{ textTransform: 'none', fontSize: '16px' }}
                endIcon={<KeyboardArrowDownRoundedIcon />}
                onClick={handleClick}
              >
                {userFirstAndSecondName}
              </Button>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {currentRole === Role.ADMIN && (
                  <MenuItem onClick={onClickConfig}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Gerenciamento
                  </MenuItem>
                )}
                {currentRole === Role.ADMIN && <Divider />}
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Header>
    </Grid>
  )
}

export default MainHeader
