import { Box, Button, Divider, Grid, MenuItem, Select, Typography, TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    getBalanceByYear,
    getChargesByMonth,
    getMovements,
    getMovementsByMonth,
} from "../../api/axios";
import { formatNumber } from "../../helpers/formatNumbers";
import ChargeModal from '../../components/administration/ChargeModal';
import ChargesTable from '../../components/administration/ChargesTable';
import { getAllEmployees, getSalaryByEmployeeId } from '../../api/employees'
import { getAllTasks, getByEmployee, finishTask, disableTask, getAllWithoutEmployee } from '../../api/tasks';
import { Delete, Done, FormatListBulleted } from '@mui/icons-material';
import { getSalaries, createWorkingDayMark, getADayOfEmployee } from '../../api/axios';
import { getTotalDebts } from '../../api/debts'
import routes from '../../router/routes';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import MilestonesModal from '../../components/tasks/MilestonesModal';
import CommentWorkingDayModal from '../../components/employees/lifesheet/CommentWorkingDayModal';
// import { get } from 'react-hook-form';

import ChargeModal2 from '../../components/administration/ChargeModal';


const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
];

const getTasks = async (id, setter, enqueueSnackbar) => {
    if (!id) getAllTasks().then(res => {
        if (res.status) {
            setter(res.data)
        } else {
            enqueueSnackbar(res.message, { variant: "error" });
        }
    }).catch(err => {
        enqueueSnackbar(err.message, { variant: "error" });
    })

    if (id) getByEmployee(id).then(res => {
        if (res.status) {
            setter(res.data)
        } else {
            enqueueSnackbar(res.message, { variant: "error" });
        }
    }).catch(err => {
        enqueueSnackbar(err.message, { variant: "error" });
    })
}

const tasksEmployeesColumns = [
    { id: 'num', label: 'N°', align: 'center' },
    { id: 'description', label: 'Proyecto', align: 'center' },
    { id: 'activity', label: 'Tarea', align: 'center' },
    { id: 'date', label: 'Fecha', align: 'center' },
    { id: 'milestones', label: 'Acciones', align: 'center' }
];

export default function Dashboard() {
    const [incomes, setIncomes] = useState(0);
    const [costs, setCosts] = useState(0);
    const [chargesAmount, setChargesAmount] = useState(0);
    const [movements, setMovements] = useState([]);
    const [charges, setCharges] = useState([]);
    const [selectedMovements, setSelectedMovements] = useState([]);
    const [month, setMonth] = useState(moment().format("M"));
    const [year, setYear] = useState(moment().format("YYYY"));
    const [newChargeModal, setNewChargeModal] = useState(false);
    const [chartOptions, setChartOptions] = useState({
        options: {
            xaxis: {
                categories: [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                ],
            },
        },
        series: [
            {
                name: "Ingreso",
                data: [],
            },
        ],
    });
    const [employees, setEmployees] = useState([]);
    const [employeeSelected, setEmployeeSelected] = useState('Sin Asignar')
    const [employeeTasks, setEmployeeTasks] = useState([])
    const [milestonesModal, setMilestonesModal] = useState(false)
    const [employeeSelectedHours, setEmployeeSelectedHours] = useState({
        hours: 0,
        salary: 0
    })
    const [allEnterpriseSalaries, setAllEnterpriseSalaries] = useState({})
    const [totalDebts, setTotalDebts] = useState(0)
    const [commentModal, setCommentModal] = useState(false) // * Modal para agregar comentarios a las tareas
    const [editingCharge, setEditingCharge] = useState(null) // * Modal para editar cargos
    const user = JSON.parse(localStorage.getItem("QUERCU_USER_INFO"));
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const getBalanceData = async () => {
        const response = await getMovementsByMonth(month, year);
        if (response.success) {
            setSelectedMovements(response.movements);
        }
    };

    const getChargeAmount = async () => {
        const response = await getChargesByMonth(month, year);
        if (response.success) {
            setCharges(response.charges);
            // console.log(response.charges);
            if (response.charges) {
                let total = 0;
                response.charges.map((item) => {
                    total = total + item.amount;
                });

                setChargesAmount(total);
            }
        }
    };

    const getData = async () => {
        const res = await getMovements();
        if (res.success) {
            setMovements(res.movements);
        }

        const balance = await getBalanceByYear(year);
        if (balance.success) {
            const updatedOptions = JSON.parse(JSON.stringify(chartOptions));
            updatedOptions.series[0].data = balance.data;
            setChartOptions(updatedOptions);
        }
    };

    const getTotalIncomes = () => {
        let total = 0;
        if (selectedMovements && selectedMovements[0]) {
            selectedMovements.map((item) => {
                if (item.type === "income") total = total + item.amount;
            });
        }
        setIncomes(total);
    };

    const getTotalCosts = () => {
        let total = 0;
        if (selectedMovements && selectedMovements[0]) {
            selectedMovements.map((item) => {
                if (item.type === "cost") total = total + item.amount;
            });
        }
        setCosts(total);
    };

    const getRows = async () => {
        if (employeeSelected === 'Sin Asignar') {
            getAllWithoutEmployee().then(res => {
                setEmployeeTasks(res.data)
            }).catch(err => {
                enqueueSnackbar('Error al obtener las tareas', { variant: 'error' })
            })
            return
        } 

        if (employeeSelected) {
            getTasks(employeeSelected, setEmployeeTasks, enqueueSnackbar)

            getSalaryByEmployeeId(employeeSelected).then(res => {
                console.log(res)
                setEmployeeSelectedHours({
                    hours: res.workedHours,
                    salary: res.salary
                })
            }).catch(err => {
                console.log(err)
                enqueueSnackbar('Error al obtener el salario', { variant: 'error' })
            })
        } // * Si hay empleado seleccionado, se obtienen las tareas de ese empleado
    }

    const handleFinish = async (task) => {
        const res = await finishTask(task._id)
        if (res.status) {
            enqueueSnackbar(res.message, { variant: "success" });
            getRows()
        } else {
            enqueueSnackbar(res.message, { variant: "error" });
        }
    }

    const handleDelete = async (task) => {
        const res = await disableTask(task._id)
        if (res.status) {
            enqueueSnackbar(res.message, { variant: "success" });
            getRows()
        } else {
            enqueueSnackbar(res.message, { variant: "error" });
        }
    }

    const handleWorkingDay = async () => {
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

        // * Get if is exit or entry
        let entryOrExit = '';
        const keys = ['entry1', 'exit1', 'entry2', 'exit2', 'entry3', 'exit3'] // * keys de los campos de entrada y salida

        const res = await getADayOfEmployee(user._id, {
            month: monthToSend,
            day: dayToSend,
            year: yearToSend,
        })

        if (!res.success) return enqueueSnackbar('Ocurrió un error al analizar el día, intente de nuevo.', { variant: 'error' });

        if (!res.data) entryOrExit = 'entry' // * Si el documento no existe, significa que estamos en el inicio del día.

        if (res.success && res.data) {
            for (let i = 0; i < keys.length; i++) {
                if (!res.data[keys[i]]) {
                    entryOrExit = keys[i].includes('entry') ? 'entry' : 'exit';
                    break;
                }
            } // * obtenemos si es entrada o salida
        } // * Lo hacemos sólo si hay documento.


        if (entryOrExit === '') return enqueueSnackbar('Su jornada ya ha acabado! disfrute el día ✌️', {
            variant: 'info',
        })

        if (entryOrExit === 'entry') {
            createWorkingDayMark({
                month: monthToSend,
                day: dayToSend,
                year: yearToSend,
                hour: `${hours}:${minutes}`,
            }).then((res) => {
                enqueueSnackbar(res.msg, { variant: 'success' });
            }).catch((err) => {
                enqueueSnackbar('No se ha podido marcar la jornada', { variant: 'error' });
            });
        } else if (entryOrExit === 'exit') {
            setCommentModal(true);
        }
    } // * función para marcar la jornada, obtenemos la hora actual y la mandamos

    useEffect(() => {
        getBalanceData();
        getChargeAmount();
        return () => {
            setSelectedMovements([]);
        };
    }, [month, year]);

    useEffect(() => {
        getTotalIncomes();
        getTotalCosts();
        return () => {
            setIncomes(0);
            setCosts(0);
        };
    }, [selectedMovements]);

    useEffect(() => {
        getData();
        return () => {
            setMovements([]);
        };
    }, []);

    useEffect(() => {
        getRows()
        getAllEmployees().then(res => {
            setEmployees(res.users)
        }).catch(err => {
            enqueueSnackbar('Error al obtener los empleados', { variant: 'error' })
        })

        getSalaries(user._id).then(res => {
            setAllEnterpriseSalaries(res)
        }).catch(err => {
            enqueueSnackbar('Error al obtener los salarios', { variant: 'error' })
        })

        getTotalDebts().then(res => {
            setTotalDebts(res.total)
        }).catch(err => {
            enqueueSnackbar('Error al obtener los salarios', { variant: 'error' })
        })
    }, [])

    useEffect(() => {
        getRows()
    }, [employeeSelected])




    return (
        <Grid container >
            {newChargeModal && <ChargeModal setModalCharge={setNewChargeModal} getChargeAmount={getChargeAmount} setEditingCharge={setEditingCharge} />}
            {editingCharge && <ChargeModal editing setModalCharge={setNewChargeModal} getChargeAmount={getChargeAmount} editingCharge={editingCharge} setEditingCharge={setEditingCharge}/>}

            {milestonesModal && <MilestonesModal task={milestonesModal} handleClose={() => setMilestonesModal(false)} />}
            {commentModal && (
                <CommentWorkingDayModal handleClose={() => setCommentModal(false)} setDataWorkingMonth={(data) => true}
                    yearSelected={new Date().getFullYear} monthSelected={new Date().getMonth() + 1} enqueueSnackbar={enqueueSnackbar} />
            )}

            <Grid item xs={12} sm={6} sx={{ backgroundColor: 'primary.main', borderRadius: 3 }} p={4}>
                <Box display="flex" flexDirection="row" sx={{ width: '100%', color: 'white' }}>
                    <TextField
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        sx={{ width: '50%', background: 'white', textAlign: 'center', borderRadius: 1 }}
                        inputProps={{ style: { textAlign: "center" } }}
                    />

                    <Box marginLeft={1} sx={{ textAlign: 'center', width: '25%' }}>
                        <Typography variant="h6">Ingresos</Typography>
                        <Typography>${formatNumber(incomes)}</Typography>
                    </Box>

                    <Box marginLeft={1} sx={{ textAlign: 'center', width: '25%' }}>
                        <Typography variant="h6">Balance</Typography>
                        <Typography>{incomes - costs < 0 && "-"}$
                            {incomes - costs > 0
                                ? formatNumber(incomes - costs)
                                : formatNumber((incomes - costs) * -1)
                            }
                        </Typography>
                    </Box>
                </Box>

                <Box marginTop={1} display="flex" flexDirection="row" sx={{ width: '100%' }}>
                    <Select sx={{ width: '50%', background: 'white', textAlign: 'center' }} placeholder='Mes'
                        value={month} onChange={(e) => setMonth(e.target.value)}>
                        {months.map((item) => (
                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                        ))}
                    </Select>

                    <Box marginLeft={1} sx={{ textAlign: 'center', width: '25%', color: 'white' }}>
                        <Typography variant="h6">Egresos</Typography>
                        <Typography>${formatNumber(costs)}</Typography>
                    </Box>

                    <Box marginLeft={1} sx={{ textAlign: 'center', width: '25%', color: 'white' }}>
                        <Typography variant="h6">A pagar</Typography>
                        <Typography>${formatNumber(chargesAmount)}</Typography>
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12} sm={5.5} sx={{ color: 'white', textAlign: 'center' }} ml={2}>
                <Grid container sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Grid item xs={12} sm={5.8} sx={{ backgroundColor: 'primary.main', borderRadius: 3 }} p={4}>
                        <Typography variant="h6">Deuda total</Typography>
                        <Typography>${totalDebts}</Typography>

                        <Button sx={{ width: '100%', background: 'white', mt: 2 }}
                            onClick={() => navigate(routes.debts)}>DEUDA</Button>
                    </Grid>

                    <Grid item xs={12} sm={5.8} sx={{ backgroundColor: 'primary.main', borderRadius: 3 }} p={4}>
                        <Box display="flex" flexDirection="row" sx={{ width: '100%', color: 'white' }}>
                            <Box sx={{ width: '50%', textAlign: 'center' }}>
                                <Typography variant="h6">H. Totales</Typography>
                                <Typography>{allEnterpriseSalaries.workedHours}</Typography>
                            </Box>

                            <Box sx={{ width: '50%', textAlign: 'center' }}>
                                <Typography variant="h6">A pagar</Typography>
                                <Typography>${allEnterpriseSalaries.salary}</Typography>
                            </Box>
                        </Box>

                        <Button sx={{ width: '100%', background: 'white', mt: 2 }} 
                        onClick={() => handleWorkingDay()}>MARCAR</Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} sm={7} sx={{ borderRadius: 3, textAlign: 'center' }} p={4} >
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Button sx={{ width: '50%', backgroundColor: 'primary.main', color: 'white' }}
                            onClick={() => setNewChargeModal(!newChargeModal)}>
                            Programar cobro
                        </Button>

                        <Box marginTop={1} sx={{ width: '50%', textAlign: 'center' }}>
                            <Typography variant="h6">Esperados</Typography>
                            <Typography>${formatNumber(chargesAmount)}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <ChargesTable setEditingCharge={setEditingCharge} getChargeAmount={getChargeAmount} charges={charges} getBalanceData={getBalanceData} setCharges={setCharges} />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} sm={4.5} ml={2} mt={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Select sx={{ width: '50%', background: 'white' }} label='Empleado' defaultValue='Sin Asignar' value={employeeSelected} onChange={(e) => setEmployeeSelected(e.target.value)}>
                            <MenuItem value='Sin Asignar'>Sin asignar</MenuItem>
  
                            {employees && employees[0] && employees.map((employee) => {
                                return (
                                    <MenuItem key={employee._id} value={employee._id}>{employee.name}</MenuItem>
                                )
                            })}
                        </Select>

                        <Box marginTop={1} sx={{ width: '25%', textAlign: 'center' }}>
                            <Typography variant="h6">Horas totales</Typography>
                            <Typography>{employeeSelectedHours.hours}</Typography>
                        </Box>

                        <Box marginTop={1} sx={{ width: '25%', textAlign: 'center' }}>
                            <Typography variant="h6">A pagar</Typography>
                            <Typography>{employeeSelectedHours.salary}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {tasksEmployeesColumns && tasksEmployeesColumns[0] && tasksEmployeesColumns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {employeeTasks && employeeTasks[0] && employeeTasks.map((row) => {
                                    return (
                                        row.tasks && row.tasks[0] && row.tasks.map((task, index) => {
                                            const fechaParsed = task.createdAt.split("T")[0].replaceAll("-", "/")
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code} sx={{
                                                    borderLeft: task.review ? '3px solid yellow' : 'auto',
                                                }}>
                                                    <TableCell align='center'>{index + 1}</TableCell>
                                                    <TableCell align='center'>{task.description}</TableCell>
                                                    <TableCell align='center'>{task.activity}</TableCell>
                                                    <TableCell align='right'>{fechaParsed}</TableCell>

                                                    <TableCell align='center'>
                                                        <Done onClick={() => handleFinish(task)} color='success' sx={{ cursor: 'pointer', ml: 1 }} />
                                                        <Delete onClick={() => handleDelete(task)} color='error' sx={{ cursor: 'pointer', ml: 1 }} />
                                                        <FormatListBulleted onClick={() => setMilestonesModal(task)} sx={{ cursor: 'pointer', ml: 1 }} />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>


            </Grid>
        </Grid>
    );
}
