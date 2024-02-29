import { Close, Label } from "@mui/icons-material";
import { Card, CardContent, Grid, FormControl, MenuItem, Select, InputLabel, Typography, Button } from "@mui/material";
import React, { useState } from 'react';
import { useEffect } from "react";
import { getAllAreas, getAllContracts } from "../../api/axios";
import { useSnackbar } from "notistack";
import { addAreaAndContract } from "../../api/tasks";

const UploadFileModal = ({ handleClose, task, setData }) => {
  const [form, setForm] = useState({
    area: "",
    contract: "",
  });
  const [areas, setAreas] = useState(false);
  const [contracts, setContracts] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getAllAreas().then((res) => setAreas(res.areas));
    getAllContracts().then((res) => setContracts(res.contracts));

    if (task.area && task.contract) {
      setForm({
        area: task.area._id || "",
        contract: task.contract._id || "",
      });
    }
  }, []);

  const handleChanges = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    addAreaAndContract(task._id, form.area, form.contract).then((res) => {
      if (res.status) {
        enqueueSnackbar('Asignado correctamente!', { variant: "success" });
        setData(res.registersActualized)
        handleClose();
      } else {
        enqueueSnackbar('Ha ocurrido un error', { variant: "error" });
      }
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Close onClick={handleClose} style={{ position: "absolute", top: 10, right: 40, cursor: "pointer", fontSize: 30 }} />

      <Card sx={{ width: 350 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">{task.activity}</Typography>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Área</InputLabel>
                <Select
                  value={form.area}
                  label="Área"
                  onChange={(e) => handleChanges(e)}
                  name="area"
                  fullWidth
                >

                  {areas && areas.map((area) => <MenuItem key={area._id} value={area._id}>
                    {area.name}
                  </MenuItem>)}

                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Contrato</InputLabel>
                <Select
                  value={form.contract}
                  label="Contrato"
                  onChange={(e) => handleChanges(e)}
                  name="contract"
                  fullWidth
                >
                  {contracts && contracts.map((contract) => <MenuItem value={contract._id}>
                    {contract.formNumber} - {contract.prospectOrClient.name} - {contract.plannings[0].name}
                  </MenuItem>)}
                </Select>
              </FormControl>

              <Button variant="contained" sx={{ mt: 3, width: "100%" }} onClick={(e) => onSubmit(e)}>
                Asignar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadFileModal;