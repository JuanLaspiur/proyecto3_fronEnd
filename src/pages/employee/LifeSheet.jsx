import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import routes from '../../router/routes';
import { PageHeader } from '../../components/common/PageHeader';
import { useSnackbar } from 'notistack';
import { getWorkingsDays, createWorkingDayMark, getEmployeeIdWorkingsDays, getADayOfEmployee } from '../../api/axios';
import CommentWorkingDayModal from '../../components/employees/lifesheet/CommentWorkingDayModal';
import { Comment } from '@mui/icons-material';
import CommentsOfDayView from '../../components/employees/lifesheet/CommentsOfDayView';

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
]; // * meses del año

const years = [2022, 2023, 2024]; // * años a mostrar en el select

function diasDelMesEnAnio(mes, anio) {
    const ultimoDiaDelMes = new Date(anio, mes, 0).getDate();
    return ultimoDiaDelMes;
} // * obtenemos los días del mes en el año seleccionado

export default function LifeSheet({ adminView }) {
    const { enqueueSnackbar } = useSnackbar();
    const [dataWorkingMonth, setDataWorkingMonth] = useState([]) // * datos de las jornadas del mes seleccionado
    const [paymentData, setPaymentData] = useState({
        totalMinutes: 0,
        totalHours: 0,
        totalPayment: 0,
    }) // * datos de los pagos del mes seleccionado (minutos, horas, ingreso)
    const date = new Date();
    const page_title = `Tu hoja de vida`;
    const breadcrumbs = [{
        id: 1,
        title: "Usuario",
    }, {
        id: 2,
        title: "Hoja de vida",
        link_to: routes.employeesList,
    },
    ];
    const actualDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        day: date.getDate()
    }; // * obtenemos el mes, año y día actual
    const { id } = useParams();
    const [salaryPerHour, setSalaryPerHour] = useState(0);
    const [monthSelected, setMonthSelected] = useState(actualDate.month);
    const [yearSelected, setYearSelected] = useState(actualDate.year);
    const user = JSON.parse(localStorage.getItem('QUERCU_USER_INFO'));
    const [commentModal, setCommentModal] = useState(false);
    const [viewComments, setViewComments] = useState(false)

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
                const keyEntryOrExit = keys[i];
                if (!res.data[keyEntryOrExit]) {
                    entryOrExit = keyEntryOrExit.includes('entry') ? 'entry' : 'exit';
                    break;
                }
            } // * obtenemos si es entrada o salida
        } // * Lo hacemos sólo si hay documento.


        if(entryOrExit === '') return enqueueSnackbar('Su jornada ya ha acabado! disfrute el día ✌️', {
            variant: 'info',
        })

        if (entryOrExit === 'entry') {
            createWorkingDayMark({
                month: monthToSend,
                day: dayToSend,
                year: yearToSend,
                hour: `${hours}:${minutes}`,
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
            }).catch((err) => {
                enqueueSnackbar('No se ha podido marcar la jornada', { variant: 'error' });
            });
        } else if (entryOrExit === 'exit') {
            setCommentModal(true);
        }
    } // * función para marcar la jornada, obtenemos la hora actual y la mandamos

    useEffect(() => {
        if (!adminView) {
            getWorkingsDays({
                month: monthSelected,
                year: yearSelected,
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
                setSalaryPerHour(res.salary);
                enqueueSnackbar('Jornadas de este mes cargadas correctamente', { variant: 'success' });
            }).catch((err) => {
                enqueueSnackbar('No se han podido traer las jornadas de este mes.', { variant: 'error' });
            });
        };

        if (adminView) {
            getEmployeeIdWorkingsDays(id, {
                month: monthSelected,
                year: yearSelected,
            })
                .then((res) => {
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
                    setSalaryPerHour(res.salary);
                    enqueueSnackbar('Jornadas de este mes cargadas correctamente', { variant: 'success' });
                }).catch((err) => {
                    enqueueSnackbar('No se han podido traer las jornadas de este mes.', { variant: 'error' });
                });
        }
    }, [monthSelected, yearSelected]);

    useEffect(() => {
        let totalMinutes = 0;

        dataWorkingMonth.forEach((day) => {
            if (day.totalMinutes) totalMinutes = Math.abs(totalMinutes + parseInt(day.totalMinutes));
        });

        const totalHours = (totalMinutes / 60).toFixed(2);

        const totalPayment = (totalHours * salaryPerHour).toFixed(2);

        setPaymentData({
            totalMinutes,
            totalHours,
            totalPayment,
        });
    }, [dataWorkingMonth])

    return (
        <Grid container>
            {commentModal && (
                <CommentWorkingDayModal handleClose={() => setCommentModal(false)} setDataWorkingMonth={setDataWorkingMonth}
                    yearSelected={yearSelected} monthSelected={monthSelected} enqueueSnackbar={enqueueSnackbar} />
            )}

            {viewComments && (
                <CommentsOfDayView handleClose={() => setViewComments(false)} day={viewComments} month={monthSelected} year={yearSelected}/>
            )}

            <Grid item xs={12}>
                <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2} mb={5}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Año</InputLabel>
                            <Select value={yearSelected} onChange={(e) => setYearSelected(e.target.value)} label="Año">
                                {years.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Mes</InputLabel>
                            <Select value={monthSelected} label="Mes" name="month" options={months} onChange={(e) => setMonthSelected(e.target.value)}>
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {!adminView && (
                        <Grid item xs={6} >
                            <Button fullWidth variant="contained" color="primary" sx={{
                                height: 50,
                            }} disabled={
                                monthSelected !== actualDate.month || yearSelected !== actualDate.year
                            } onClick={(e) => handleWorkingDay(e)}>
                                Marcar jornada
                            </Button>
                        </Grid>
                    )}

                    <Grid item xs={adminView ? 12 : 6}>
                        <Grid container spacing={1}>
                            <Grid item xs={4} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                fontSize: 20
                            }}>
                                <strong style={{ fontSize: 20, marginBottom: 10 }}>Total Min</strong>
                                {paymentData.totalMinutes}
                            </Grid>

                            <Grid item xs={4} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                fontSize: 20
                            }}>
                                <strong style={{ fontSize: 20, marginBottom: 10 }}>Total Horas</strong>
                                {paymentData.totalHours}
                            </Grid>

                            <Grid item xs={4} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                fontSize: 20
                            }}>
                                <strong style={{ fontSize: 20, marginBottom: 10 }}>Ingreso</strong>
                                {paymentData.totalPayment}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Día</TableCell>
                                    <TableCell align="center">Entrada</TableCell>
                                    <TableCell align="center">Salida</TableCell>
                                    <TableCell align="center">Entrada</TableCell>
                                    <TableCell align="center">Salida</TableCell>
                                    <TableCell align="center">Entrada</TableCell>
                                    <TableCell align="center">Salida</TableCell>
                                    <TableCell align="center">Total Minutos</TableCell>
                                    <TableCell align="center">Comentarios</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataWorkingMonth.map((row) => (
                                    <TableRow key={row.day}>
                                        <TableCell component="th" scope="row">
                                            {row.day}
                                        </TableCell>
                                        <TableCell align="center">{row.entry1}</TableCell>
                                        <TableCell align="center">{row.exit1}</TableCell>
                                        <TableCell align="center">{row.entry2}</TableCell>
                                        <TableCell align="center">{row.exit2}</TableCell>
                                        <TableCell align="center">{row.entry3}</TableCell>
                                        <TableCell align="center">{row.exit3}</TableCell>
                                        <TableCell align="center">{row.totalMinutes}</TableCell>
                                        <TableCell align='center'>
                                            <Button variant="contained" color="primary" sx={{ width: '100%' }} onClick={() => setViewComments(row)}>
                                                <Comment sx={{ cursor: 'pointer' }} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
    );
}
