import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { useForm } from "react-hook-form";
import { createNewArea } from "../../api/axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const CompanyConfigurationAccordionArea = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const handleCreate = async (data) => {
    let response = null;
    response = await createNewArea(data);
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } else {
      enqueueSnackbar(response.msg, { variant: "error" });
    }
  };
  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Registro de área</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Grid container>
          <Grid item xs={11}>
            <FormControl
              sx={{ m: 1 }}
              fullWidth
              variant="outlined"
              name={"name"}
            >
              <InputLabel>Nombre</InputLabel>
              <OutlinedInput
                type={"text"}
                {...register("name")}
                label={"Nombre"}
                /* endAdornment={adornment ? adornment : null} */
              />
            </FormControl>
          </Grid>
          <Grid item xs={11}>
            <FormControl
              sx={{ m: 1 }}
              fullWidth
              variant="outlined"
              name={"description"}
            >
              <InputLabel>Descripción</InputLabel>
              <OutlinedInput
                type={"text"}
                {...register("description")}
                label={"Descripción"}
                /* endAdornment={adornment ? adornment : null} */
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={11}
            sx={{ display: "flex", justifyContent: "center", my: 2 }}
          >
            <Button variant="contained" onClick={handleSubmit(handleCreate)}>
              Crear
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default CompanyConfigurationAccordionArea;
