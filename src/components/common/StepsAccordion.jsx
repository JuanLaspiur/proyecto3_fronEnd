import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Add, Delete } from "@mui/icons-material";

const StepsAccordion = ({ steps, stepName, title, adminView, deleteFunction, addStep }) => {
  const [text, setText] = useState("");
  useEffect(() => {
    switch (title) {
      case "Pasos":
        setText("Paso");
        break;
      case "Pre entregas":
        setText("Pre entrega");
        break;
      case "Entregas finales":
        setText("Entrega final");
        break;
    }
  }, [title]);
  return (
    <Box sx={{ my: 1 }}>
      {((steps && steps[0]) || adminView) && (
        <Typography variant="h5" sx={{ textAlign: "center", position: 'relative' }}>
          {title}
          {adminView && (
            <Add sx={{ ml: 1, cursor: "pointer", position: 'absolute', right: 10 }} color="primary" onClick={() => addStep(stepName)} />
          )}
        </Typography>
      )}
      {steps && steps[0]
        ? steps.map((item, index) => (
            <Accordion disableGutters key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: "primary.main" }}
              >
                <Typography color="text.main">
                  {text} {index + 1}: {item.name}
                </Typography>

                {adminView && (
                  <Delete sx={{ ml: 1, cursor: "pointer", position: 'absolute', right: 50 }} color='error' onClick={() => deleteFunction(item, stepName)} />
                )}
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Typography>Descripción: {item.description}</Typography>
                <Typography>
                  {title === "Pasos"
                    ? `Tiempo estimado: ${item.time}`
                    : `Tipo de archivo entregable: ${item.fileType} `}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        : null}
    </Box>
  );
};

export default StepsAccordion;
