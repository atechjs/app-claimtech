import { Button, Divider, Stack, TextField } from "@mui/material";
import LayoutMenuFiltri from "../menuFiltri/layoutMenuFiltri";
import BarFiltri from "./barFiltri";
import SyncIcon from "@mui/icons-material/Sync";
import { useForm } from "react-hook-form";
import useStabilimentiSelect from "../fetching/useStabilimentiSelect";
import MyReactSelect from "../my-react-select-impl/myReactSelect";
import dayjs from "dayjs";

export default function MenuFiltri({
  filtroSelezionato,
  filterList,
  isLoading,
  onFilterSelected,
  onSync,
  filterValues,
}) {
  const { stabilimentiList } = useStabilimentiSelect();
  const periodoOptions = [
    { label: dayjs().year(), value: 0 },
    { label: "Dal " + (dayjs().year() - 1), value: 1 },
    { label: "Dal " + (dayjs().year() - 2), value: 2 },
    { label: "Dal " + (dayjs().year() - 3), value: 3 },
    { label: "Dal " + (dayjs().year() - 4), value: 4 },
    { label: "Dal " + (dayjs().year() - 5), value: 5 },
    { label: "Dal " + (dayjs().year() - 10), value: 10 },
  ];
  const form = useForm({
    defaultValues: { ...filterValues },
  });

  const { register, handleSubmit, formState, reset, control } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    onSync(data);
  };

  return (
    <LayoutMenuFiltri
      barFiltri={<BarFiltri />}
      filterList={filterList}
      filtroSelezionato={filtroSelezionato}
      onFilterSelected={onFilterSelected}
      isLoading={isLoading}
    >
      <Stack
        pl={1}
        pr={1}
        spacing={0.5}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        {stabilimentiList ? (
          <MyReactSelect
            control={control}
            name="idStabilimento"
            validation={{
              required: "Lo stabilimento è obbligatorio",
            }}
            label="Stabilimento"
            options={stabilimentiList}
            menuPosition="fixed"
          />
        ) : (
          <></>
        )}
        <MyReactSelect
          control={control}
          name="periodo"
          validation={{
            required: "Il periodo è obbligatorio",
          }}
          label="Partenza"
          options={periodoOptions}
          menuPosition="fixed"
        />
        <Button
          variant="outlined"
          type="submit"
          startIcon={<SyncIcon />}
          size="medium"
        >
          Ricarica
        </Button>
      </Stack>
      <Divider sx={{ marginBottom: 0 }} />
    </LayoutMenuFiltri>
  );
}
