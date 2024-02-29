import { Button, Card, FormControl, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { linkDiscordAccount, getUserInfo } from '../api/axios'
import { useSnackbar } from 'notistack'
import LoadingModal from '../components/common/LoadingModal'

export default function DiscordLink() {
    const [discordId, setDiscordId] = useState('');
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('QUERCU_USER_INFO'))
    
    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault()
        linkDiscordAccount(discordId)
            .then(res => {
                console.log(res)
                enqueueSnackbar(res.message, {variant: 'success'})
                setLoading(false)

                getUserInfo();
            })
            .catch(err => {
                console.log(err)
                enqueueSnackbar('Ha ocurrido un error al enlazar con Discord.', {variant: 'error'})
                setLoading(false)
            })
    }

    return (
        <Grid container justifyContent="center" alignItems="center" p={5}>
            {loading && <LoadingModal />}

            <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Enlace a Discord</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>Para poder enlazar tu cuenta de Discord, deberás activar las opciones de desarrollador en la configuración de tu cuenta.</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>Una vez activadas, deberás copiar el id de tu cuenta, hacienote click derecho en tu perfil y "Copiar ID".</Typography>

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <TextField label="ID de Discord" variant="outlined" defaultValue={user.discordId} onChange={(e) => setDiscordId(e.target.value)} />
                </FormControl>

                {discordId && <FormControl fullWidth sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={handleSubmit}>Enlazar</Button>
                </FormControl>}
            </Card>
        </Grid>
    )
}
