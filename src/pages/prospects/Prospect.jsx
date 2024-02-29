import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import routes from "../../router/routes";
import { PageHeader } from "../../components/common/PageHeader";
import { createNewProspect, editProspect, getProspectsById } from "../../api/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";

const Prospect = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [selected, setSelected] = useState("");
  const [schema, setSchema] = useState("");
  const [prospectData, setProspectData] = useState({});

  const getProspect = async () => {
    const res = await getProspectsById(id);
    if (res.success) {
      console.log("prospect:", res.prospect);
      setProspectData(res.prospect);
      setSelected(res.prospect.type)
    }
  };

  useEffect(() => {
    getProspect()
  }, [])
  

  useEffect(() => {
    switch (selected) {
      case 0:
        setSchema(
          yup
            .object({
              name: yup.string().required("Nombre requerido"),
              identificationNumber: yup.string(),
              country: yup.string(),
              city: yup.string(),
              address: yup.string(),
              email: yup.string(),
              phoneNumber: yup.string(),
              personInCharge: yup
                .string()
                .required("Nombre de persona a cargo requerido"),
              personPhoneNumber: yup
                .string()
                .required("Teléfono de persona a cargo requerido"),
              personEmail: yup
                .string()
                .required("Email de persona a cargo requerido"),
            })
            .required()
        );
        break;
      case 1:
        setSchema(
          yup
            .object({
              name: yup.string().required("Nombre requerido"),
              identificationNumber: yup.string(),
              country: yup.string(),
              city: yup.string(),
              address: yup.string(),
              email: yup.string().required("Email requerido"),
              phoneNumber: yup.string().required("Teléfono requerido"),
            })
            .required()
        );
        break;
      default:
        setSchema("");
        break;
    }
  }, [selected]);

  const handleChangeSelected = (event) => {
    setSelected(event.target.value);
  };

  const inputs_juridic = [
    { id: 0, name: "name", label: "Nombre", type: "text" },
    {
      id: 1,
      name: "identificationNumber",
      label: "Número de identificación",
      type: "text",
    },
    { id: 2, name: "country", label: "País", type: "text" },
    { id: 3, name: "city", label: "Ciudad", type: "text" },
    { id: 4, name: "address", label: "Dirección", type: "text" },
    { id: 5, name: "email", label: "Email", type: "text" },
    { id: 6, name: "phoneNumber", label: "Teléfono", type: "text" },
    { id: 7, name: "personInCharge", label: "Persona a cargo", type: "text" },
    {
      id: 8,
      name: "personPhoneNumber",
      label: "Teléfono persona a cargo",
      type: "text",
    },
    {
      id: 9,
      name: "personEmail",
      label: "Email persona a cargo",
      type: "text",
    },
  ];
  const inputs_fisic = [
    { id: 0, name: "name", label: "Nombre", type: "text" },
    {
      id: 1,
      name: "identificationNumber",
      label: "Número de identificación",
      type: "text",
    },
    { id: 2, name: "country", label: "País", type: "text" },
    { id: 3, name: "city", label: "Ciudad", type: "text" },
    { id: 4, name: "address", label: "Dirección", type: "text" },
    { id: 5, name: "email", label: "Email", type: "text" },
    { id: 6, name: "phoneNumber", label: "Teléfono", type: "text" },
  ];

  const page_title = `Prospecto`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Clientes",
    },
    {
      id: 2,
      title: "Listado de prospectos",
      link_to: routes.prospects_list,
    },
    {
      id: 3,
      title: "Prospecto",
    },
  ];

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleForm = async (values) => {
    const data = {
      ...values,
      type: selected,
    };
    const response = await editProspect(data, id);
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      setTimeout(() => {
        navigate(routes.prospects_list);
      }, 1000);
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
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel>Tipo de Persona</InputLabel>
                  <Select
                    value={selected}
                    label="Tipo de Persona"
                    onChange={handleChangeSelected}
                  >
                    <MenuItem value={0}>Persona júridica</MenuItem>
                    <MenuItem value={1}>Persona física</MenuItem>
                  </Select>
                </FormControl>
                {selected === 0
                  ? inputs_juridic.map((item) => (
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
                          defaultValue={prospectData[item.name] || ""}
                        />
                        {errors && errors[item.name] && (
                          <Typography color={"text.error"} sx={{ mt: 2 }}>
                            *{errors[item.name].message}
                          </Typography>
                        )}
                      </FormControl>
                    ))
                  : selected === 1
                  ? inputs_fisic.map((item) => (
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
                          defaultValue={prospectData[item.name] || ""}
                        />
                        {errors && errors[item.name] && (
                          <Typography color={"text.error"} sx={{ mt: 2 }}>
                            *{errors[item.name].message}
                          </Typography>
                        )}
                      </FormControl>
                    ))
                  : null}
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
              Editar empresa
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Prospect;
