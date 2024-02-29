import { Button, Card, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material'
import { PageHeader } from '../../components/common/PageHeader';
import routes from '../../router/routes';
import { useState, useEffect } from 'react';
import { getAllContracts, getAllClients, createProject } from '../../api/axios';
import { useSnackbar } from "notistack";
import LoadingModal from '../../components/common/LoadingModal';

export default function NewProject() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    client: undefined,
    contracts: []
  });
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const page_title = `Nuevo proyecto`;
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
    {
      id: 3,
      title: "Nuevo proyecto",
      link_to: routes.NewProject,
    },
  ];

  const handleChangeInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    getAllContracts().then((res) => {
      if(res.success) setContracts(res.contracts);
    }).catch((err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    });

    getAllClients().then((res) => {
      setClients(res.clients);
    }).catch((err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    })
  }, [])

  useEffect(() => {
    setContracts(contracts.filter((contract) => contract.prospectOrClient._id === form.client))
  }, [form.client])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createProject(form).then((res) => {
      enqueueSnackbar('¡Proyecto creado correctamente!', { variant: "success" });
      setLoading(false);
    }).catch((err) => {
      enqueueSnackbar('Ha ocurrido un error, mil disculpas!', { variant: "error" });
      setLoading(false);
    })
  }

  return (
    <Grid container>
      {loading && <LoadingModal />}

      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h5">Crear proyecto</Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField id="name" label='Nombre' name="name" onChange={(e) => handleChangeInput(e)} />
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField id="description" label='Descripción' name="description" onChange={(e) => handleChangeInput(e)} multiline rows={6} />
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="client">Cliente</InputLabel>
            <Select name="client" label="Cliente" onChange={(e) => handleChangeInput(e)}>
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
              disabled={form.client === ''}
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
            <Button variant="contained" color="primary" onClick={(e) => handleSubmit(e)}>Crear proyecto</Button>
          </FormControl>
        </Card>
      </Grid>
    </Grid>
  )
}
