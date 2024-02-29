import { Close } from "@mui/icons-material";
import {
    Card, CardContent, Grid, FormControl, Typography, Button, TextField,
    InputLabel, Select, MenuItem, OutlinedInput
} from "@mui/material";
import React, { useState, useEffect, useContext } from 'react';
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TasksContext } from "./Tasks.provider";
import { useSnackbar } from "notistack";
import { getAllContracts, getProjects } from "../../api/axios";
import { getAllEmployees } from "../../api/employees";

const CreateTaskModal = ({ handleClose, }) => {
    const [form, setForm] = useState({
        activity: '',
        description: '',
        date: '',
        employees: [],
        contract: '',
        project: '',
    });
    const [users, setUsers] = useState([]);
    const [contracts, setContracts] = useState(false);
    const [projects, setProjects] = useState([]);
    const { handleCreate} = useContext(TasksContext);

    useEffect(() => {
        getAllEmployees().then((res) => setUsers(res.users));
        getAllContracts().then((res) => setContracts(res.contracts));
        getProjects().then((res) => setProjects(res.data));
    }, []);


    const handleChanges = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleDate = (date) => {
        let day = date._d.getDate()
        let month = date._d.getMonth() + 1
        let year = date._d.getFullYear()
        setForm({ ...form, date: `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}` })
        // console.log(`${day<10? '0': ''}${day}/${month<10? '0': ''}${month}/${year}`)
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const formWithoutEmptyValues = Object.keys(form).reduce((acc, key) => {
            if (form[key] !== '') {
                acc[key] = form[key];
            }
            return acc;
        }, {});

        handleCreate(formWithoutEmptyValues);
        handleClose();
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

            <Card sx={{ width: '60%' }}>
                <CardContent sx={{ textAlign: "center" }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h6">Crear tarea</Typography>

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

                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <InputLabel>Proyecto</InputLabel>
                                <Select
                                    value={form.project}
                                    label="Proyecto"
                                    onChange={(e) => handleChanges(e)}
                                    name="project"
                                    fullWidth
                                >
                                    {projects && projects.map((project) => <MenuItem value={project._id}>
                                        {project.name}
                                    </MenuItem>)}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <InputLabel id="demo-multiple-employees-label">Empleados</InputLabel>
                                <Select
                                    labelId="demo-multiple-employees-label"
                                    id="demo-multiple-employees"
                                    multiple
                                    label="Empleados"
                                    value={form.employees}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            employees: e.target.value
                                        })
                                    }}
                                    input={<OutlinedInput label="name" />}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 48 * 4.5 + 8,
                                                width: 250,
                                            },
                                        },
                                    }}
                                >
                                    {users.map((user) => (
                                        <MenuItem
                                            key={user._id}
                                            value={user._id}
                                        >
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button variant="contained" sx={{ mt: 3, width: "100%" }} onClick={(e) => onSubmit(e)}>
                                Crear
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateTaskModal;