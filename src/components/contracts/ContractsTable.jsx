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
import AddIcon from "@mui/icons-material/AddCircle";
import { Delete, Plagiarism, RemoveCircle } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { deleteContract } from "../../api/axios";
import IncomeModal from "./IncomeModal";
import CostModal from "./CostModal";
import { formatDate } from "../../helpers/formatDate";

const ContractsTable = ({
  contracts,
  contractsPages,
  page,
  setPage,
  keyword,
  setKeyword,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIncome, setModalIncome] = useState(false);
  const [modalCost, setModalCost] = useState(false);
  const [sortBy, setSortBy] = useState("first_name");
  const [order, setOrder] = useState("asc");
  const [values, setValues] = useState({ keyword: "" });
  const [selected, setSelected] = useState([]);
  const [contractId, setContractId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    console.log(contracts);
    setIsLoading(false);
  }, [contracts]);

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
    const response = await deleteContract(data);
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } else {
      enqueueSnackbar(response.msg, { variant: "error" });
    }
  };

  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  // Si el nombre está en el array selected, retorna true, de lo contrario retorna false

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
              Lista de contratos
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
                <TableCell key="form">
                  <TableSortLabel
                    active={sortBy === "form"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("form")}
                  >
                    Número de formulario
                    {sortBy === "form" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell key="name">
                  <TableSortLabel
                    active={sortBy === "name"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Nombre
                    {sortBy === "name" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell key="prospect">
                  <TableSortLabel
                    active={sortBy === "prospect"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("prospect")}
                  >
                    Cliente
                    {sortBy === "prospect" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell key="planning">
                  <TableSortLabel
                    active={sortBy === "planning"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("planning")}
                  >
                    Plan
                    {sortBy === "planning" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell key="currency">
                  <TableSortLabel
                    active={sortBy === "currency"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("currency")}
                  >
                    Moneda
                    {sortBy === "currency" ? (
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
              {contracts && contracts[0]
                ? contracts.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.formNumber ? row.formNumber : "N/A"}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name ? row.name : "N/A"}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.prospectOrClient.name
                          ? row.prospectOrClient.name
                          : "N/A"}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.plannings[0].name ? row.plannings[0].name : "N/A"}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.moneyBadge ? row.moneyBadge.toUpperCase() : "N/A"}
                      </TableCell>
                      <TableCell>{formatDate(row.created_at)}</TableCell>
                      <TableCell>
                        <Grid
                          container
                          spacing={1}
                          sx={{ textAlign: "center", alignItems: "center" }}
                        >
                          <Grid item xs={12} md={3}>
                            <Link to={`/ventas/contratos/${row._id}`}>
                              <Tooltip title="Ver contrato" placement="top">
                                <Button
                                  variant="contained"
                                  sx={{ minWidth: "40px", px: 0 }}
                                >
                                  <Plagiarism
                                    fontSize="medium"
                                    sx={{ textAlign: "center" }}
                                  />
                                </Button>
                              </Tooltip>
                            </Link>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Tooltip title="Agregar ingreso" placement="top">
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  setContractId(row._id);
                                  setModalIncome(!modalIncome);
                                }}
                                sx={{ minWidth: "40px", px: 0 }}
                              >
                                <AddIcon
                                  fontSize="medium"
                                  sx={{ textAlign: "center" }}
                                />
                              </Button>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Tooltip title="Agregar costo" placement="top">
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  setContractId(row._id);
                                  setModalCost(!modalCost);
                                }}
                                sx={{ minWidth: "40px", px: 0 }}
                              >
                                <RemoveCircle
                                  fontSize="medium"
                                  sx={{ textAlign: "center" }}
                                />
                              </Button>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={12} md={3}>
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
            totalCount={contractsPages * 15}
            updatePageNumber={handleChangePage}
            pageSize={15}
          />
        </TableContainer>
      )}
      {modalIncome && contractId && (
        <IncomeModal
          setModalIncome={setModalIncome}
          contractId={contractId}
          setContractId={setContractId}
        />
      )}
      {modalCost && contractId && (
        <CostModal
          setModalCost={setModalCost}
          contractId={contractId}
          setContractId={setContractId}
        />
      )}
    </>
  );
};

export default ContractsTable;