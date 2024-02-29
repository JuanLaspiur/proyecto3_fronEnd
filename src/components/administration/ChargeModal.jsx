import { AttachMoney } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useSnackbar } from 'notistack';
import { createCharge, editCharge, getProjects } from "../../api/axios";
import React, { useEffect, useState } from 'react';

const ChargeModal = ({ setModalCharge,
  getChargeAmount,
  editing,
  editingCharge,
  setEditingCharge, }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    amount: editing ? editingCharge.amount : "",
    selectedProject: editing ? editingCharge.project._id : "",
  });

  // * Si se está editando, los valores se setean con los valores del cobro a editar

  const getData = async () => {
    const res2 = await getProjects();
    if (res2.success) {
      setState({ ...state, projects: res2.data });
    }
  };

  useEffect(() => {
    getData();
  }, [])

  const handleEdit = async () => {
    if (state.amount > 0) {
      let form = {
        contract: state.contract,
        type: "income",
        description: "",
        amount: state.amount ?? null,
        date: state.date,
        alternative_amount: 0,
        alternative_currency: 0,
        project: state.selectedProject,
      }
      const res = await editCharge(editingCharge._id, form);
      if (res.success) {
        enqueueSnackbar(res.message, { variant: "success" });
        setEditingCharge(null);
        await getChargeAmount();
      } else {
        enqueueSnackbar(res.msg, { variant: "error" });
      }
    } else {
      enqueueSnackbar("Se debe ingresar un monto mayor a 0", {
        variant: "error",
      });
    }
  };

  const handleForm = async () => {
    const { alternative_currency, alternative_amount } = state;

    if (!alternative_amount || !alternative_currency) {
      return enqueueSnackbar("Se debe ingresar un monto alternativo", { variant: "error" })
    }

    if (state.amount > 0) {
      let form = {
        type: "income",
        project: selectedProject,
        ...state
      };
      // console.log(form);
      const res = await createCharge(form);
      if (res.success) {
        enqueueSnackbar(res.msg, { variant: "success" });
        setModalCharge(false);
        await getChargeAmount();
      } else {
        enqueueSnackbar(res.msg, { variant: "error" });
      }
    } else {
      enqueueSnackbar("Se debe ingresar un monto mayor a 0", {
        variant: "error",
      });
    }
  }

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1200,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      <Card
        sx={{
          minWidth: 350,
          maxWidth: 600,
          minHeight: 350,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>

            <Grid item xs={12}>
              <Typography variant="h5">Nuevo cobro programado</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" xs={12}>Proyecto</Typography>
              <Grid container>

              </Grid>
              <Select
                fullWidth
                name="selectedProject"
                value={state.selectedProject}
                onChange={(e) => {
                  console.log(e.target.value)
                  setState({ ...state, selectedProject: e.target.value })
                }}
              >
                {
                  state.projects && state.projects[0] && state.projects.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {`${item.name} -`}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" sx={12}>Monto</Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Select
                    fullWidth
                    value={state.currency}
                    onChange={(e) => setState({ ...state, currency: e.target.value })}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="CLP">CLP</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    placeholder="_ _ _"
                    type="number"
                    name="amount"
                    value={state.amount}
                    onChange={(e) => setState({ ...state, amount: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    }}
                  >
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" sx={12}>Monto alternativo</Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Select
                    fullWidth
                    value={state.alternative_currency}
                    onChange={(e) => setState({ ...state, alternative_currency: e.target.value })}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="CLP">CLP</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    placeholder="_ _ _"
                    type="number"
                    name="alternative_amount"
                    value={state.alternative_amount}
                    onChange={(e) => setState({ ...state, alternative_amount: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    }}
                  >
                  </TextField>
                </Grid>
              </Grid>
            </Grid>



            <Grid item xs={12}>
              <Typography variant="h5">
                Nombre del cobro
              </Typography>
              <TextField
                fullWidth
                type="text"
                name="billing_name"
                placeholder="..."
                value={state.billing_name}
                onChange={(e) => setState({ ...state, billing_name: e.target.value })}
              >
              </TextField>
            </Grid>


            <Grid item xs={12}>
              <Grid container xs={12} alignItems={'center'}>

                <Grid item xs={6}>
                  <Typography variant="h5" textAlign="center">Fecha de cobro</Typography>
                </Grid>

                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      onChange={(newValue) => setState({ ...state, date: newValue })}
                      disablePast
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  if (!editing) setModalCharge(false);
                  if (editing) setEditingCharge(null);
                }}
              >
                Cancelar
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={!editing ? handleForm : handleEdit}
              >
                Listo
              </Button>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChargeModal;