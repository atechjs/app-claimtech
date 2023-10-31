import React, { useState } from "react";
import ReclamoNestedLayout from "../../../../components/reclamo/reclamoNestedLayout";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Paper, Stack, Typography } from "@mui/material";
import Select from "react-select";
import useReclamoGetFornitureSelect from "../../../../components/fetching/useReclamoGetFornitureSelect";
import useReclamoStorico from "../../../../components/fetching/useReclamoStorico";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

export default function Page() {
  const router = useRouter();

  const [options, setOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState({
    value: "null",
    label: "RECLAMO",
  });
  const { data, trigger } = useReclamoStorico(router.query.slug, null);
  const onSuccess = (data) => {
    setOptions([{ value: "null", label: "RECLAMO" }].concat(data));
    trigger({ idReclamo: router.query.slug, id: "null" });
  };

  useReclamoGetFornitureSelect(router.query.slug, onSuccess);

  const onSelectChange = (value) => {
    setSelectedItem(value);
    trigger({
      idReclamo: router.query.slug,
      id: value.value,
    });
  };

  const style = {
    menu: (base) => ({
      ...base,
      width: "max-content",
      minWidth: "100%",
    }),
  };

  const displayStorico = (storico) => {
    return (
      <>
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            {dayjs(storico.timestamp).format("DD/MM/YYYY [alle] HH:mm:ss")}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {selectedItem.value === "null"
                    ? "Fase reclamo"
                    : "Stato fornitura"}
                </Typography>
                <Typography variant="h5" component="div">
                  {storico.stato}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  creato da {storico.username}
                </Typography>
                {storico.codiceReso !== null ? (
                  <Typography variant="body2">
                    Codice reso: <b>{storico.codiceReso}</b>
                  </Typography>
                ) : null}
                {storico.codiceNotaAccredito !== null ? (
                  <Typography variant="body2">
                    Codice nota accredito: <b>{storico.codiceNotaAccredito}</b>
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
          </TimelineContent>
        </TimelineItem>
      </>
    );
  };

  return (
    <Stack direction={"column"} spacing={1} p={1}>
      <Paper sx={{ p: 1 }}>
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent="flex-start"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Typography variant="button">Oggetto</Typography>
          {options ? (
            <Select
              name="oggetto"
              options={options}
              value={selectedItem}
              onChange={(value) => onSelectChange(value)}
              styles={style}
            />
          ) : null}
        </Stack>
      </Paper>
      <Paper>
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.1,
            },
          }}
        >
          {data && data.map((storico) => displayStorico(storico))}
        </Timeline>
      </Paper>
    </Stack>
  );
}

Page.getLayout = function getLayout(page) {
  return <ReclamoNestedLayout>{page}</ReclamoNestedLayout>;
};
