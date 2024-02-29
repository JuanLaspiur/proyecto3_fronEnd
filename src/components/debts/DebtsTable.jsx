import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Tooltip,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Box,
  Typography,
  Toolbar,
  Divider,
  TableSortLabel,
  Grid,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Pagination from "../common/Pagination";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Delete, RemoveCircle } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { createMovement } from "../../api/axios";
import { formatDate } from "../../helpers/formatDate";
import { deleteDebt } from "../../api/debts";

const DebtsTable = ({
  debts,
  debtsPages,
  page,
  setPage,
  keyword,
  setKeyword,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [values, setValues] = useState({ keyword: "" });

  useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  }, [debts]);

  const handleChangePage = (newPage) => {
    setPage(newPage); // newPage es el número de página que se seleccionó
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value }); // event.target.value es el valor del input y prop es el nombre del input
  };

  const handleSubmit = () => {
    setKeyword(values.keyword.trim());
    setPage(1); // Se establece la página en 1 para que se muestre la primera página de resultados
  };

  const handleClearFilters = () => {
    setValues({ keyword: "" });
    setKeyword("");
    setPage(1);
  };

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc"); // Si el orden es ascendente, se establece descendente y viceversa
    setSortBy(property);
  };

  const handleDelete = async (data) => {
    const response = await deleteDebt(data);
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } else {
      enqueueSnackbar(response.msg, { variant: "error" });
    }
  };

  const handleCost = async (item) => {
    if (item.amount > 0) {
      let form = {
        type: "cost",
        description: item.description,
        amount: item.amount
      };
      const res = await createMovement(form);

      if (res.success) {
        const response = await deleteDebt(item._id);
        if (response.success) {
          enqueueSnackbar(res.msg, { variant: "success" });
          setTimeout(() => {
            navigate(0);
          }, 1000);
        }
      } else {
        enqueueSnackbar(res.msg, { variant: "error" });
      }
    } else {
      enqueueSnackbar("Se debe ingresar un monto mayor a 0", {
        variant: "error",
      });
    }
  };

  return (
    <>
      {isLoading ? null : (
        <TableContainer component={Paper} sx={{ mb: 5, pb: 3 }}>
          <Toolbar sx={{ bgcolor: "primary.main", color: "white" }}>
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Lista de deudas
            </Typography>
            <Tooltip
              title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <Typography variant="body2" color={"white"} sx={{ mr: 1 }}>
                  Filtros
                </Typography>
                <FilterListIcon
                  sx={
                    showFilters
                      ? { color: "secondary.main" }
                      : { color: "white" }
                  }
                />
              </IconButton>
            </Tooltip>
          </Toolbar>
          {showFilters && (
            <Grid
              container
              spacing={2}
              sx={{
                bgcolor: "primary.main",
                p: 3,
              }}
            >
              <Grid item xs={12} lg={12}>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                  <OutlinedInput
                    size="small"
                    value={values.keyword}
                    onChange={handleChange("keyword")} // trim() remueve espacios en blanco al inicio y al final de la cadena
                    onKeyDown={(evt) => {
                      if (evt.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Filtrar por Nombre"
                    sx={{ bgcolor: "white", fontSize: "11pt" }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  sx={{ width: "100%" }}
                >
                  Filtrar
                </Button>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClearFilters}
                  sx={{ width: "100%" }}
                >
                  Limpiar Filtros
                </Button>
              </Grid>
            </Grid>
          )}
          <Divider />
          <Table sx={{ minWidth: 500, mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell key="description">
                  <TableSortLabel
                    active={sortBy === "description"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("description")}
                  >
                    Descripción
                    {sortBy === "description" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell key="amount">
                  <TableSortLabel
                    active={sortBy === "amount"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("amount")}
                  >
                    Monto
                    {sortBy === "amount" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell key="date">
                  <TableSortLabel
                    active={sortBy === "date"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("date")}
                  >
                    Fecha de pago estimada
                    {sortBy === "date" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "createdAt"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("createdAt")}
                  >
                    Fecha de Creación
                    {sortBy === "createdAt" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ minHeight: 500 }}>
              {debts && debts[0]
                ? debts.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.description ? row.description : "N/A"}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.amount ? row.amount : "N/A"}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.date ? row.date : "N/A"}
                      </TableCell>
                      <TableCell>{formatDate(row.created_at)}</TableCell>
                      <TableCell>
                        <Grid
                          container
                          spacing={1}
                          sx={{ textAlign: "center", alignItems: "center" }}
                        >
                          <Grid item xs={12} md={6}>
                            <Tooltip title="Agregar costo" placement="top">
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleCost(row)}
                                sx={{ minWidth: "40px", px: 0 }}
                              >
                                <RemoveCircle
                                  fontSize="medium"
                                  sx={{ textAlign: "center" }}
                                />
                              </Button>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Tooltip title="Eliminar" placement="top">
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDelete(row._id)}
                                sx={{ minWidth: "40px", px: 0 }}
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
                  ))
                : null}
            </TableBody>
          </Table>
          <Pagination
            pageNumber={page}
            totalCount={debtsPages * 15}
            updatePageNumber={handleChangePage}
            pageSize={15}
          />
        </TableContainer>
      )}
    </>
  );
};

export default DebtsTable;
