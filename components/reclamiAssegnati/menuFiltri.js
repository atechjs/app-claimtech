import {
  Box,
  Button,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BarFiltri from "./barFiltri";
import Tag from "../tag";
import PushPinTwoToneIcon from "@mui/icons-material/PushPinTwoTone";
import SyncIcon from "@mui/icons-material/Sync";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function MenuFiltri({
  filtroSelezionato,
  filterList,
  onSync,
  onFilterSelected,
  onFilterAdd,
  onFilterUpdate,
  onFilterDelete,
  isLoading,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("esercizio") !== null)
      reset({ esercizio: searchParams.get("esercizio") });
    else reset({ esercizio: dayjs().year() });
  }, [searchParams.get("esercizio")]);

  const schema = yup.object({
    esercizio: yup
      .number("Esercizio non valido")
      .min(1000, "Esercizio non valido")
      .max(9999, "Esercizio non valido")
      .required("Esercizio non valido")
      .typeError("Esercizio non valido"),
  });
  const form = useForm({
    defaultValues: {
      esercizio:
        searchParams.get("esercizio") !== null
          ? searchParams.get("esercizio")
          : dayjs().year(),
    },
    resolver: yupResolver(schema),
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const displayFiltro = (filtro) => {
    if (filtro === undefined) return;
    return (
      <ListItem key={filtro.id} disablePadding>
        <ListItemButton
          sx={{ pr: 1, pl: 1 }}
          onClick={() => onFilterSelected(filtro)}
          selected={
            filtroSelezionato !== undefined && filtro.id === filtroSelezionato
          }
        >
          <Stack
            direction="row"
            width={"100%"}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              {filtro.pinned ? <PushPinTwoToneIcon fontSize="small" /> : <></>}
              <ListItemText primary={filtro.label} />
            </Box>
            <Stack direction={"row-reverse"} spacing={0}>
              {filtro.count !== undefined && filtro.count !== null ? (
                <Tag label={filtro.count} colore="gray" />
              ) : (
                <Tag label={0} colore="gray" />
              )}
            </Stack>
          </Stack>
        </ListItemButton>
      </ListItem>
    );
  };

  const onSyncButtonPressed = (data) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("esercizio", data.esercizio);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
    onSync(data);
  };

  const ordinaListaFiltri = (list) => {
    if (list == undefined || list == null || list.length == 0) return [];
    let outputList = [];
    const pinnato = list.filter((x) => x.pinned);

    outputList = pinnato.sort((a, b) => a.id > b.id);
    outputList = [...outputList, list.find((x) => x.id === -1)];
    let sorted = list.sort((a, b) => a.id > b.id);
    sorted = sorted.filter((x) => x.pinned === false && x.id !== -1);
    outputList = outputList.concat(sorted);
    return outputList;
  };
  return (
    <Paper
      elevation={4}
      sx={{
        minHeight: "100%",
        backgroundColor: "white",
      }}
      square
    >
      <Stack direction={"column"} spacing={1}>
        <BarFiltri
          f={filtroSelezionato}
          onAddClick={onFilterAdd}
          onUpdateClick={onFilterUpdate}
          onDeleteClick={onFilterDelete}
        />

        <Stack
          pr={1}
          pl={1}
          direction={"row"}
          spacing={1}
          component="form"
          onSubmit={handleSubmit(onSyncButtonPressed)}
          noValidate
        >
          <TextField
            {...register("esercizio")}
            size="small"
            required
            fullWidth
            id="esercizio"
            label="Anno esercizio"
            type="number"
            name="esercizio"
            error={!!errors.esercizio}
            helperText={errors.esercizio?.message}
          />
          <Tooltip title="Ricarica reclami">
            <Button variant="outlined" size="small" type="submit">
              <SyncIcon />
            </Button>
          </Tooltip>
        </Stack>
        <Stack direction={"column"}>
          <Divider sx={{ marginBottom: 0 }} />
          {isLoading !== undefined && !isLoading ? (
            <List dense sx={{ pt: 0 }}>
              {ordinaListaFiltri(filterList).map((filtro) =>
                displayFiltro(filtro)
              )}
            </List>
          ) : (
            <Stack direction={"column"}>
              <LinearProgress thickness={10} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
