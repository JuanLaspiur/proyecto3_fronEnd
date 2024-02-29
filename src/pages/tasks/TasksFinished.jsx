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
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllTasksfinished } from "./../../api/tasks";
import routes from "../../router/routes";
import { PageHeader } from "../../components/common/PageHeader";
import MilestonesModal from "../../components/tasks/MilestonesModal";
import { FormatListBulleted } from "@mui/icons-material";

const columns = [
  { id: "activity", label: "Tarea", minWidth: 100 },
  { id: "project", label: "Proyecto", minWidth: 100, align: "center" },
  { id: "client", label: "Cliente", minWidth: 100, align: "center" },
  { id: "description", label: "Descripción", minWidth: 170 },
  { id: "date", label: "Fecha", minWidth: 100 },
];

const TasksFinished = () => {
  const [rows, setRows] = useState([]);
  const [rowsCopy, setRowsCopy] = useState([]);
  const [page, setPage] = useState(0);
  const [milestonesModal, setMilestonesModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filterByName = (e) => {
    const value = e.target.value;
    if (value === "") {
      setRows(rowsCopy);
    } else {
      setRows(
        rowsCopy.filter((task) =>
          task.employees && task.employees.some((employee) =>
            employee.name.toLowerCase().includes(value.toLowerCase())
          )
        )
      );
    }
  };
  

  const getRows = async () => {
    const res = await getAllTasksfinished();
    if (res.status) {
      setRows(res.data);
      setRowsCopy(res.data);
    }
  };
  
  useEffect(() => {
    getRows();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const page_title = `Tareas finalizadas`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Módulo de Tareas",
    },
    {
      id: 2,
      title: "Tareas finalizadas",
      link_to: routes.tasks_finished,
    },
  ];

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>
      <Grid item xs={12} sx={{mb: 2}}>
      <TextField
          onChange={filterByName}
          id="filter"
          label="Filtrar por nombre"
          type="text"
          margin="normal"
          variant="outlined"
          required
          sx={{ bgcolor: "white", minWidth: 300}}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                      >
                        <TableCell align="center">
                          {row.activity}
                        </TableCell>
                        <TableCell align="center">{row.project && row.project.name && row.project.name}</TableCell>
                        <TableCell align="center">{row.project && row.project.client && row.project.client.name && row.project.client.name}</TableCell>
                        <TableCell align="center">{row.description && row.description}</TableCell>
                        <TableCell align="center">{row.date}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            cursor: "pointer",
                          }}
                          onClick={() => setMilestonesModal(row)}
                        >
                          <FormatListBulleted />
                        </TableCell>
                      </TableRow>
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
      {milestonesModal && (
        <MilestonesModal
          handleClose={() => setMilestonesModal(false)}
          task={milestonesModal}
        />
      )}
    </Grid>
  );
};
export default TasksFinished;
