import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createNewPosition, getDepartamentbyAreaId } from "../../api/axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const CompanyConfigurationAccordionPosition = ({ areas }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [departaments, setDepartaments] = useState([]);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const handleCreate = async (data) => {
    let response = null;
    let info = null;
    info = Object.assign(data);
    info = { ...info, area: selectedArea, departament: selectedDepartament };
    if (!selectedArea || !selectedDepartament) {
      enqueueSnackbar("Debes completar todos los campos", { variant: "error" });
    } else {
      response = await createNewPosition(info);
      if (response.success) {
        enqueueSnackbar(response.msg, { variant: "success" });
        setTimeout(() => {
          navigate(0);
        }, 1000);
      } else {
        enqueueSnackbar(response.msg, { variant: "error" });
      }
    }
  };
  const getSelect = async () => {
    let payload = selectedArea;
    let response = await getDepartamentbyAreaId({ area: payload });
    setDepartaments(response.departaments);
  };
  const [selectedDepartament, setSelectedDepartament] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const handleChangeSelectedArea = (event) => {
    setSelectedArea(event.target.value);
  };
  const handleChangeSelected = (event) => {
    setSelectedDepartament(event.target.value);
  };
  useEffect(() => {
    getSelect();
  }, [selectedArea]);
  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Registro de cargo</Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <Grid container>
          <Grid item xs={11}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel>Seleccionar área</InputLabel>
              <Select
                name={"area"}
                value={selectedArea}
                label={`Seleccionar área`}
                onChange={handleChangeSelectedArea}
                renderValue={(selected) => {
                  let select = "";
                  let data = areas.find((item) => item._id === selected);
                  if (data) select = data.name;
                  return select;
                }}
              >
                {areas.map((item, index) => (
                  <MenuItem value={item._id} key={index}>
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={11}>
            {departaments && departaments[0] && (
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel>Seleccionar departamento</InputLabel>
                <Select
                  name={"departaments"}
                  value={selectedDepartament}
                  label={`Seleccionar departamento`}
                  onChange={handleChangeSelected}
                  renderValue={(selected) => {
                    let select = "";
                    let data = departaments.find(
                      (item) => item._id === selected
                    );
                    if (data) select = data.name;
                    return select;
                  }}
                >
                  {departaments &&
                    departaments[0] &&
                    departaments.map((item, index) => (
                      <MenuItem value={item._id} key={index}>
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </Grid>
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

export default CompanyConfigurationAccordionPosition;
