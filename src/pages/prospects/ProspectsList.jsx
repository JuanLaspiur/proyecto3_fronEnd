import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProspectsByPages } from "../../api/axios";
import { PageHeader } from "../../components/common/PageHeader";
import ProspectsTable from "../../components/prospects/ProspectsTable";
import routes from "../../router/routes";

const ProspectsList = () => {
  const [prospects, setProspects] = useState([]);
  const [page, setPage] = useState(1);
  const [prospectsPages, setProspectsPages] = useState(1);
  const [keyword, setKeyword] = useState(null);

  const getData = async () => {
    let data = await getProspectsByPages(page, keyword);
    setProspects(data.prospects);
    setProspectsPages(data.totalPages)
  };

  useEffect(() => {
    getData();
  }, [page, keyword]);

  const page_title = `Listado de prospectos`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Ventas",
    },
    {
      id: 2,
      title: "Listado de prospectos",
      link_to: routes.prospects_list,
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
          to={routes.new_prospect}
          sx={{ mb: 2 }}
        >
          Nuevo prospecto
        </Button>
      </Grid>

      <Grid item xs={12}>
        <ProspectsTable prospects={prospects} prospectsPages={prospectsPages} page={page} setPage={setPage} keyword={keyword} setKeyword={setKeyword} />
      </Grid>

    </Grid>
  );
};

export default ProspectsList;
