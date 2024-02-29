import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  getAllPlanifications,
  getAllPositions,
  getAllProspects,
  createNewProposal,
  getProposalById,
} from "../../api/axios";
import { PageHeader } from "../../components/common/PageHeader";
import routes from "../../router/routes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm } from "react-hook-form";
import StepsAccordion from "../../components/common/StepsAccordion";
import { useNavigate, useParams } from "react-router-dom";

const Proposal = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();
  const [prospects, setProspects] = useState([]);
  const [positions, setPositions] = useState([]);
  const [planifications, setPlanifications] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedProspect, setSelectedProspect] = useState("");
  const [selectedPlanification, setSelectedPlanification] = useState("");
  const [showedPlanifications, setShowedPlanifications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const handleChangeSelected = (event) => {
    switch (event.target.name) {
      case "prospect":
        setSelectedProspect(event.target.value);
        break;
      case "planification":
        let data = planifications.find(
          (plan) => plan._id === event.target.value
        );
        if (data) {
          setShowedPlanifications([data]);
        } else {
          setShowedPlanifications([]);
        }
        setSelectedPlanification(event.target.value);
        break;
      case "currency":
        setSelectedCurrency(event.target.value);
        break;
      default:
        break;
    }
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const handleForm = async (values) => {
    const selectedPositions = Object.keys(values).map(function (key) {
      return { [key]: values[key] };
    });
    let array = [];
    selectedPositions.map((pos) => {
      let find = positions.find((item) => {
        if (item.name === Object.keys(pos)[0]) {
          item.amount = pos[Object.keys(pos)[0]];
          return true;
        }
      });
      array.push(find);
    });

    const data = {
      prospectOrClient: selectedProspect,
      positionsWithAmount: array,
      type: 0,
      moneyBadge: selectedCurrency,
      plannings: [selectedPlanification],
      expirationDays: 30,
      status: 0,
    };
    console.log(selectedCurrency);
    if (!selectedCurrency || !selectedProspect || !selectedPlanification) {
      enqueueSnackbar("Faltan completar campos", { variant: "error" });
    } else {
      const response = await createNewProposal(data);
      if (response.success) {
        enqueueSnackbar(response.msg, { variant: "success" });
        setTimeout(() => {
          navigate(routes.proposals);
        }, 1000);
      } else {
        enqueueSnackbar(response.msg, { variant: "error" });
      }
    }
  };

  const getData = async () => {
    const pros = await getAllProspects();
    const plans = await getAllPlanifications();
    const pos = await getAllPositions();
    setProspects(pros.prospects);
    setPlanifications(plans.plannings);
    setPositions(pos.positions);
    const res = await getProposalById(id);
    if (res.success) {
      console.log(res.proposal);
      setSelectedCurrency(res.proposal.moneyBadge);
      setSelectedProspect(res.proposal.prospectOrClient._id);
      setSelectedPlanification(res.proposal.plannings[0]);
    }
  };

  const currency = [
    { name: "CLP", value: "clp" },
    { name: "USD", value: "usd" },
    { name: "Euro", value: "eur" },
    { name: "USDT", value: "usdt" },
    { name: "BTC", value: "btc" },
    { name: "ETH", value: "eth" },
    { name: "BNB", value: "bnb" },
  ];

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
    {
      id: 3,
      title: "Nueva propuesta",
      link_to: routes.proposal,
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PageHeader page_title={page_title} breadcrumbs={breadcrumbs} />
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Seleccionar Prospecto</InputLabel>
          <Select
            value={selectedProspect}
            label="Seleccionar Prospecto"
            onChange={handleChangeSelected}
            name="prospect"
          >
            {prospects &&
              prospects[0] &&
              prospects.map((item, index) => (
                <MenuItem value={item._id} key={index}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Seleccionar Divisa</InputLabel>
          <Select
            value={selectedCurrency}
            label="Seleccionar Divisa"
            onChange={handleChangeSelected}
            name="currency"
          >
            {currency.map((item, index) => (
              <MenuItem value={item.value} key={index}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Seleccionar Planificación</InputLabel>
          <Select
            name="planification"
            value={selectedPlanification}
            label="Seleccionar Planificación"
            onChange={handleChangeSelected}
            renderValue={(selected) => {
              let select = "";
              let data = planifications.find((plan) => plan._id === selected);
              select = data.name;
              return select;
            }}
          >
            {planifications &&
              planifications[0] &&
              planifications.map((item, index) => (
                <MenuItem value={item._id} key={index}>
                  <Checkbox
                    checked={selectedPlanification.indexOf(item._id) > -1}
                  />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        {showedPlanifications &&
          showedPlanifications[0] &&
          showedPlanifications.map((item, index) => (
            <Accordion disableGutters key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{item.name && item.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={8} sx={{ pr: 5 }}>
                    <Typography>
                      {item.description && item.description}
                    </Typography>
                    <StepsAccordion steps={item.steps} title="Pasos" />
                    <StepsAccordion
                      steps={item.preDelivery}
                      title="Pre entregas"
                    />
                    <StepsAccordion
                      steps={item.finalDelivery}
                      title="Entregas finales"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    {item.positions &&
                      item.positions[0] &&
                      item.positions.map((position, index) =>
                        positions.map(
                          (allPositions) =>
                            position === allPositions._id && (
                              <div key={index} style={{ marginBottom: 15 }}>
                                <Typography sx={{ mb: 1 }}>
                                  {allPositions.name}:
                                </Typography>
                                <FormControl
                                  fullWidth
                                  variant="outlined"
                                  name={allPositions.name}
                                >
                                  <InputLabel>Coste por hora</InputLabel>
                                  <OutlinedInput
                                    type="number"
                                    {...register(allPositions.name)}
                                    label="Coste por hora"
                                    endAdornment={null}
                                  />
                                </FormControl>
                              </div>
                            )
                        )
                      )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
      </Grid>

      <Grid item xs={12} sx={{ textAlign: "center", mb: 5 }}>
        <Button variant="contained" onClick={handleSubmit(handleForm)}>
          Editar propuesta
        </Button>
      </Grid>
    </Grid>
  );
};

export default Proposal;
