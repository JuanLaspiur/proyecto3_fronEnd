import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProject, getComments } from '../../api/axios';
import { useSnackbar } from "notistack";
import routes from '../../router/routes';
import { Grid, List, Typography} from '@mui/material';
import { PageHeader } from '../../components/common/PageHeader';
import { ArrowRight } from '@mui/icons-material';
import TableCommentProject from '../../components/projects/TableCommentProject';
const breadcrumbsDefault = [{
    id: 1,
    title: "Módulo Proyectos",
  },
  {
    id: 2,
    title: "Proyectos",
    link_to: routes.projects,
  },
  {
    id: 3,
    title: "",
    link_to: window.location.pathname,
  }]

export default function Project() {
    const { id } = useParams();
    const [project, setProject] = useState(undefined);
    const { enqueueSnackbar } = useSnackbar();
    const [ breadcrumbs, setBreadrumbs ] = useState(breadcrumbsDefault)
    const [page_title, setPage_title] = useState("")

    useEffect(() => {
        getProject(id).then((res) => {
            console.log("getProject",res.data)
            setProject(res.data);
        }).catch((err) => {
            enqueueSnackbar('Error al obtener el proyecto, por favor recargue la página.', { variant: "error" });
        })
        
        getComments(id)
        .then((res) => {
            console.log(res)
        })
        .catch(()=> {
                enqueueSnackbar('Error al obtener los comentarios, por favor recargue la página.', { variant: "error" });
            })
    }, [])
    
    useEffect(() => {
        if(project){
            setPage_title( "Proyecto: " + project.name)
            setBreadrumbs(prevState => {
                const newState = [...prevState]
                newState[2].title = project.name
                
                return newState
            })
        }
    }, [id]);


    if(project) return (
        <Grid container>
            <Grid item xs={12}>
                { breadcrumbs.length && <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} /> }
            </Grid>

            <Grid item xs={12}>
                <Typography variant="p" component="p" gutterBottom sx={{fontSize: 20}}>
                    {project.description}
                </Typography>
            </Grid>

            <Grid item xs={12} mt={5}>
                <Typography variant="h6" component="h6" gutterBottom>
                    Cliente: {project?.client?.name || "No hay datos del cliente aún"}
                </Typography>

                {
                    project.client 
                        ?<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', pl: 5 }}>
                            <Typography variant="p" component="p" gutterBottom sx={{fontSize: 20, display: 'flex', alignItems: 'center'}}>
                                <ArrowRight /> Email: {project?.client?.email}
                            </Typography>

                            <Typography variant="p" component="p" gutterBottom sx={{fontSize: 20, display: 'flex', alignItems: 'center'}}>
                                <ArrowRight /> Ciudad: {project?.client?.city}, {project?.client?.country}
                            </Typography>
                        </List>
                        : null
                }

            </Grid>

            <Grid item xs={12} mt={5}>
                <Typography variant="h6" component="h6" gutterBottom>
                    Contratos: se han detectado {project?.contracts?.length} contratos asignados.
                </Typography>

                { project && project.contracts.length ? project.contracts.map((contract) => (
                    <>
                        <Typography variant="p" component="p" gutterBottom sx={{fontSize: 20, display: 'flex', alignItems: 'center', mt: 5}}>
                            {contract.formNumber} - {contract.prospectOrClient.name} - {contract.plannings[0].name}
                        </Typography>

                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', pl: 5, mb: 5 }}>
                            <Typography variant="p" component="p" gutterBottom sx={{fontSize: 20, display: 'flex', alignItems: 'center'}}>
                                <ArrowRight /> Número de contrato: {contract.formNumber}
                            </Typography>

                            <Typography variant="p" component="p" gutterBottom sx={{fontSize: 20, display: 'flex', alignItems: 'center'}}>
                                <ArrowRight /> Cliente: {contract.prospectOrClient.name}
                            </Typography>

                            {/* <Typography variant="p" component="p" gutterBottom sx={{fontSize: 20, display: 'flex', alignItems: 'center'}}>
                                <ArrowRight /> Divisa: {contract.moneyBadge.toUpperCase()}
                            </Typography> */}
                        </List>
                    </>
                )) : <></>}

            </Grid>

            <Grid item xs={12} mt={5}>
                <TableCommentProject/>
            </Grid>

        </Grid>
    )
}
