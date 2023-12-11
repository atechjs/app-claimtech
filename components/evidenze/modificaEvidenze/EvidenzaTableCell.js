import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Button,
  ButtonGroup,
} from "@mui/material";
import Select from "react-select";
import Tag from "../../tag";
import InfoIcon from "@mui/icons-material/Info";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs from "dayjs";
import RemoveIcon from "@mui/icons-material/Remove";
export default function EvidenzaTableCell({ getValue, row, column, table }) {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row, column, value, columnMeta);
  };

  const onSelectChange = (selected) => {
    const newValue = !selected || selected == null ? null : selected.value;
    setValue(newValue);
    tableMeta?.updateData(row, column, selected, columnMeta);
  };

  const onMultiSelectChange = (selectedList) => {
    if (selectedList === undefined) return;
    let newValue = selectedList.map((v) => v.value);
    setValue(newValue);
    tableMeta?.updateData(row, column, newValue, columnMeta);
  };

  if (columnMeta?.type === "LABEL") {
    return <span>{value}</span>;
  }

  if (columnMeta?.type === "CAUSA_RECLAMO") {
    const id = row.original.id;
    return (
      <Stack direction={"column"} width={"100%"}>
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent="flex-start"
          alignItems="center"
        >
          {id != null ? (
            <Tooltip title="Apri storico">
              <IconButton
                color="info"
                aria-label="apri storico"
                size="small"
                onClick={() => tableMeta.onStoricoButtonClick(row.original)}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          <span>{value}</span>
        </Stack>
        {!id || id === null ? <Tag colore="green" label="NUOVO!" /> : null}
      </Stack>
    );
  }
  if (columnMeta?.type === "TEXT") {
    return (
      <TextField
        fullWidth
        sx={{ minWidth: "200px" }}
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        multiline
        rows={2}
      />
    );
  }

  if (columnMeta?.type === "DATE") {
    return (
      <DateField
        value={dayjs(value)}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        onBlur={onBlur}
        slotProps={{
          textField: { size: "small" },
        }}
        style={{ minWidth: "110px" }}
      />
    );
  }

  if (columnMeta?.type === "SELECT" && columnMeta?.options !== undefined) {
    return (
      <Box minWidth={"220px"}>
        <Select
          options={columnMeta?.options}
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

  if (columnMeta?.type === "ALLEGATOLIST") {
    return (
      <Stack direction={"column"} spacing={1}>
        {value.map((allegato, indexAllegato) => (
          <Stack width={"100%"}>
            <ButtonGroup
              variant="outlined"
              color="info"
              aria-label="gestisci allegato"
              size="small"
            >
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  tableMeta?.onRimuoviAllegatoClick(
                    row,
                    column,
                    columnMeta,
                    allegato,
                    indexAllegato
                  )
                }
              >
                <RemoveIcon />
              </Button>
              <Tooltip title={"Apri"}>
                <Button
                  fullWidth
                  onClick={() =>
                    tableMeta?.onApriAllegatoClick(
                      row,
                      column,
                      columnMeta,
                      allegato,
                      indexAllegato
                    )
                  }
                >
                  {allegato.descrizione}
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Stack>
        ))}
        <Button
          variant="contained"
          color="info"
          onClick={() =>
            tableMeta?.onAggiungiAllegatoClick(row, column, columnMeta)
          }
          size="small"
        >
          +
        </Button>
      </Stack>
    );
  }
}
