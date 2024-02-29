import React from "react";
import { Grid } from "@mui/material";
import { PageHeader } from "../../components/common/PageHeader";
import PlanificationForm from "../../components/planifications/PlanificationForm";
import routes from "../../router/routes";

const NewPlanification = () => {
  const page_title = `Nueva planificación`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Ventas",
    },
    {
      id: 2,
      title: "Listado de planificaciones",
      link_to: routes.planifications_list,
    },
    {
      id: 3,
      title: "Nueva planificación",
      link_to: routes.new_planification,
    },
  ];

  return (
    <Grid container spacing={2}>

      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={12}>
        <PlanificationForm />
      </Grid>

    </Grid>
  );
};

export default NewPlanification;
