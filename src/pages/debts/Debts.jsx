import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getDebtsByPages } from "../../api/debts";
import { PageHeader } from "../../components/common/PageHeader";
import DebtModal from "../../components/debts/DebtModal";
import DebtsTable from "../../components/debts/DebtsTable";
import routes from "../../router/routes";

const Debts = () => {
  const [debts, setDebts] = useState([]);
  const [page, setPage] = useState(1);
  const [debtsPages, setDebtsPages] = useState(1);
  const [keyword, setKeyword] = useState(null);
  const [modalDebt, setModalDebt] = useState(false);

  const getData = async () => {
    let data = await getDebtsByPages(page, keyword);
    setDebts(data.debts);
    setDebtsPages(data.totalPages);
  };

  useEffect(() => {
    getData();
  }, [page, keyword]);

  const page_title = `Deudas`;
  const breadcrumbs = [
    {
      id: 1,
      title: "Módulo Contabilidad",
    },
    {
      id: 2,
      title: "Deudas",
      link_to: routes.debts,
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
          sx={{ mb: 2 }}
          onClick={() => setModalDebt(!modalDebt)}
        >
          Nueva deuda
        </Button>
      </Grid>

      <Grid item xs={12}>
        <DebtsTable
          debts={debts}
          debtsPages={debtsPages}
          page={page}
          setPage={setPage}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </Grid>
      {modalDebt && <DebtModal setModalDebt={setModalDebt} />}
    </Grid>
  );
};

export default Debts;
