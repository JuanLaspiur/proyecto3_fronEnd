import { Close } from '@mui/icons-material'
import { Button, FormControl, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react';
import { updatePlanification } from '../../api/axios';

export default function AddPlanificationStepModal({ setAddPlanificationStepModal, addPlanificationStepModal, planification, setPlanification, enqueueSnackbar }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        time: ''
    })

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log({
            [addPlanificationStepModal]: [
                ...planification[addPlanificationStepModal],
                form
            ]
        })

        updatePlanification(planification._id, {
            [addPlanificationStepModal]: [
                ...planification[addPlanificationStepModal],
                form
            ]
        }).then((res) => {
            enqueueSnackbar('Paso agregado!', { variant: 'success' });
            setAddPlanificationStepModal(false)
            setPlanification({
                ...planification,
                [addPlanificationStepModal]: [
                    ...planification[addPlanificationStepModal],
                    form
                ]
            })
        }).catch((err) => {
            enqueueSnackbar('Error al agregar el paso!', { variant: 'error' });
        })
    }

    return (
        <Grid container sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999
        }}>
            <Close sx={{
                position: 'absolute',
                top: 50,
                right: 50,
                color: 'white',
                cursor: 'pointer',
                fontSize: 40
            }} onClick={() => setAddPlanificationStepModal(false)} />

            <Grid item sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                padding: 2
            }}>
                {addPlanificationStepModal === "preDelivery" && <Typography variant="h5" sx={{ textAlign: 'center' }}>Pre-Entrega</Typography> }
                {addPlanificationStepModal === "steps" && <Typography variant="h5" sx={{ textAlign: 'center' }}>Paso</Typography> }
                {addPlanificationStepModal === "finalDelivery" && <Typography variant="h5" sx={{ textAlign: 'center' }}>Post-Entrega</Typography> }
                
                <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
                    <TextField onChange={(e) => handleFormChange(e)} id="name" label="Nombre" variant="outlined" name="name" />
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
                    <TextField onChange={(e) => handleFormChange(e)} multiline rows={4} id="description" label="Descripción" variant="outlined" name="description" />
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
                    <TextField onChange={(e) => handleFormChange(e)} id="time" label="Tiempo (días)" variant="outlined" name="time" />
                </FormControl>

                <Button variant="contained" onClick={(e) => handleFormSubmit(e)} sx={{ mt: 3 }} fullWidth>Guardar</Button>
            </Grid>
        </Grid>
    )
}
