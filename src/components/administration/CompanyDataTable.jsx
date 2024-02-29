import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import {
  deleteArea,
  deleteDepartament,
  deletePosition,
  getAllAreas,
  getAllDepartaments,
  getAllPositions,
} from "../../api/axios";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const CompanyDataTable = ({ data }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [headCells, setHeadCells] = useState([]);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let array = [];
    switch (data.name) {
      case "Áreas":
        const dataA = await getAllAreas();
        dataA.areas.map((item) => {
          array.push({
            name: item.name,
            actions: (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(item._id)}
              >
                Eliminar
              </Button>
            ),
          });
        });
        setHeadCells([
          {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: data.name,
          },
          {
            id: "actions",
            numeric: false,
            disablePadding: false,
            label: "Acciones",
          },
        ]);
        setRows(array);
        break;
      case "Departamentos":
        const dataB = await getAllDepartaments();
        dataB.departaments.map((item) => {
          array.push({
            name: item.name,
            area: item.area.name,
            actions: (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(item._id)}
              >
                Eliminar
              </Button>
            ),
          });
        });
        setHeadCells([
          {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: data.name,
          },
          {
            id: "area",
            numeric: false,
            disablePadding: true,
            label: "Area",
          },
          {
            id: "actions",
            numeric: false,
            disablePadding: false,
            label: "Acciones",
          },
        ]);
        setRows(array);
        break;
      case "Cargos":
        const dataC = await getAllPositions();
        dataC.positions.map((item) => {
          array.push({
            name: item.name,
            area: item.area.name,
            departament: item.departament.name,
            actions: (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(item._id)}
              >
                Eliminar
              </Button>
            ),
          });
        });
        setHeadCells([
          {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: data.name,
          },
          {
            id: "area",
            numeric: false,
            disablePadding: true,
            label: "Area",
          },
          {
            id: "departament",
            numeric: false,
            disablePadding: true,
            label: "Departamento",
          },
          {
            id: "actions",
            numeric: false,
            disablePadding: false,
            label: "Acciones",
          },
        ]);
        setRows(array);
        break;
    }
  };
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding="normal"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const createData = (name, actions) => {
    return {
      name,
      actions,
    };
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    let response = null;
    switch (data.name) {
      case "Áreas":
        response = await deleteArea(id);
        break;
      case "Departamentos":
        response = await deleteDepartament(id);
        break;
      case "Cargos":
        response = await deletePosition(id);
        break;
    }
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } else {
      enqueueSnackbar(response.msg, { variant: "error" });
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            {rows && rows[0] && (
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow hover key={row.name}>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.name}
                        </TableCell>
                        {row.area ? (
                          <TableCell align="left">{row.area}</TableCell>
                        ) : null}
                        {row.departament ? (
                          <TableCell align="left">{row.departament}</TableCell>
                        ) : null}
                        <TableCell align="left">{row.actions}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
export default CompanyDataTable;
