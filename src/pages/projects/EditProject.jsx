import { Button, Card, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material'
import { PageHeader } from '../../components/common/PageHeader';
import routes from '../../router/routes';
import { useState, useEffect } from 'react';
import { getAllContracts, getAllClients, updateProject } from '../../api/axios';
import { useSnackbar } from "notistack";
import LoadingModal from '../../components/common/LoadingModal';
import { getProject } from '../../api/axios';
import { useParams } from 'react-router-dom';

export default function EditProject() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    description: '',
    client: undefined,
    contracts: []
  });
  const [project, setProject] = useState(undefined);
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [breadcrumbs, setBreadcrumbs] = useState([
    {
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
      title: "Editar proyecto: ",
      link_to: routes.editProject,
    },
  ]);

  const handleChangeInput = (e) => {
    setForm((prevState)=>{
      return {
        ...prevState,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    updateProject(project._id, form)
      .then((res) => {
        setProject(()=> res.data);
        enqueueSnackbar('¡Proyecto editado correctamente!', { variant: "success" });
        setLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar('Ha ocurrido un error, mil disculpas!', { variant: "error" });
        setLoading(false);
      })
  }

  useEffect(() => {
    getProject(id)
      .then((res) => {
        setProject(res.data)
      })
      .catch((err) => {
        enqueueSnackbar('Error al obtener el proyecto, por favor recargue la página.', { variant: "error" });
      })
  }, [])

  useEffect(() => {
    getAllContracts()
      .then((res) => {
        if(res.success) setContracts(res.contracts);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });

    getAllClients()
      .then((res) => {
        setClients(res.clients);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
  }, [])

  useEffect(() => {
    setContracts(contracts.filter((contract) => contract.prospectOrClient._id === form.client))
  }, [form.client])

  useEffect(() => {
    if (project){
      setForm(()=>{
        const newData = {
          name: project.name,
          description: project.description,
          client: project.client,
          contracts: project.contracts
        }
        return newData
      })
      setBreadcrumbs((prevState) =>{
        prevState[2].title = "Editar Proyecto: " + project.name
        prevState[2].link_to = routes.editProject.replace(":id", project._id)
        return prevState
      })
    }
  }, [project]);

  return (
    <Grid container>
      {loading && <LoadingModal />}

      <Grid item xs={12}>
        <PageHeader page_title={`Editar proyecto: ${project ? project.name : ""}`} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h5">Editar proyecto</Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField id="name" label='Nombre' name="name" onChange={(e) => handleChangeInput(e)} value={form.name}/>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField id="description" label='Descripción' name="description" onChange={(e) => handleChangeInput(e)} multiline rows={6} value={form.description}/>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="client">Cliente</InputLabel>
            <Select name="client" label="Cliente" onChange={(e) => handleChangeInput(e)} value={form.client}>
              {clients.map((client) => (
                <MenuItem key={client._id} value={client._id}>{client.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="contracts">Contratos asociados</InputLabel>
            <Select
              label="Contratos asociados"
              name='contracts'
              multiple
              disabled={!form.client}
              value={form.contracts}
              onChange={(e) => {
                setForm({
                  ...form,
                  contracts: e.target.value
                })
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {contracts.map((contract) => (
                <MenuItem
                  key={contract._id}
                  value={contract._id}
                >
                  {contract.formNumber} - {contract.prospectOrClient.name} - {contract.plannings[0].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={(e) => handleSubmit(e)}>Editar proyecto</Button>
          </FormControl>
        </Card>
      </Grid>
    </Grid>
  )
}
