import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    OutlinedInput,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { useSnackbar } from "notistack";
import routes from "../../router/routes";
import { PageHeader } from "../../components/common/PageHeader";
import { inviteNewEmployee, getAllAreas, getPositionsByDepartamentId, findDepartamentsByArea } from "../../api/axios";
import LoadingModal from "../../components/common/LoadingModal";

const newEmployee = () => {
    const [status, setStatus] = useState('idle');
    const { enqueueSnackbar } = useSnackbar();
    const [areas, setAreas] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [departments, setDepartments] = useState([])
    const [form, setForm] = useState({
        email: "",
        area: "",
        cargo: "",
        departamento: "",
    });

    useEffect(() => {
        getAllAreas().then((response) => {
            setAreas(response.areas);
        }).catch((error) => {
            enqueueSnackbar("Error al obtener áreas", { variant: "error" });
        });
    }, []);

    useEffect(() => {
        if (form.area){
            findDepartamentsByArea(form.area).then((response) => {
                setDepartments(response.data)
            }).catch((error) => {
                enqueueSnackbar("Error al obtener departamentos", { variant: "error" });
            });
        }
    }, [form.area]);

    useEffect(() => {
        if (form.departamento) {
            getPositionsByDepartamentId(form.departamento).then((response) => {
                setCargos(response.positions);
            }).catch((error) => {
                enqueueSnackbar("Error al obtener cargos", { variant: "error" });
            });
        }
    }, [form.departamento]);

    const page_title = `Nuevo empleado`;
    const breadcrumbs = [
        {
            id: 1,
            title: "Empleados",
        },
        {
            id: 2,
            title: "Listado",
            link_to: routes.employeesList,
        },
        {
            id: 3,
            title: "Nuevo empleado",
            link_to: routes.newEmployee,
        },
    ];

    const handleSubmit = (e) => {
        setStatus('loading');
        e.preventDefault();

        inviteNewEmployee(form).then((response) => {
            setStatus('success');
            enqueueSnackbar("Invitación enviada", { variant: "success" });
        }).catch((error) => {
            setStatus('error');
            enqueueSnackbar("Error al enviar invitación", { variant: "error" });
        });
    };

    const handleChanges = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    if (status === 'loading') return (
        <Grid
            container
            sx={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Grid item xs={12}>
                <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
            </Grid>

            <Grid item xs={6} sx={{ my: 5 }}>
                <Card>
                    <LoadingModal msg="Enviando invitación" />
                </Card>
            </Grid>
        </Grid>
    );

    return (
        <Grid
            container
            sx={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Grid item xs={12}>
                <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
            </Grid>

            <Grid item xs={6} sx={{ my: 5 }}>
                <Card>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={12}>
                                <OutlinedInput fullWidth placeholder="Email del empleado"
                                    value={form.email} onChange={(e) => handleChanges(e)} name="email"/>

                                <FormControl fullWidth sx={{ mt: 3 }}>
                                    <InputLabel>Área</InputLabel>
                                    <Select
                                        value={form.area}
                                        label="Área"
                                        onChange={(e) => handleChanges(e)}
                                        name="area"
                                    >
                                        {areas.map((area) => (
                                            <MenuItem key={area._id} value={area._id}>{area.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl  fullWidth sx={{ mt: 3 }}>
                                    <InputLabel>Departamento</InputLabel>
                                    <Select
                                        value={form.departamento}
                                        label="Departamento"
                                        onChange={(e) => handleChanges(e)}
                                        name="departamento"
                                    >
                                        {departments.map((department) => (
                                            <MenuItem key={department._id} value={department._id}>{department.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={{ mt: 3 }}>
                                    <InputLabel>Cargo</InputLabel>
                                    <Select
                                        value={form.cargo}
                                        label="Cargo"
                                        onChange={(e) => handleChanges(e)}
                                        name="cargo"
                                    >
                                        {cargos.map((cargo) => (
                                            <MenuItem key={cargo._id} value={cargo._id}>{cargo.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Button variant="contained" onClick={(e) => handleSubmit(e)}>
                            Invitar empleado
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default newEmployee;
