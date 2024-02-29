import { Grid } from "@mui/material";
import React from "react";
import CompanyConfigurationAccordion from "../../components/administration/CompanyConfigurationAccordion";
import { PageHeader } from "../../components/common/PageHeader";
import routes from "../../router/routes";

const CompanyConfiguration = () => {

  const page_title = `Configuración de empresa`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Administración",
    },
    {
      id: 2,
      title: "Configuración de empresa",
      link_to: routes.company_configuration,
    },
  ];

  return (
    <Grid container>

      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={12}>
        <CompanyConfigurationAccordion />
      </Grid>

    </Grid>
  );
};

export default CompanyConfiguration;
