import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatNumber } from "../../helpers/formatNumbers";
import { formatDate } from "../../helpers/formatDate";
import { Button, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { deleteMovement } from "../../api/axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const MovementsTable = ({ movements }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (movements && movements[0]) {
      setRows(movements);
    }
    return () => {
      setRows([]);
    };
  }, [movements]);

  const handleDelete = async (id) => {
    const response = await deleteMovement(id);
    if (response.success) {
      enqueueSnackbar(response.msg, { variant: "success" });
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } else {
      enqueueSnackbar(response.msg, { variant: "error" });
    }
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>N° Contrato</TableCell>
            <TableCell align="left">Nombre</TableCell>
            <TableCell align="left">Descripción</TableCell>
            <TableCell align="center">Tipo</TableCell>
            <TableCell align="center">Monto</TableCell>
            <TableCell align="left">Fecha de creación</TableCell>
            <TableCell align="left">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.contract && row.contract.formNumber}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.contract && row.contract.name && row.contract.name}
              </TableCell>
              <TableCell align="left">
                {row.description && row.description}
              </TableCell>
              <TableCell align="center">
                {row.type === "income" ? "Ingreso" : "Egreso"}
              </TableCell>
              <TableCell align="center">${formatNumber(row.amount)}</TableCell>
              <TableCell align="left">{formatDate(row.createdAt)}</TableCell>
              <TableCell align="left">
                <Tooltip title="Eliminar" placement="top">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(row._id)}
                    sx={{ minWidth: "40px", px: 0 }}
                  >
                    <Delete fontSize="medium" sx={{ textAlign: "center" }} />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MovementsTable;
