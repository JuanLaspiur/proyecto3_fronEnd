import React from 'react'
import { Button, Grid, Table, TableHead, TableBody, TableRow, TableCell, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import routes from '../../router/routes';
import { PageHeader } from '../../components/common/PageHeader';
import { getProjects } from '../../api/axios';
import { useState, useEffect } from 'react';
import { useSnackbar } from "notistack";
import { Edit, RemoveRedEye } from '@mui/icons-material';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const page_title = `Proyectos`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Módulo Proyectos",
    },
    {
      id: 2,
      title: "Proyectos",
      link_to: routes.projects,
    },
  ];

  useEffect(() => {
    getProjects().then((res) => {
      setProjects(res.data);
    }).catch((err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    })
  }, [])

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => navigate(routes.newProject)}
        >
          Nuevo proyecto
        </Button>
      </Grid>

      <Grid item xs={12}>
        {/* Create a list with the projects */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align='center'>Nombre</TableCell>
              <TableCell align='center'>Descripción</TableCell>
              <TableCell align='center'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell align='center'>{project.name}</TableCell>
                <TableCell align='center'>{project.description}</TableCell>
                <TableCell align='center'>
                  <div style={{display: "flex", gap: "0em .4em", justifyContent: "center", alignItems: "center"}}>
                  <RemoveRedEye sx={{cursor: 'pointer'}} onClick={(e) => navigate(`${routes.projects}/${project._id}`)}/>
                  <Edit fontSize="medium" sx={{ textAlign: "center", cursor: "pointer"}} onClick={(e) => navigate(`${routes.editProject.replace(":id", project._id)}`)}/>
                  </div>
                </TableCell>
                <TableCell align='center'>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}
