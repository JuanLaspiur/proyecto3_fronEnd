import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getContractsByPages } from "../../api/axios";
import { PageHeader } from "../../components/common/PageHeader";
import ContractsTable from "../../components/contracts/ContractsTable";
import routes from "../../router/routes";

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [page, setPage] = useState(1);
  const [contractsPages, setContractsPages] = useState(1);
  const [keyword, setKeyword] = useState(null);

  const getData = async () => {
    let data = await getContractsByPages(page, keyword);
    setContracts(data.contracts);
    setContractsPages(data.totalPages)
  };

  useEffect(() => {
    getData();
  }, [page, keyword]);

  const page_title = `Listado de contratos`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Ventas",
    },
    {
      id: 2,
      title: "Listado de contratos",
      link_to: routes.contracts,
    },
  ];

  return (
    <Grid container>

      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={12}>
        <ContractsTable 
          contracts={contracts} 
          contractsPages={contractsPages} 
          page={page} 
          setPage={setPage} 
          keyword={keyword} 
          setKeyword={setKeyword}
          />
      </Grid>

    </Grid>
  );
};

export default Contracts;