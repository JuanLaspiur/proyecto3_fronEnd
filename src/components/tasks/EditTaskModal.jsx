import { Close } from "@mui/icons-material";
import { Card, CardContent, Grid, FormControl, MenuItem, Select, InputLabel, Typography, Button,
OutlinedInput } from "@mui/material";
import React, { useState, useContext } from 'react';
import { useEffect } from "react";
import { getAllContracts, getProjects } from "../../api/axios";
import { getAllEmployees } from "../../api/employees";
import { useSnackbar } from "notistack";
import { updateTask } from "../../api/tasks";
import TasksContext from "./Tasks.provider";

const EditTaskModal = ({ handleClose, task }) => {
  const [form, setForm] = useState({
    employees: [],
    contract: "",
    project: "",
  });
  const [users, setUsers] = useState([]);
  const [contracts, setContracts] = useState(false);
  const [projects, setProjects] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  let { getTasks } = useContext(TasksContext);

  useEffect(() => {
    getAllEmployees().then((res) => setUsers(res.users));
    getProjects().then((res) => setProjects(res.data))
    getAllContracts().then((res) => setContracts(res.contracts));

    if (task.employee && task.contract) {
      setForm({
        employee: task.employee._id || "",
        contract: task.contract._id || "",
      });
    }
  }, []);

  const handleChanges = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    updateTask(task._id, form).then((res) => {
      getTasks();
      enqueueSnackbar("Tarea actualizada", { variant: "success" });
      handleClose();
    }).catch((err) => {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Close onClick={handleClose} style={{ position: "absolute", top: 10, right: 40, cursor: "pointer", fontSize: 30 }} />

      <Card sx={{ width: '50%' }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">Asignar a usuario</Typography>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Contrato</InputLabel>
                <Select
                  value={form.contract}
                  label="Contrato"
                  onChange={(e) => handleChanges(e)}
                  name="contract"
                  fullWidth
                >
                  {contracts && contracts.map((contract) => <MenuItem value={contract._id}>
                    {contract.formNumber} - {contract.prospectOrClient.name} - {contract.plannings[0].name}
                  </MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Proyecto</InputLabel>
                <Select
                  value={form.project}
                  label="Proyecto"
                  onChange={(e) => handleChanges(e)}
                  name="project"
                  fullWidth
                >
                  {projects && projects.map((project) => <MenuItem value={project._id}>
                    {project.name}
                  </MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="demo-multiple-employees-label">Empleados</InputLabel>
                <Select
                  labelId="demo-multiple-employees-label"
                  id="demo-multiple-employees"
                  multiple
                  label="Empleados"
                  value={form.employees}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      employees: e.target.value
                    })
                  }}
                  input={<OutlinedInput label="name" />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}
                >
                  {users.map((user) => (
                    <MenuItem
                      key={user._id}
                      value={user._id}
                    >
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" sx={{ mt: 3, width: "100%" }} onClick={(e) => onSubmit(e)}>
                Asignar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTaskModal;