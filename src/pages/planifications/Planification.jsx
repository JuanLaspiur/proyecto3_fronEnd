import React from 'react'
import { useParams } from 'react-router-dom'
import { getPlanification,getAllPositions, updatePlanification } from '../../api/axios'
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Button, Card, FormControl, Grid, InputLabel, Select, TextField, Typography } from '@mui/material';
import routes from '../../router/routes';
import { PageHeader } from '../../components/common/PageHeader';
import StepsAccordion from '../../components/common/StepsAccordion';
import { Edit } from '@mui/icons-material';
import AddPlanificationStepModal from '../../components/planifications/AddPlanificationStepModal';

export default function Planification() {
    const { id } = useParams();
    const [planification, setPlanification] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [editingInfo, setEditingInfo] = useState(false);
    const [positions, setPositions] = useState([])
    const [infoForm, setInfoForm] = useState(planification)
    const [addPlanificationStepModal, setAddPlanificationStepModal] = useState(false)

    useEffect(() => {
        getPlanification(id).then((res) => {
            setPlanification(res.planning);
            setInfoForm({
                name: res.planning.name,
                description: res.planning.description
            })
        }).catch((err) => {
            enqueueSnackbar('Error al obtener la planificación!', { variant: 'error' });
        })

        getAllPositions().then((res) => {
            setPositions(res.positions)
        }).catch((err) => {
            enqueueSnackbar('Error al obtener los cargos!', { variant: 'error' });
        })
    }, [id]);

    const page_title = `Planificación: ${planification && planification.name}`;
    const breadcrumbs = [
        {
            id: 1,
            title: "Ventas",
        },
        {
            id: 2,
            title: "Listado de planificaciones",
            link_to: routes.planifications_list,
        },
        {
            id: 3,
            title: planification && planification.name,
            link_to: `${routes.planifications_list}/${id}`,
        }
    ];

    const handleInfoChange = (e) => {
        if (e.target.name === "positions") {
            const findedPosition = positions.find((position) => position.name === e.target.value)

            return setInfoForm({
                ...infoForm,
                positions: [findedPosition._id]
            })
        }

        setInfoForm({
            ...infoForm,
            [e.target.name]: e.target.value
        })
    }

    const deleteFunction = (item, prop) => {
        console.log(item);
        setPlanification({
            ...planification,
            [prop]: planification[prop].filter((step) => step.name !== item.name && step.description !== item.description && step.fileType !== item.fileType),
        });

        updatePlanification(id, {
            [prop]: planification[prop].filter((step) => step.name !== item.name && step.description !== item.description && step.fileType !== item.fileType),
        }).then((res) => {
            enqueueSnackbar('Etapa eliminada!', { variant: 'success' });
        }).catch((err) => {
            enqueueSnackbar('Error al eliminar la etapa!', { variant: 'error' });
        })
    }

    const addStep = (stepType) => setAddPlanificationStepModal(stepType)

    const handleSendInfo = () => {
        updatePlanification(id, infoForm).then((res) => {
            enqueueSnackbar('Información actualizada!', { variant: 'success' });
            setEditingInfo(false);

            getPlanification(id).then((res) => {
                setPlanification(res.planning);
                setInfoForm({
                    name: res.planning.name,
                    description: res.planning.description
                })
            }).catch((err) => {
                enqueueSnackbar('Error al obtener la planificación!', { variant: 'error' });
            })
        }).catch((err) => {
            enqueueSnackbar('Error al actualizar la información!', { variant: 'error' });
        })
    }

    if (planification) return (
        <Grid container spacing={3}>
            {addPlanificationStepModal && <AddPlanificationStepModal addPlanificationStepModal={addPlanificationStepModal} setAddPlanificationStepModal={setAddPlanificationStepModal} planification={planification} setPlanification={setPlanification} 
            enqueueSnackbar={enqueueSnackbar} />}

            <Grid item xs={12}>
                <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h5">Información general</Typography>
                            <Edit sx={{ float: 'right', cursor: 'pointer', transform: editingInfo ? 'rotate(-90deg)' : 'none', transition: 'all .1s ease-in' }} onClick={(e) => setEditingInfo(!editingInfo)} />

                            {!editingInfo && <>
                                <Typography variant="body1" sx={{ mt: 3 }}>Nombre: {planification.name && planification.name}</Typography>
                                <Typography variant="body1" sx={{ mt: 3 }}>Descripción: {planification.description && planification.description}</Typography>
                                <Typography variant="body1" sx={{ mt: 3 }}>Cargo: {planification.positions[0] && planification.positions[0].name}</Typography>
                            </>}

                            {editingInfo && <>
                                <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
                                    <TextField id="name" label="Nombre" variant="outlined" defaultValue={planification.name || ""} name="name" onChange={(e) => handleInfoChange(e)} />
                                </FormControl>

                                <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
                                    <TextField multiline rows={4} id="description" label="Descripción" variant="outlined" defaultValue={planification.description || ""} name="description" onChange={(e) => handleInfoChange(e)} />
                                </FormControl>

                                <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
                                    <InputLabel htmlFor="positions">Cargo</InputLabel>
                                    <Select native label="Cargo" inputProps={{ name: 'positions', id: 'positions' }} onChange={(e) => handleInfoChange(e)} name="positions">
                                        {positions.map((position) => <option key={position.name} value={position.id}>{position.name}</option>)}
                                    </Select>
                                </FormControl>

                                <Button variant="contained" sx={{ mt: 3 }} fullWidth onClick={(e) => handleSendInfo(e)}>Guardar</Button>
                            </>}
                        </Card>
                    </Grid>

                    <Grid item xs={6}>
                        <StepsAccordion addStep={addStep} stepName="preDelivery" deleteFunction={deleteFunction} adminView steps={planification.preDelivery} title="Pre-Entrega" />

                        <StepsAccordion addStep={addStep} stepName="steps" deleteFunction={deleteFunction} adminView steps={planification.steps} title="Entrega" />

                        <StepsAccordion addStep={addStep} stepName="finalDelivery" deleteFunction={deleteFunction} adminView steps={planification.finalDelivery} title="Entrega Final" />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}