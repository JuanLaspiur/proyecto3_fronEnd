import { AttachMoney } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { createMovement } from "../../api/axios";

const CostModal = ({ setModalCost, contractId, setContractId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const handleForm = async () => {
    if (amount > 0) {
      let form = {
        contract: contractId,
        type: "cost",
        description: description,
        amount: amount,
      };
      const res = await createMovement(form);
      if (res.success) {
        enqueueSnackbar(res.msg, { variant: "success" });
        setContractId(null);
        setModalCost(false);
      } else {
        enqueueSnackbar(res.msg, { variant: "error" });
      }
    } else {
      enqueueSnackbar("Se debe ingresar un monto mayor a 0", {
        variant: "error",
      });
    }
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
              <Typography variant="h5">Nuevo ingreso</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Monto</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Descripción</Typography>
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setContractId(null);
                  setModalCost(false);
                }}
              >
                Cerrar
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button variant="contained" onClick={handleForm}>
                Agregar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostModal;
