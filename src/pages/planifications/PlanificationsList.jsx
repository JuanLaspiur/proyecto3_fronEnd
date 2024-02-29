import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlanificationsByPages } from "../../api/axios";
import { PageHeader } from "../../components/common/PageHeader";
import PlanificatiosTable from "../../components/planifications/PlanificationsTable";
import routes from "../../router/routes";

const PlanificationsList = () => {
  const [planifications, setPlanifications] = useState([]);
  const [page, setPage] = useState(1);
  const [planificationsPages, setPlanificationsPages] = useState(1);
  const [keyword, setKeyword] = useState(null);
  console.log(planifications)

  const getData = async () => {
    let data = await getPlanificationsByPages(page, keyword);
    setPlanifications(data.plannings);
    setPlanificationsPages(data.totalPages);
  };

  useEffect(() => {
    getData();
  }, [page, keyword]);

  const page_title = `Listado de planificaciones`;
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
          to={routes.new_planification}
          sx={{ mb: 2 }}
        >
          Nueva planificación
        </Button>
      </Grid>

      <Grid item xs={12}>
        <PlanificatiosTable
          planifications={planifications}
          planificationsPages={planificationsPages}
          page={page}
          setPage={setPage}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </Grid>
    </Grid>
  );
};

export default PlanificationsList;
