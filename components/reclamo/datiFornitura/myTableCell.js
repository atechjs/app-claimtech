import { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Box, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import Select from "react-select";
import Tag from "../../tag";
import InfoIcon from "@mui/icons-material/Info";
import useNextStatiFornituraCausaReclamo from "../../fetching/useNextStatiFornituraCausaReclamo";
export default function MyTableCell({ getValue, row, column, table }) {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);

  const bloccata = row.original.azzeraPartita === true;

  const { data: nextStatiOptions, trigger } =
    useNextStatiFornituraCausaReclamo(undefined);

  useEffect(() => {
    setValue(initialValue);
    if (columnMeta?.type === "STATO_FORNITURA_CAUSA_RECLAMO") {
      trigger({
        idStato: row.original.partitaCausaReclamo_idStato,
        idFornituraCausaReclamo: row.original.partitaCausaReclamo_id,
      });
    }
  }, [initialValue]);

  //Questo chiama metodo del parent
  //TODO farlo fare anche a invio
  const onBlur = () => {
    tableMeta?.updateData(row, column, value, columnMeta);
  };

  const handleCheck = (event) => {
    const val = event.target.checked;
    setValue(val);
    tableMeta?.updateData(row, column, val, columnMeta);
  };

  const onSelectChange = (selected) => {
    const newValue = !selected || selected == null ? null : selected.value;
    setValue(newValue);
    trigger({
      idStato: newValue,
      idFornituraCausaReclamo: row.original.partitaCausaReclamo_id,
    });
    tableMeta?.updateData(row, column, selected, columnMeta);
  };

  const onMultiSelectChange = (selectedList) => {
    if (selectedList === undefined) return;
    let newValue = selectedList.map((v) => v.value);
    setValue(newValue);
    tableMeta?.updateData(row, column, newValue, columnMeta);
  };

  if (columnMeta?.type === "CODICEPARTITA") {
    const idFornituraCausaReclamo = row.original.partitaCausaReclamo_id;
    return (
      <Stack direction={"column"}>
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Tooltip title="Apri info">
            <IconButton
              color="info"
              aria-label="add to shopping cart"
              size="small"
              onClick={() => tableMeta.onInfoButtonClick(row.original)}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <span>{value}</span>
        </Stack>
        {!idFornituraCausaReclamo || idFornituraCausaReclamo === null ? (
          <Tag colore="green" label="NUOVO!" />
        ) : null}
      </Stack>
    );
  }

  if (columnMeta?.type === "TEXT") {
    return (
      <TextField
        fullWidth
        label="VALORE"
        sx={{ minWidth: "110px" }}
        size="large"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type={"number"}
        disabled={bloccata}
      />
    );
  }

  if (columnMeta?.type === "CHECK") {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={handleCheck}
              disabled={bloccata}
            />
          }
        />
      </FormGroup>
    );
  }

  if (columnMeta?.type === "TEXTSTRING") {
    return (
      <TextField
        fullWidth
        label="CODICE"
        sx={{ minWidth: "200px" }}
        size="large"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  }

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 500,
    }),
  };

  if (columnMeta?.type === "SELECT" && columnMeta?.options !== undefined) {
    return (
      <Box minWidth={"220px"}>
        <Select
          options={columnMeta?.options}
          onChange={(e) => onSelectChange(e)}
          autosize={true}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          isDisabled={bloccata}
          value={
            columnMeta?.options.find((option) => option.value === value) || null
          }
        />
      </Box>
    );
  }

  if (
    columnMeta?.type === "STATO_FORNITURA_CAUSA_RECLAMO" &&
    nextStatiOptions !== undefined
  ) {
    return (
      <Box minWidth={"220px"}>
        <Select
          options={[
            columnMeta?.options.find((option) => option.value === value),
            ...nextStatiOptions,
          ]}
          onChange={(e) => onSelectChange(e)}
          autosize={true}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          value={
            columnMeta?.options.find((option) => option.value === value) || null
          }
        />
      </Box>
    );
  }

  if (columnMeta?.type === "MULTISELECT" && columnMeta?.options !== undefined) {
    return (
      <Box minWidth={"200px"}>
        <Select
          isMulti
          options={columnMeta?.options}
          onChange={(e) => onMultiSelectChange(e)}
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          autosize={true}
          value={value
            .map((optionValue) =>
              columnMeta?.options.find((option) => option.value === optionValue)
            )
            .reduce((valueItems, valueItem) => {
              if (!valueItem) {
                return valueItems;
              }

              return [...valueItems, valueItem];
            }, [])}
        />
      </Box>
    );
  }
  return <span>{value}</span>;
}
