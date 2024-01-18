import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack, Typography } from "@mui/material";
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

export default function DialogInfoStato({ opened, handleClose, statoList }) {
  if (!statoList) return;
  return (
    <Dialog open={opened} onClose={handleClose}>
      <Stack direction={"column"} p={2}>
        <DialogTitle>Storico approvazioni proposta</DialogTitle>
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
                    {dayjs(stato.timestamp).format("DD/MM/YYYY [-] HH:mm:ss")}
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
                          {stato.codiceTipologiaStato}
                        </Typography>
                        {stato.note ? (
                          <>
                            Note:<Typography>{stato.note}</Typography>
                          </>
                        ) : null}
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
