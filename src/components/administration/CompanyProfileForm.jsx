import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, Typography } from '@mui/material'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CompanyProfileForm = () => {
  return (
    <Grid container>
        <Grid item xs={12}>
        <Accordion disableGutters defaultExpanded expanded sx={{textAlign: "center"}}>
            <AccordionSummary classes={{content: {justifyContent: "center"}}}>
              <Typography variant='h5'>Cambiar información de perfil</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography >Detalle</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion disableGutters>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant='h5'>Cambiar contraseña
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography >Detalle</Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
    </Grid>
  )
}

export default CompanyProfileForm