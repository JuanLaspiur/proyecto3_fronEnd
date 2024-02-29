import { Close, Label } from "@mui/icons-material";
import { Card, CardContent, FormControl, Grid, TextField, Typography, Button, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Select, MenuItem, InputLabel } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { createWorkingDayMark } from '../../../api/axios'
import { useSnackbar } from "notistack";
import { getProjects } from '../../../api/axios';

function diasDelMesEnAnio(mes, anio) {
    const ultimoDiaDelMes = new Date(anio, mes, 0).getDate();
    return ultimoDiaDelMes;
} // * obtenemos los días del mes en el año seleccionado

const CommentWorkingDayModal = ({ handleClose, setDataWorkingMonth, monthSelected, yearSelected, enqueueSnackbar }) => {
    const [messages, setMessages] = useState([])
    const [actualMessage, setActualMessage] = useState({
        project: '',
        minutes: 0,
        message: '',
        file: null,
    })
    const [projects, setProjects] = useState([])

    const handleSubmit = () => {
        const now = new Date();
        const hours = now.getHours();
        let minutes = now.getMinutes();
        const monthToSend = now.getMonth() + 1;
        const dayToSend = now.getDate();
        const yearToSend = now.getFullYear();
        // * obtenemos los datos actuales antes de mandarlos al sv (por si el usuario entra después de las 00:00)

        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        createWorkingDayMark({
            month: monthToSend,
            day: dayToSend,
            year: yearToSend,
            hour: `${hours}:${minutes}`,
            message: messages
        }).then((res) => {
            const days = diasDelMesEnAnio(monthSelected, yearSelected);

            for (let i = 1; i <= days; i++) {
                const element = res.data.find((day) => day.day === i);

                if (!element) {
                    res.data.splice(i - 1, 0, {
                        day: i,
                        totalMinutes: 0,
                        totalHours: 0,
                        totalPayment: 0,
                    });
                }
            }

            setDataWorkingMonth(res.data);
            enqueueSnackbar(res.msg, { variant: 'success' });
            handleClose(false)
        })
    }

    const handleMessageChange = (e) => {
        if (e.target.type !== 'file') {
            setActualMessage({
                ...actualMessage,
                [e.target.name]: e.target.value
            })
        } else {
            setActualMessage({
                ...actualMessage,
                file: e.target.files[0]
            })
        }
    }

    const addCurrentMessage = () => {
        setMessages([
            ...messages,
            actualMessage
        ])
        setActualMessage({
            project: '',
            minutes: 0,
            message: '',
            file: null,
        })
    }

    useEffect(() => {
        getProjects().then((res) => {
          setProjects(res.data);
          console.log(res.data)
        }).catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        })
    }, [])


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
            <Close onClick={handleClose} style={{ position: "absolute", top: 10, right: 40, cursor: "pointer", fontSize: 40, color: 'white' }} />

            <Card sx={{ width: '60%', overflowY: 'auto', maxHeight: '80%' }}>
                <CardContent sx={{ textAlign: "center" }}>
                    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid item xs={7}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" component="div">
                                        Deja un comentario sobre tu jornada!
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container xs={12} spacing={2}>
                                        <Grid item xs={8}>
                                            <FormControl sx={{ width: '100%' }}>
                                                <InputLabel id="demo-simple-select-label">Proyecto</InputLabel>
                                                <Select name="project" label={'Proyecto'} value={actualMessage.project} sx={{ width: '100%' }} onChange={(e) => handleMessageChange(e)}>
                                                    {projects.map((project) => (
                                                        <MenuItem value={project._id}>{project.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <TextField name="minutes" type="number" label={'Minutos'} value={actualMessage.minutes} onChange={(e) => handleMessageChange(e)} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField name="message" multiline rows={4} label={'Mensaje'} value={actualMessage.message} onChange={(e) => handleMessageChange(e)} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <TextField disabled type="file" name="file" label={'Archivo'} onChange={(e) => handleMessageChange(e)} />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', mt: 1, justifyContent: 'space-between' }}>
                                    <Button variant="contained" color="primary" sx={{ width: '49%' }} onClick={() => addCurrentMessage()}>
                                        <Label />
                                        Agregar
                                    </Button>

                                    <Button variant="contained" color="error" sx={{ width: '49%' }} onClick={() => handleClose(false)}>
                                        <Label />
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {/* table with 2 columns */}

                                    <TableContainer xs={12}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableCell align="center">Proyecto</TableCell>
                                                <TableCell align="center">Horas</TableCell>
                                            </TableHead>

                                            <TableBody>
                                                {messages.map((message) => (
                                                    <TableRow>
                                                        <TableCell align="center">{message.project}</TableCell>
                                                        <TableCell align="center">{message.minutes}</TableCell>
                                                    </TableRow>
                                                ))}

                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Total minutos</TableCell>
                                                    <TableCell align="center">{
                                                        messages.reduce((acc, curr) => {
                                                            return acc + curr.minutes
                                                        } , 0)
                                                    }</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" sx={{ width: '100%', mt: 1 }} onClick={() => handleSubmit()}>
                                        <Label sx={{ mr: 1 }} />
                                        Confirmar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default CommentWorkingDayModal;