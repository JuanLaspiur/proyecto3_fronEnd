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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDebt } from "../../api/debts";

const DebtModal = ({ setModalDebt }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const handleForm = async () => {
    if (amount > 0) {
      let form = {
        type: "cost",
        description: description,
        amount: amount,
        date: date,
      };
      const res = await createDebt(form);
      if (res.success) {
        enqueueSnackbar(res.msg, { variant: "success" });
        setModalDebt(false);
        setTimeout(() => {
          navigate(0);
        }, 1000);
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
              <Typography variant="h5">Nueva deuda</Typography>
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

            <Grid item xs={12}>
              <Typography variant="h5">Fecha de vencimiento</Typography>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  onChange={(newValue) => setDate(newValue)}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setModalDebt(false);
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

export default DebtModal;
