import React, { useEffect, useState } from 'react'
import { editEmployee, getEmployeeById } from '../../api/employees';
import { useParams } from 'react-router-dom';
import { Button, Card, CardContent, FormControl, Grid, InputLabel, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import { getAllAreas, getPositionsByDepartamentId, findDepartamentsByArea } from '../../api/axios';
import { useSnackbar } from 'notistack';

const EmployeeEdit = () => {
  const {id} = useParams()
  const { enqueueSnackbar } = useSnackbar();
  const [areas, setAreas] = useState([])
  const [departaments, setDepartaments] = useState([])
  const [positions, setPositions] = useState([])
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    birthDate: "",
    cellphone: "",
    city: "",
    civilStatus: "",
    country: "",
    genre: "",
    identificationNumber: "",
    area: "",
    department: "",
    position: "",
    salaryPerHour: 0,
  })

  const getData = async () => {
    const res = await getEmployeeById(id);
    if (res.success) {
      setForm({
        name: res.user.name ? res.user.name : "",
        email: res.user.email ? res.user.email : "",
        address: res.user.address ? res.user.address : "",
        birthDate: res.user.birthDate ? res.user.birthDate : "",
        cellphone: res.user.cellphone ? res.user.cellphone : "",
        city: res.user.city ? res.user.city : "",
        civilStatus: res.user.civilStatus ? res.user.civilStatus : "",
        country: res.user.country ? res.user.country : "",
        genre: res.user.genre ? res.user.genre : "",
        identificationNumber: res.user.identificationNumber ? res.user.identificationNumber : "",
        area: res.user.area ? res.user.area : "",
        department: res.user.department ? res.user.department : "",
        position: res.user.position ? res.user.position : "",
        salaryPerHour: res.user.salaryPerHour ? res.user.salaryPerHour : 0 
      })
    }
    const response = await getAllAreas()
    if (response.success) {
      setAreas(response.areas)
    }
  };

  const getPositions = async () => {
    if (form.department){
      const response = await getPositionsByDepartamentId(form.department)
      if (response.success) {
        setPositions(response.positions)
      }
    }
  }

  const getDepartaments = async () => {
    const res = await findDepartamentsByArea(form.area)
    if (res.success){
      setDepartaments(res.data)
    }
  }

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const updateFormNumber = (e) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value).toFixed(1) });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setForm({ ...form, department: "", position: "" });
    setDepartaments([])
    setPositions([])
    getDepartaments()
  }, [form.area]);

  useEffect(() => {
    setPositions([])
    setForm({ ...form, position: "" });
    getPositions()
  }, [form.department]);

  const handleEdit = async () => {
    const res = await editEmployee(id, form)
    if (res.success){
      enqueueSnackbar(res.msg, { variant: "success" });
    } else {
      enqueueSnackbar(res.msg, { variant: "error" });
    }
  }

  const inputs = [
    { name: "name", value: form.name , label: "Nombre" , },
    { name: "email", value: form.email , label: "Email" , },
    { name: "address", value: form.address , label: "Dirección" , },
    { name: "birthDate", value: form.birthDate , label: "Fecha de Nacimiento" , },
    { name: "cellphone", value: form.cellphone , label: "Teléfono" , },
    { name: "city", value: form.city , label: "Ciudad" , },
    { name: "civilStatus", value: form.civilStatus , label: "Estado Civil" , },
    { name: "country", value: form.country , label: "Country" , },
    { name: "genre", value: form.genre , label: "Género" , },
    { name: "identificationNumber", value: form.identificationNumber , label: "Número de identificación" , },
    { name: "salaryPerHour", value: form.salaryPerHour , label: "Salario por hora" , type: "number"},
  ]
  return (
    <Grid container>
      <Grid item xs={12}>
        <Card sx={{display: "flex", justifyContent: "center"}}>
          <CardContent>
            <Grid container sx={{justifyContent: "center"}}>
                {inputs && inputs[0] && inputs.map((item, index)=>(
                  <Grid item xs={8} sx={{my:1}} key={index}>
                    <TextField value={item.value} name={item.name} onChange={item.type === "number" ? updateFormNumber : updateForm} label={item.label} fullWidth/>
                  </Grid >
                ))}
                {areas && areas[0] &&
                <Grid item xs={8} sx={{my:1}}>
                  <FormControl fullWidth >
                    <InputLabel>Área</InputLabel>
                    <Select
                      name={"area"}
                      value={form.area}
                      label={`Área`}
                      onChange={updateForm}
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
                }
                {form.area && departaments && departaments[0] &&
                <Grid item xs={8} sx={{my:1}}>
                  <FormControl fullWidth >
                    <InputLabel>Departamento</InputLabel>
                    <Select
                      name={"department"}
                      value={form.department}
                      label={`Departamento`}
                      onChange={updateForm}
                      renderValue={(selected) => {
                        let select = "";
                        let data = departaments.find((item) => item._id === selected);
                        if (data) select = data.name;
                        return select;
                      }}
                    >
                      {departaments.map((item, index) => (
                        <MenuItem value={item._id} key={index}>
                          <ListItemText primary={item.name} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                </Grid>
                }
                {form.department && positions && positions[0] &&
                <Grid item xs={8} sx={{my:1}}>
                  <FormControl fullWidth >
                    <InputLabel>Cargo</InputLabel>
                    <Select
                      name={"position"}
                      value={form.position}
                      label={`Cargo`}
                      onChange={updateForm}
                      renderValue={(selected) => {
                        let select = "";
                        let data = positions.find((item) => item._id === selected);
                        if (data) select = data.name;
                        return select;
                      }}
                    >
                      {positions.map((item, index) => (
                        <MenuItem value={item._id} key={index}>
                          <ListItemText primary={item.name} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                </Grid>
                }
                <Grid item xs={12} sx={{my:1, textAlign: "center"}}>
                  <Button variant="contained" onClick={handleEdit}>Editar</Button>
                </Grid>
                
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EmployeeEdit