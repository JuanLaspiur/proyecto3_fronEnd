import {
    Card,
    CardContent,
    Grid,
    Paper,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from "@mui/material";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

import routes from "../router/routes";
const API_URL= "https://proyecto3-back.onrender.com/api"; //mal importada

const UserRegister = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const num = searchParams.get("num");
    const enterprise = searchParams.get("enterprise");
    const area = searchParams.get("area");
    const position = searchParams.get("position");
    const department = searchParams.get("department");
    const [form, setForm] = useState({
        name: "",
        cellphone: "",
        email,
        num,
        enterprise,
        area,
        position,
        department
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // TODO: Validate birthDate with regex ( 01/01/2021 )
        const regexToDate = /^(0?[1-9]|[1-2][0-9]|3[0-1])\/(0?[1-9]|1[0-2])\/\d{4}$/; // ! this regex is not working

        if(!form.name || !form.cellphone || !form.civilStatus || !form.genre || !form.country || !form.city || !form.address || !form.identificationNumber || !form.password || !form.confirmPassword) {
            enqueueSnackbar("Por favor llene todos los campos.", { variant: "error" });
            return;
        }

        if(form.password !== form.confirmPassword) {
            enqueueSnackbar("Las contraseñas no coinciden.", { variant: "error" });
            return;
        }

        if(!form.email || !form.num || !form.enterprise || !form.area || !form.position) {
            enqueueSnackbar("Error al obtener datos de la invitación, si el error persiste pida una nueva invitación.", { variant: "error" });
            return;
        }

        axios.post(`${API_URL}/user/employee/register`, form)
            .then((response) => {
                enqueueSnackbar("Empleado registrado.", { variant: "success" });
                navigate(routes.login);
            }).catch((error) => {
                console.log(error);
                enqueueSnackbar(error.response.data.message, { variant: "error" });
            });
    };

    const updateForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const updateImagesForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.files[0] });
    };

    return (
        <Grid container sx={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "primary.main",
            py: 5
        }}>
            <Grid item xs={10} md={8}>
                <Card component={Paper} elevation={5} sx={{ minHeight: 500 }}>
                    <CardContent sx={{ justifyContent: "center", textAlign: "center" }}>
                        <h1 style={{ fontSize: 50 }}>EICHE</h1>

                        <Grid container sx={{ py: 5, px: "20%", textAlign: "left" }}>
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Nombre completo
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="name"
                                    value={form.name}
                                    fullWidth
                                    onChange={(evt) => updateForm(evt)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Email
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="email"
                                    value={email}
                                    fullWidth
                                    onChange={(evt) => updateForm(evt)}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Número de teléfono
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="cellphone"
                                    value={form.cellphone}
                                    fullWidth
                                    onChange={(e) => updateForm(e)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Estado civil
                                </Typography>
                            </Grid>
                            <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
                                <InputLabel>Estado civil</InputLabel>
                                <Select
                                    value={form.civilStatus}
                                    onChange={(e) => updateForm(e)}
                                    name="civilStatus"
                                >
                                    <MenuItem value="Soltero">Soltero</MenuItem>
                                    <MenuItem value="Casado">Casado</MenuItem>
                                    <MenuItem value="Divorciado">Divorciado</MenuItem>
                                    <MenuItem value="Viudo">Viudo</MenuItem>
                                </Select>
                            </FormControl>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Género
                                </Typography>
                            </Grid>
                            <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
                                <InputLabel>Género</InputLabel>
                                <Select
                                    value={form.genre}
                                    onChange={(e) => updateForm(e)}
                                    name="genre"
                                >
                                    <MenuItem value="Masculino">Masculino</MenuItem>
                                    <MenuItem value="Femenino">Femenino</MenuItem>
                                    <MenuItem value="Otro">Otro</MenuItem>
                                </Select>
                            </FormControl>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    País de residencia
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="country"
                                    value={form.country}
                                    fullWidth
                                    onChange={(e) => updateForm(e)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Ciudad de residencia
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="city"
                                    value={form.city}
                                    fullWidth
                                    onChange={(e) => updateForm(e)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Dirección 
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="address"
                                    value={form.address}
                                    fullWidth
                                    onChange={(e) => updateForm(e)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Número de identificación 
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="identificationNumber"
                                    value={form.identificationNumber}
                                    fullWidth
                                    onChange={(e) => updateForm(e)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Día de nacimiento (DD/MM/AAAA) 
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="birthDate"
                                    value={form.birthDate}
                                    fullWidth
                                    onChange={(e) => updateForm(e)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Contraseña
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="password"
                                    value={form.password}
                                    fullWidth
                                    type="password"
                                    onChange={(evt) => updateForm(evt)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                                    Confirmar contraseña
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: 3 }}>
                                <TextField
                                    variant="standard"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    fullWidth
                                    type="password"
                                    onChange={(evt) => updateForm(evt)}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ py: 3, textAlign: "center" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => handleSubmit(e)}
                                >
                                    Registrarse
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default UserRegister;
