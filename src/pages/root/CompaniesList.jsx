import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllCompanies } from "../../api/axios";
import CompaniesTable from "../../components/administration/CompaniesTable";
import { PageHeader } from "../../components/common/PageHeader";
import routes from "../../router/routes";

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let data = await getAllCompanies();
    setCompanies(data.companies);
  };

  const page_title = `Listado de empresas`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Root",
    },
    {
      id: 2,
      title: "Listado de empresas",
      link_to: routes.companies_list,
    },
  ];

  return (
    <Grid container>

      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={12}>
        <CompaniesTable companies={companies} companiesPages={1} />
      </Grid>

    </Grid>
  );
};

export default CompaniesList;
