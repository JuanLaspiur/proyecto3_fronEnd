import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const AccordionMenu = ({ data, setAsideActive }) => {
  return (
    <div>
      {data &&
        data.map((item) => (
          <Accordion key={item.id} disableGutters>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "text.main" }} />}
              sx={{ bgcolor: "primary.main" }}
            >
              <Typography color={"text.main"}>{item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: "primary.secondary" }}>
              {item.options &&
                item.options.map((option) => (
                  <Button
                    component={Link}
                    to={option.link}
                    key={option.id}
                    variant="contained"
                    sx={{
                      py: 2,
                      borderColor: "black",
                      bgcolor: "primary.secondary",
                      borderBottom: "1px solid #222222",
                      textAlign: "center",
                    }}
                    fullWidth
                  >
                    {option.name}
                  </Button>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
};
export default AccordionMenu;
