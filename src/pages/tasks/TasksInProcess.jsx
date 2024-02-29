import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getAllTasks,
  getByEmployee,
  finishTask,
  disableTask,
} from "../../api/tasks";
import {
  Delete,
  Done,
  FileCopy,
  FileUpload,
  FormatListBulleted,
  RemoveRedEye,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { getAllEmployees } from "../../api/employees";
import MilestonesModal from "../../components/tasks/MilestonesModal";
import { PageHeader } from "../../components/common/PageHeader";
import routes from "../../router/routes";

const columns = [
  { id: "activity", label: "Tarea", minWidth: 100, align: "center" },
  { id: "project", label: "Proyecto", minWidth: 100, align: "center" },
  { id: "client", label: "Cliente", minWidth: 100, align: "center" },
  { id: "date", label: "Fecha", minWidth: 100, align: "center" },
  { id: "files", label: "Archivos", minWidth: 50, align: "center" },
  { id: "finalize", label: "Finalizar", minWidth: 50, align: "center" },
  { id: "trash", label: "Desechar", minWidth: 50, align: "center" },
  { id: "milestones", label: "Hitos", minWidth: 50, align: "center" },
];

const TasksInProcess = ({ employee }) => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user = JSON.parse(localStorage.getItem("QUERCU_USER_INFO"));
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState([]);
  const [milestonesModal, setMilestonesModal] = useState(false);
  const [employeeSelected, setEmployeeSelected] = useState("");

  const getRows = async () => {
    const res = await getAllTasks();
    if (res.status) {
      setRows(res.data);
    }

    if (!res.status)
      enqueueSnackbar("Error al obtener las tareas", { variant: "error" });
  };

  useEffect(() => {
    if (employee) {
      const user = JSON.parse(localStorage.getItem("QUERCU_USER_INFO"));

      getByEmployee(user._id)
        .then((res) => {
          setRows(res.data);
        })
        .catch((err) => {
          enqueueSnackbar("Error al obtener las tareas", { variant: "error" });
        });
    }

    if (!employee) {
      getRows();
      getAllEmployees()
        .then((res) => {
          setEmployees(res.users);
        })
        .catch((err) => {
          enqueueSnackbar("Error al obtener los empleados", {
            variant: "error",
          });
        });
    }
  }, []);

  useEffect(() => {
    if (employeeSelected) {
      getByEmployee(employeeSelected)
        .then((res) => {
          
          setRows(res.data);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar("Error al obtener las tareas", { variant: "error" });
        });
    } // * Si hay empleado seleccionado, se obtienen las tareas de ese empleado

    if (!employeeSelected && !employee) getRows(); // * Si no hay empleado seleccionado y no es un empleado, se obtienen todas las tareas
  }, [employeeSelected]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleFinish = async (id) => {
    const res = await finishTask(id);

    if (res.status) {
      enqueueSnackbar("Tarea finalizada", { variant: "success" });
      if (employee) {
        getByEmployee(user._id).then((res) => {
          setRows(res.data);
        });
      }

      if (!employee) getRows();
    }

    if (!res.status) {
      enqueueSnackbar("Error al finalizar la tarea", { variant: "error" });
      
    }
  };

  const handleDisable = async (id) => {
    const res = await disableTask(id);

    if (res.status) {
      enqueueSnackbar("Tarea desechada", { variant: "success" });

      if (employee) {
        getByEmployee(user._id).then((res) => {
          setRows(res.data);
        });
      }

      if (!employee) getRows();
    }

    if (!res.status) {
      enqueueSnackbar("Error al desechar la tarea", { variant: "error" });
      
    }
  };

  const page_title = `Tareas`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Módulo de Tareas",
    },
    {
      id: 2,
      title: "Tareas",
      link_to: routes.tasks,
    },
  ];

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>
      {!employee && (
        <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
          <Typography>Tareas de:</Typography>

          <FormControl xs={6} sx={{ m: 1, minWidth: "50%" }}>
            <InputLabel id="demo-simple-select-label">
              Elija el usuario asignado:
            </InputLabel>
            <Select
              value={employeeSelected}
              label="Elija el usuario asignado:"
              onChange={(e) => setEmployeeSelected(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>

              {employees &&
                employees[0] &&
                employees.map((employee) => {
                  return (
                    <MenuItem key={employee._id} value={employee._id}>
                      {employee.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
      )}

      {milestonesModal && (
        <MilestonesModal
          handleClose={() => setMilestonesModal(false)}
          task={milestonesModal}
        />
      )}

      <Grid item xs={12}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns &&
                    columns[0] &&
                    columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows &&
                  rows[0] &&
                  rows.map((row, index) => {
                    return (
                      row.tasks &&
                      row.tasks[0] &&
                      row.tasks.map((task) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            <TableCell align="center">
                              {task.activity}
                            </TableCell>
                            <TableCell align="center">{task.project && task.project.name && task.project.name}</TableCell>
                            <TableCell align="center">{task.project && task.project.client && task.project.client.name && task.project.client.name}</TableCell>
                            <TableCell align="center">{row.date}</TableCell>
                            <TableCell align="center">
                              {row.files ? (
                                <>
                                  <FileCopy
                                    sx={{
                                      cursor: "pointer",
                                    }}
                                  />
                                  <FileUpload
                                    sx={{
                                      cursor: "pointer",
                                    }}
                                  />
                                </>
                              ) : (
                                <FileUpload
                                  sx={{
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                cursor: "pointer",
                              }}
                              onClick={() => handleFinish(task._id)}
                            >
                              <Done color="success" />
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                cursor: "pointer",
                              }}
                              onClick={() => handleDisable(task._id)}
                            >
                              <Delete color="error" />
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                cursor: "pointer",
                              }}
                              onClick={() => setMilestonesModal(task)}
                            >
                              <FormatListBulleted />{" "}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};
export default TasksInProcess;
