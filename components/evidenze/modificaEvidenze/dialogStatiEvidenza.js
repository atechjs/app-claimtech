import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import useEvidenzaAllStatiById from "../../fetching/useEvidenzaAllStatiById";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import dayjs from "dayjs";

export default function DialogStatiEvidenza({ opened, handleClose, evidenza }) {
  const {
    data: statoList,
    trigger,
    mutate,
  } = useEvidenzaAllStatiById(undefined);
  useEffect(() => {
    if (!evidenza) return;
    trigger({ id: evidenza.id });
  }, [evidenza]);

  if (!statoList) return;
  console.log("statoList", statoList);
  return (
    <Dialog open={opened} onClose={handleClose}>
      <Stack direction={"column"} p={2}>
        <DialogTitle>Storico evidenza</DialogTitle>
        <Box>
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.1,
              },
            }}
          >
            {statoList.map((stato) => {
              return (
                <TimelineItem>
                  <TimelineOppositeContent color="textSecondary">
                    {dayjs(stato.timestamp).format("DD/MM/YYYY")}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card>
                      <CardContent>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          Inserito da {stato.usernameUtente}
                        </Typography>
                        Stato:
                        <Typography variant="h5" component="div">
                          {stato.codiceTipologiaStatoEvidenza}
                        </Typography>
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </Box>
      </Stack>
    </Dialog>
  );
}
