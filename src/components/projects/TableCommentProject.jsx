import { Paper, TableContainer, Toolbar, Typography, Tooltip, IconButton, Divider, Table, TableHead, TableCell, TableSortLabel, Box, TableRow} from '@mui/material';
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from 'react';


export default function TableCommentProject() {
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("first_name");
  const [order, setOrder] = useState("asc");
  const [values, setValues] = useState({ keyword: "" });
  const [selected, setSelected] = useState([]);
  return (
      <TableContainer component={Paper} sx={{ mb: 5, pb: 3 }}>
        <Toolbar sx={{ bgcolor: "primary.main", color: "white" }}>
            <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
            >
                Comentarios
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
        <Divider />
        {/* aca van los nombres de las columnas */}
        <Table sx={{ minWidth: 500, mb: 2 }}>
            <TableHead>
              <TableRow>
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
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "email"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("email")}
                  >
                    Comentario
                    {sortBy === "email" ? (
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
                    active={sortBy === "type"}
                    direction={order === "asc" ? order : "desc"}
                    onClick={() => handleRequestSort("type")}
                  >
                    Archivo
                    {sortBy === "type" ? (
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
        </Table>
      </TableContainer>
  )
}