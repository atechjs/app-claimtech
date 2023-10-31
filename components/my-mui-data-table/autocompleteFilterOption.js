import { Autocomplete, TextField } from "@mui/material";

export default function autocompleteFilterOption(key, label, dataset) {
  return {
    logic: (val, filters) => {
      if (!filters[0] || filters[0].value === null) return false; //Se non ho settato il filtro tengo la riga
      //Se ritorno false allora la riga la tengo
      return val !== filters[0].value;
    },
    display: (filterList, onChange, index, column) => {
      return (
        <Autocomplete
          key={key}
          options={dataset}
          sx={{ width: "50vh", maxWidth: "100%" }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, value) => {
            filterList[index] = [value];
            onChange(filterList[index], index, column);
          }}
          size="small"
          fullWidth
          renderInput={(params) => (
            <TextField label={label} fullWidth size="small" {...params} />
          )}
        />
      );
    },
  };
}
