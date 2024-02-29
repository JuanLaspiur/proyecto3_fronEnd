import { Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProposalsByPages } from "../../api/axios";
import { PageHeader } from "../../components/common/PageHeader";
import ProposalsTable from "../../components/proposals/ProposalsTable";
import routes from "../../router/routes";

const ProposalsList = () => {
  const [proposals, setProposals] = useState([]);
  const [page, setPage] = useState(1);
  const [proposalsPages, setProposalsPages] = useState(1);
  const [keyword, setKeyword] = useState(null);

  const getData = async () => {
    let data = await getProposalsByPages(page, keyword);
    setProposals(data.proposals);
    setProposalsPages(data.totalPages);
  };

  useEffect(() => {
    getData();
  }, [page, keyword]);

  const page_title = `Listado de propuestas`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Ventas",
    },
    {
      id: 2,
      title: "Listado de propuestas",
      link_to: routes.proposals,
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
          to={routes.new_proposal}
          sx={{ mb: 2 }}
        >
          Nueva propuesta
        </Button>
      </Grid>

      <Grid item xs={12}>
        <ProposalsTable
          proposals={proposals}
          proposalsPages={proposalsPages}
          page={page}
          setPage={setPage}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </Grid>
    </Grid>
  );
};

export default ProposalsList;
