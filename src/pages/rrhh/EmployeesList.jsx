import React, { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import routes from "../../router/routes";
import EmployeesTable from "../../components/employees/EmployeesTable";
import { getEmployeesByPages } from "../../api/employees";

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]); // TODO: Get employees from API or from local storage's user info
  const [page, setPage] = useState(1);
  const [employeesPages, setEmployeesPages] = useState(1);
  const [keyword, setKeyword] = useState(null);

  const getData = async () => {
    let res = await getEmployeesByPages(page, keyword);
    setEmployees(res.data);
    setEmployeesPages(res.totalPages);
  };

  useEffect(() => {
    getData();
  }, [page, keyword]);

  const page_title = `Listado de empleados`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Empleados",
    },
    {
      id: 2,
      title: "Listado",
      link_to: routes.employeesList,
    },
  ];

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          component={Link}
          to={routes.newEmployee}
          sx={{ mb: 2 }}
        >
          Nuevo empleado
        </Button>
      </Grid>

      <Grid item xs={12}>
        <EmployeesTable
          employees={employees}
          employeesPages={employeesPages}
          page={page}
          setPage={setPage}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </Grid>
    </Grid>
  );
}
