import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import StepsForm from "../common/StepsForm";
import StepsAccordion from "../common/StepsAccordion";
import { createNewPlanning, getAllPositions } from "../../api/axios";
import routes from "../../router/routes";
import { useNavigate } from "react-router-dom";

const PlanificationForm = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [positions, setPositions] = useState([]);
  const [prePresentation, setPrePresentation] = useState([]);
  const [finalPresentation, setFinalPresentation] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const getData = async () => {
    const data = await getAllPositions();
    setPositions(data.positions);
  };
  useEffect(() => {
    getData();
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const handleCreate = async (data) => {
    let planification = {
      ...data,
      steps: steps,
      preDelivery: prePresentation,
      finalDelivery: finalPresentation,
      positions: selectedPositions,
    };
    const response = await createNewPlanning(planification);
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      setTimeout(() => {
        navigate(routes.planifications_list);
      }, 1000);
    } else {
      enqueueSnackbar(response.msg, { variant: "error" });
    }
    reset();
  };
  const handleChangeSelected = (event) => {
    setSelectedPositions(event.target.value);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormControl
          fullWidth
          variant="outlined"
          name="nombre"
          key="name"
          sx={{ mb: 2 }}
        >
          <InputLabel>Nombre</InputLabel>
          <OutlinedInput type="text" {...register("name")} label="Nombre" />
        </FormControl>
        <FormControl
          sx={{ mb: 2 }}
          fullWidth
          name="Descripción"
          key="description"
        >
          <TextField
            label="Descripción"
            multiline
            rows={4}
            fullWidth
            {...register("description")}
          />
        </FormControl>
        <StepsForm steps={steps} setSteps={setSteps} title="Pasos" />
        <StepsForm
          steps={prePresentation}
          setSteps={setPrePresentation}
          title="Pre entregas"
        />
        <StepsForm
          steps={finalPresentation}
          setSteps={setFinalPresentation}
          title="Entregas finales"
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Seleccionar cargo</InputLabel>
          <Select
            name="positions"
            value={selectedPositions}
            label="Seleccionar cargo"
            onChange={handleChangeSelected}
            renderValue={(selected) => {
              let select = [];
              selected &&
                selected.map((item) => {
                  let data = positions.find((position) => position._id === item );
                  select.push(`${data.name} - `);
                });
              return select;
            }}
            multiple
          >
            {positions &&
              positions[0] &&
              positions.map((item, index) => (
                <MenuItem value={item._id} key={index}>
                  <Checkbox
                    checked={selectedPositions.indexOf(item._id) > -1}
                  />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleSubmit(handleCreate)}
          sx={{ mb: 5 }}
        >
          Crear planificación
        </Button>
      </Grid>
      <Grid item xs={6}>
        {steps && (
          <StepsAccordion steps={steps} setSteps={setSteps} title="Pasos" />
        )}
        {prePresentation && (
          <StepsAccordion
            steps={prePresentation}
            setSteps={setPrePresentation}
            title="Pre entregas"
          />
        )}
        {finalPresentation && (
          <StepsAccordion
            steps={finalPresentation}
            setSteps={setFinalPresentation}
            title="Entregas finales"
          />
        )}
      </Grid>
    </Grid>
  );
};

export default PlanificationForm;
