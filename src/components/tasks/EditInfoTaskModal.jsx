import { Close } from "@mui/icons-material";
import { Card, CardContent, Grid, FormControl, Typography, Button, TextField } from "@mui/material";
import React, { useState, useContext } from 'react';
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TasksContext } from "./Tasks.provider";
import { updateTask } from "../../api/tasks";
import { useSnackbar } from "notistack";

const EditInfoTaskModal = ({ handleClose, task }) => {
    const [form, setForm] = useState({
        activity: task.activity,
        description: task.description,
        date: task.date,
    });
    const { getTasks } = useContext(TasksContext);
    const { enqueueSnackbar } = useSnackbar();

    const handleChanges = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleDate = (date) => {
        let day = date._d.getDate()
        let month = date._d.getMonth() + 1
        let year = date._d.getFullYear()
        setForm({ ...form, date: `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}` })
        // console.log(`${day<10? '0': ''}${day}/${month<10? '0': ''}${month}/${year}`)
      }

    const onSubmit = (e) => {
        e.preventDefault();
        updateTask(task._id, form)
            .then((res) => {
                enqueueSnackbar("Tarea actualizada correctamente", {variant: "success"});
                getTasks();
                handleClose();
            })
            .catch((err) => {
                enqueueSnackbar("Error al actualizar la tarea", {variant: "error"});
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
                zIndex: 1100,
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
                            <Typography variant="h6">Editar tarea</Typography>

                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <TextField value={form.activity} label="Nombre de la actividad" name="activity" onChange={(e) => handleChanges(e)} />
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <TextField value={form.description} name="description" label="Descripción" onChange={(e) => handleChanges(e)} rows={4} multiline />
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>

                                    <MobileDatePicker
                                        fullWidth
                                        disablePast
                                        name='date'
                                        onChange={(value) => handleDate(value)}
                                        label="Fecha de vencimiento"
                                        sx={{ backgroundColor: "white", borderRadius: 1, width: '100%' }}
                                    />
                                </LocalizationProvider>
                            </FormControl>

                            <Button variant="contained" sx={{ mt: 3, width: "100%" }} onClick={(e) => onSubmit(e)}>
                                Editar
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditInfoTaskModal;