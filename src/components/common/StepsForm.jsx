import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const StepsForm = ({ steps, setSteps, title }) => {
  const [text, setText] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const schema = yup
    .object({
      name: yup.string().required("Nombre requerido"),
      description: yup.string(),
      time: yup.string(),
      fileType: yup.string(),
    })
    .required();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const handleCreate = (data) => {
    setSteps([...steps, data]);
    enqueueSnackbar(`${text} creada con éxito`, { variant: "success" });
    reset();
  };
  useEffect(() => {
    switch (title) {
      case "Pasos":
        setText("Paso");
        break;
      case "Pre entregas":
        setText("Pre entrega");
        break;
      case "Entregas finales":
        setText("Entrega final");
        break;
    }
  }, [title]);

  return (
    <Card sx={{ mb: 2, bgcolor: "primary.main" }}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography sx={{ mb: 1, mr: 2 }} color="text.main" variant="h5">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ mb: 1 }} color="text.main">
              Nombre
            </Typography>
            <FormControl
              fullWidth
              variant="outlined"
              name="name"
              key="name"
              sx={{ mb: 2 }}
            >
              <OutlinedInput
                type="text"
                {...register("name")}
                sx={{ bgcolor: "text.main" }}
              />
              {errors && errors.name && (
                <Typography sx={{ color: "text.error" }}>
                  {errors.name.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ mb: 1 }} color="text.main">
              Descripción
            </Typography>
            <FormControl
              sx={{ mb: 2 }}
              variant="outlined"
              fullWidth
              name="Descripción"
              key="description"
            >
              <OutlinedInput
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                sx={{ bgcolor: "text.main" }}
                {...register("description")}
              />
              {errors && errors.description && (
                <Typography sx={{ color: "text.error" }}>
                  {errors.description.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ mb: 1, mr: 2 }} color="text.main">
              {title === "Pasos"
                ? "Tiempo (calculado en días)"
                : "Tipo de archivo de entrega"}
            </Typography>
            <FormControl
              sx={{ mb: 2 }}
              name={
                title === "Pasos"
                  ? "Tiempo (calculado en días)"
                  : "Tipo de archivo de entrega"
              }
              key={title === "Pasos" ? "time" : "fileType"}
            >
              <OutlinedInput
                type={title === "Pasos" ? "number" : "text"}
                {...register(title === "Pasos" ? "time" : "fileType")}
                sx={{ bgcolor: "text.main" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit(handleCreate)}
            >
              Crear {text}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StepsForm;
