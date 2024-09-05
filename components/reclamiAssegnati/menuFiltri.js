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
import LayoutMenuFiltri from "../menuFiltri/layoutMenuFiltri";
import { Refresh } from "iconsax-react";
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
    <LayoutMenuFiltri
      barFiltri={
        <BarFiltri
          f={filtroSelezionato}
          onAddClick={onFilterAdd}
          onUpdateClick={onFilterUpdate}
          onDeleteClick={onFilterDelete}
        />
      }
      filterList={ordinaListaFiltri(filterList)}
      filtroSelezionato={filtroSelezionato}
      onFilterSelected={onFilterSelected}
      isLoading={isLoading}
    >
       <div className="p-3 h-full" >
      <Stack direction={"column"} spacing={1}>
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
              <Refresh className="w-4" variant="Outlined" />
            </Button>
          </Tooltip>
        </Stack>
        <Divider sx={{ marginBottom: 0 }} />
      </Stack>
      </div>
    </LayoutMenuFiltri>
  );
}
