import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  getBalanceByYear,
  getCharges,
  getChargesByMonth,
  getMovements,
  getMovementsByMonth,
} from "../../api/axios";
import ChargeModal from "../../components/administration/ChargeModal";
import ChargesTable from "../../components/administration/ChargesTable";
import MovementsTable from "../../components/administration/MovementsTable";
import ColumnChart from "../../components/common/ColumnChart";
import LineChart from "../../components/common/LineChart";
import { formatNumber } from "../../helpers/formatNumbers";

const Home = () => {
  const [incomes, setIncomes] = useState(0);
  const [costs, setCosts] = useState(0);
  const [chargesAmount, setChargesAmount] = useState(0);
  const [movements, setMovements] = useState([]);
  const [charges, setCharges] = useState([]);
  const [selectedMovements, setSelectedMovements] = useState([]);
  const [month, setMonth] = useState(moment().format("M"));
  const [year, setYear] = useState(moment().format("YYYY"));
  const [newChargeModal, setNewChargeModal] = useState(false);
  const [chartOptions, setChartOptions] = useState({
    options: {
      xaxis: {
        categories: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
      },
    },
    series: [
      {
        name: "Ingreso",
        data: [],
      },
    ],
  });

  const getBalanceData = async () => {
    const response = await getMovementsByMonth(month, year);
    if (response.success) {
      setSelectedMovements(response.movements);
    }
  };

  const getChargeAmount = async () => {
    const response = await getChargesByMonth(month, year);
    if (response.success) {
      setCharges(response.charges);
      if (response.charges && response.charges[0]) {
        let total = 0;
        response.charges.map((item) => {
          total = total + item.amount;
        });
        setChargesAmount(total);
      }
    }
  };
  const getData = async () => {
    const res = await getMovements();
    if (res.success) {
      setMovements(res.movements);
    }

    const balance = await getBalanceByYear(year);
    if (balance.success) {
      const updatedOptions = JSON.parse(JSON.stringify(chartOptions));
      updatedOptions.series[0].data = balance.data;
      setChartOptions(updatedOptions);
    }
  };

  const getTotalIncomes = () => {
    let total = 0;
    if (selectedMovements && selectedMovements[0]) {
      selectedMovements.map((item) => {
        if (item.type === "income") total = total + item.amount;
      });
    }
    setIncomes(total);
  };

  const getTotalCosts = () => {
    let total = 0;
    if (selectedMovements && selectedMovements[0]) {
      selectedMovements.map((item) => {
        if (item.type === "cost") total = total + item.amount;
      });
    }
    setCosts(total);
  };

  useEffect(() => {
    getBalanceData();
    getChargeAmount();
    return () => {
      setSelectedMovements([]);
    };
  }, [month, year]);

  useEffect(() => {
    getTotalIncomes();
    getTotalCosts();
    return () => {
      setIncomes(0);
      setCosts(0);
    };
  }, [selectedMovements]);

  useEffect(() => {
    getData();
    return () => {
      setMovements([]);
    };
  }, []);

  const monthsOptions = [
    { title: "Enero", value: 1 },
    { title: "Febrero", value: 2 },
    { title: "Marzo", value: 3 },
    { title: "Abril", value: 4 },
    { title: "Mayo", value: 5 },
    { title: "Junio", value: 6 },
    { title: "Julio", value: 7 },
    { title: "Agosto", value: 8 },
    { title: "Septiembre", value: 9 },
    { title: "Octubre", value: 10 },
    { title: "Noviembre", value: 11 },
    { title: "Diciembre", value: 12 },
  ];

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid
                container
                sx={{ textAlign: "center", justifyContent: "center" }}
                spacing={2}
              >
                <Grid item xs={6}>
                  <Typography variant="h6">Seleccione el mes</Typography>
                  <Select
                    fullWidth
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {monthsOptions.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Seleccione el año</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    inputProps={{ style: { textAlign: "center" } }}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3} sx={{ my: 2 }}>
                  <Typography variant="h5">Ingresos</Typography>
                  <Typography variant="h4">${formatNumber(incomes)}</Typography>
                </Grid>

                <Grid item xs={12} md={6} lg={3} sx={{ my: 2 }}>
                  <Typography variant="h5">Egresos</Typography>
                  <Typography variant="h4">${formatNumber(costs)}</Typography>
                </Grid>

                <Grid item xs={12} md={6} lg={3} sx={{ my: 2 }}>
                  <Typography variant="h5">Balance</Typography>
                  <Typography variant="h4">
                    {incomes - costs < 0 && "-"}$
                    {incomes - costs > 0
                      ? formatNumber(incomes - costs)
                      : formatNumber((incomes - costs) * -1)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6} lg={3} sx={{ my: 2 }}>
                  <Typography variant="h5">Cobros programados</Typography>
                  <Typography variant="h4">
                    ${formatNumber(chargesAmount)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ my: 2, display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="h5" sx={{ display: "inline-block" }}>
            Cobros programados
          </Typography>
          <Button
            variant="contained"
            onClick={() => setNewChargeModal(!newChargeModal)}
          >
            Programar cobro
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ChargesTable
            charges={charges}
            getChargeAmount={getChargeAmount}
            getBalanceData={getBalanceData}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" sx={{ my: 2 }}>
            Últimos movimientos
          </Typography>
          <MovementsTable movements={movements} />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <LineChart chartOptions={chartOptions} />
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid item xs={6}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ColumnChart />
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
      {newChargeModal && <ChargeModal setModalCharge={setNewChargeModal} getChargeAmount={getChargeAmount}/>}
    </>
  );
};

export default Home;
