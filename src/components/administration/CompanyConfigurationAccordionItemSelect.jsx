import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState } from "react";

const CompanyConfigurationAccordionItemSelect = ({
  input,
  selects,
  setSelects,
}) => {
  const [selected, setSelected] = useState("");
  const handleChangeSelected = (event) => {
    setSelected(event.target.value);
    const obj = { [event.target.name]: event.target.value };
    if (selects.some((e) => e[event.target.name] === event.target.value)) {
      setSelects(
        selects.filter((item) => item[event.target.name] === event.target.value)
      );
    } else {
      setSelects([...selects, obj]);
    }
  };
  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <InputLabel>Seleccionar {input.label}</InputLabel>
      <Select
        name={input.name}
        value={selected}
        label={`Seleccionar ${input.label}`}
        onChange={handleChangeSelected}
        renderValue={(selected) => {
          let select = "";
          let data = input.options.find((item) => item._id === selected);
          if (data) select = data.name;
          return select;
        }}
      >
        {input.options.map((item, index) => (
          <MenuItem value={item._id} key={index}>
            <Checkbox checked={selected.indexOf(item._id) > -1} />
            <ListItemText primary={item.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CompanyConfigurationAccordionItemSelect;
