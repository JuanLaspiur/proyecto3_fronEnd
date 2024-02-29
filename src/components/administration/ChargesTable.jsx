import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
} from "@mui/material";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { Button, Grid, Tooltip } from "@mui/material";
import LoadingModal from "../common/LoadingModal";
import { createMovement, deleteCharge, getProspectsById, notifyClient } from "../../api/axios";
import { useSnackbar } from "notistack";
import { formatNumber } from "../../helpers/formatNumbers";
import { formatDate } from "../../helpers/formatDate";
import { Add, Circle, Delete, Edit, ForwardToInbox } from "@mui/icons-material";

const EnhancedTableHead = (props) => {
  const headCells = [
    {
      id: "prospectOrClient",
      disablePadding: false,
      label: "Cliente",
    },
    {
      id: "project",
      disablePadding: false,
      label: "Proyectos",
    },
    {
      id: "cost",
      disablePadding: false,
      label: "Costo",
    },
  ];
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };


  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={"normal"}
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
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          padding={"normal"}
          sx={{ minWidth: 120, textAlign: "center" }}
        >
          Acciones
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const ChargesTable = ({
  charges,
  getChargeAmount,
  getBalanceData,
  setEditingCharge,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [visibleRows, setVisibleRows] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [paddingHeight, setPaddingHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getNameClient = async (id) => {
    if (rows) {
      try {
        const r = await getProspectsById(id);
        return r.prospect.name;
      } catch (error) {
        console.log(rows);
      }
    }
  }

  useEffect(() => {
    if (charges && charges[0]) {
      setRows(charges);
      let rowsOnMount = stableSort(charges, getComparator(5, "date"));

      rowsOnMount = rowsOnMount.slice(0 * 5, 0 * 5 + 5);

      setVisibleRows(rowsOnMount);

    }
    return () => {
      setRows([]);
    };
  }, [charges]);

  const handleIncome = async (row) => {
    setIsLoading(true);
    let form = {
      type: "income",
      amount: row.amount,
    };
    const res = await createMovement(form);
    if (res.success) {
      const response = await deleteCharge(row._id);
      if (response.success) {
        enqueueSnackbar(res.msg, { variant: "success" });
        getChargeAmount();
        getBalanceData();
      } else {
        enqueueSnackbar(response.msg, { variant: "error" });
      }
    } else {
      enqueueSnackbar(res.msg, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleDeleteCharge = async (row) => {
    setIsLoading(true);
    const res = await deleteCharge(row._id);
    if (res.success) {
      enqueueSnackbar(res.msg, { variant: "success" });
      getChargeAmount();
    } else {
      enqueueSnackbar(res.msg, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleNotify = async (row) => {
    setIsLoading(true);
    const res = await notifyClient(row._id);
    if (res.success) {
      enqueueSnackbar(res.msg, { variant: "success" });
      getChargeAmount();
    } else {
      enqueueSnackbar(res.msg, { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleRequestSort = (event, newOrderBy) => {
    const isAsc = orderBy === newOrderBy && order === "asc";
    const toggledOrder = isAsc ? "desc" : "asc";
    setOrder(toggledOrder);
    setOrderBy(newOrderBy);

    const sortedRows = stableSort(
      rows,
      getComparator(toggledOrder, newOrderBy)
    );
    const updatedRows = sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    setVisibleRows(updatedRows);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);

    const sortedRows = stableSort(rows, getComparator(order, orderBy));
    const updatedRows = sortedRows.slice(
      newPage * rowsPerPage,
      newPage * rowsPerPage + rowsPerPage
    );
    setVisibleRows(updatedRows);

    // Avoid a layout jump when reaching the last page with empty rows.
    const numEmptyRows =
      newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length) : 0;

    const newPaddingHeight = 53 * numEmptyRows;
    setPaddingHeight(newPaddingHeight);
  };

  const handleChangeRowsPerPage = (event) => {
    const updatedRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(updatedRowsPerPage);

    setPage(0);
    const sortedRows = stableSort(rows, getComparator(order, orderBy));
    const updatedRows = sortedRows.slice(
      0 * updatedRowsPerPage,
      0 * updatedRowsPerPage + updatedRowsPerPage
    );
    setVisibleRows(updatedRows);
    setPaddingHeight(0);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };


  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };



  return (
    <Box sx={{ width: "100%", border: "none" }}>
      <Paper sx={{ width: "100%", mb: 2, backgroundColor: "transparent" }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750, border: "none" }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      sx={{ cursor: "pointer" }}
                    >

                      <TableCell align="center">
                        {row.project.client.name}
                      </TableCell>

                      <TableCell align="center">
                        {row.project.name &&
                          row.project.name}
                      </TableCell>

                      <TableCell align="center">
                        ${row.amount}
                      </TableCell>


                      <TableCell align="center">
                        <Grid
                          container
                          sx={{ textAlign: "center", alignItems: "center" }}
                        >
                          <Grid item xs={12} md={4}>
                            <Tooltip title="Avisar" placement="top">
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{ minWidth: "40px", px: 0 }}
                                onClick={() => handleNotify(row)}
                              >
                                <ForwardToInbox
                                  fontSize="medium"
                                  sx={{ textAlign: "center" }}
                                />

                              </Button>

                            </Tooltip>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Tooltip title="Agregar" placement="top">
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleIncome(row)}
                                sx={{ minWidth: "40px", px: 0 }}
                              >
                                <Add
                                  fontSize="medium"
                                  sx={{ textAlign: "center" }}
                                />
                              </Button>
                            </Tooltip>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Tooltip title="Editar" placement="top">
                              <Button
                                variant="contained"
                                color="warning"
                                onClick={() => setEditingCharge(row)}
                                sx={{ minWidth: "40px", px: 0 }}
                              >
                                <Edit
                                  fontSize="medium"
                                  sx={{ textAlign: "center" }}
                                />
                              </Button>
                            </Tooltip>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Tooltip title="Eliminar" placement="top">
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDeleteCharge(row)}
                                sx={{ minWidth: "40px", px: 0, mt: 1 }}
                              >
                                <Delete
                                  fontSize="medium"
                                  sx={{ textAlign: "center" }}
                                />
                              </Button>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={parseInt(page)}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: "white" }}
        />
      </Paper>
      {isLoading && <LoadingModal />}
    </Box>
  );
};

export default ChargesTable;
