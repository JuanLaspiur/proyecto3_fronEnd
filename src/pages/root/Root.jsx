import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createNewUser } from "../../api/axios";
import { useSnackbar } from "notistack";
import routes from "../../router/routes";
import { PageHeader } from "../../components/common/PageHeader";

const Root = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const inputs = [
    { id: 0, name: "email", label: "Email", type: "text" },
    {
      id: 1,
      name: "password",
      label: "Contraseña",
      type: showPassword ? "text" : "password",
      adornment: (
        <InputAdornment position="end">
          <IconButton onClick={handleClickShowPassword} edge="end">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    },
    { id: 2, name: "name", label: "Nombre", type: "text" },
  ];

  const page_title = `Nueva empresa`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Root",
    },
    {
      id: 2,
      title: "Nueva empresa",
      link_to: routes.root,
    },
  ];

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleForm = async (values) => {
    const data = {
      email: values.email,
      password: values.password,
      name: values.name,
      role: [1],
    };
    const response = await createNewUser(data);
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      reset();
    } else {
      enqueueSnackbar(response.msg, { variant: "error" });
    }
  };

  return (
    <Grid
      container
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={6} sx={{ my: 5 }}>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                {inputs.map((item) => (
                  <FormControl
                    sx={{ m: 1 }}
                    fullWidth
                    variant="outlined"
                    name={item.name}
                    key={item.id}
                  >
                    <InputLabel>{item.label}</InputLabel>
                    <OutlinedInput
                      type={item.type}
                      {...register(item.name)}
                      label={item.label}
                      endAdornment={item.adornment ? item.adornment : null}
                    />
                  </FormControl>
                ))}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button variant="contained" onClick={handleSubmit(handleForm)}>
              Crear nueva empresa
            </Button>
          </CardActions>
        </Card>
      </Grid>

    </Grid>
  );
};

export default Root;
