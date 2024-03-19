import { Grid } from '@mui/material'
import { Fields, Label, Subtitle } from '@styles/index.style'
import React, { useState } from 'react'
import {
  ActionIcon,
  AddRounded,
  Box,
  Button,
  CustomTable,
  DeleteForeverRoundedIcon,
  Divider,
  Paper,
} from '@components'
import { useController } from 'react-hook-form'
import { SelectItem } from '@utils/types'
import dayjs from 'dayjs'
import { Course } from '@modules/WorkHistoryEdit'
import { CourseModal } from '@modules/WorkHistoryEdit/CourseModal'

const columns = [
  {
    name: 'Nome do Egresso',
  },
  {
    name: 'Minuta de Defesa',
  },
  {
    name: 'Programa',
  },
  {
    name: 'Data de Titulação',
  },
  { name: 'Ações', width: '10%' },
]

interface Props {
  control: any
  historyCourses?: Course[]
  programs: SelectItem[]
}

const CoursesInfoGraduate = ({ control, historyCourses = [], programs }: Props) => {
  const [isAddCourseOpen, setIsAddCourseOpen] = useState<boolean>(false)

  const {
    field: { value: courses, onChange: setCourses },
  } = useController({ control, name: 'advisor.courses' })

  const rows = [
    ...(courses ?? []).map((course, index) => [
      {
        body: <Fields status={'UPDATED'}>{course.graduate?.name}</Fields>,
      },
      {
        body: <Fields status={'UPDATED'}>{course.defenseMinute}</Fields>,
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {programs.find(p => p.id === course.program?.id)?.label}
          </Fields>
        ),
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {!course.titleDate ? '-' : dayjs(course.titleDate).format('DD/MM/YYYY')}
          </Fields>
        ),
      },
      {
        body: (
          <ActionIcon
            onClick={() => {
              setCourses(courses.filter((_, i) => i !== index))
            }}
          >
            <DeleteForeverRoundedIcon />
          </ActionIcon>
        ),
        width: '10%',
      },
    ]),
    ...historyCourses.map(course => [
      {
        body: <Fields status={'UPDATED'}>{course.graduate?.name}</Fields>,
      },
      {
        body: <Fields status={'UPDATED'}>{course.defenseMinute}</Fields>,
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {programs.find(p => p.id === course.program?.id)?.label}
          </Fields>
        ),
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {!course.titleDate ? '-' : dayjs(course.titleDate).format('DD/MM/YYYY')}
          </Fields>
        ),
      },
    ]),
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Subtitle>
            Informações de Cursos do Orientador
            <Button
              sx={{ marginLeft: '20px' }}
              size={'large'}
              variant="contained"
              onClick={() => setIsAddCourseOpen(true)}
            >
              Adicionar
              <AddRounded />
            </Button>
          </Subtitle>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container rowSpacing={2}>
              <Grid item xs={12}>
                {rows?.length ? (
                  <CustomTable columns={columns} rows={rows} />
                ) : (
                  <Paper variant="outlined" sx={{ borderRadius: '8px', borderStyle: 'dashed' }}>
                    <Box sx={{ padding: 2 }}>
                      <Label>Não há histórico de cursos.</Label>
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <CourseModal
        isGraduate={false}
        courses={courses}
        setCourses={setCourses}
        programs={programs}
        isAddCourseOpen={isAddCourseOpen}
        setIsAddCourseOpen={setIsAddCourseOpen}
      />
    </Grid>
  )
}

export default CoursesInfoGraduate
