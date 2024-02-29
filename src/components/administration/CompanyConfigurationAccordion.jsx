import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getAllAreas, getAllDepartaments } from "../../api/axios";
import CompanyConfigurationAccordionArea from "./CompanyConfigurationAccordionArea";
import CompanyConfigurationAccordionDepartament from "./CompanyConfigurationAccordionDepartament";
import CompanyConfigurationAccordionPosition from "./CompanyConfigurationAccordionPosition";
import CompanyDataTable from "./CompanyDataTable";

const CompanyConfigurationAccordion = () => {
  const [areas, setAreas] = useState([]);
  const [departaments, setDepartaments] = useState([]);
  const getData = async () => {
    const a = await getAllAreas();
    const d = await getAllDepartaments();
    setAreas(a.areas);
    setDepartaments(d.departaments);
  };
  useEffect(() => {
    getData();
  }, []);

  const data = [
    {
      id: 1,
      name: "Registro de área",
      inputs: [
        { name: "name", label: "Nombre", id: 11 },
        { name: "description", label: "Descripción", id: 12 },
      ],
    },
    {
      id: 2,
      name: "Registro de departamento",
      inputs: [
        { name: "area", label: "Área", id: 21, options: areas },
        { name: "name", label: "Nombre", id: 22 },
        { name: "description", label: "Descripción", id: 23 },
      ],
    },
    {
      id: 3,
      name: "Registro de posición",
      inputs: [
        { name: "area", label: "Área", id: 31, options: areas },
        {
          name: "department",
          label: "Departamento",
          id: 32,
          options: departaments,
        },
        { name: "name", label: "Nombre", id: 33 },
        { name: "description", label: "Descripción", id: 34 },
      ],
    },
  ];
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <CompanyConfigurationAccordionArea />
        <CompanyConfigurationAccordionDepartament areas={areas} />
        <CompanyConfigurationAccordionPosition areas={areas} />
      </Grid>
      <Grid item xs={6}>
        <CompanyDataTable data={{ name: "Áreas" }} />
        <CompanyDataTable data={{ name: "Departamentos" }} />
        <CompanyDataTable data={{ name: "Cargos" }} />
      </Grid>
    </Grid>
  );
};
export default CompanyConfigurationAccordion;
