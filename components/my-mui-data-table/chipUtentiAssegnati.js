import { Avatar, Chip, Stack } from "@mui/material";
import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

export default function ChipUtentiAssegnati({ utentiList }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Stack
      direction={"row"}
      spacing={2}
      justifyContent="center"
      alignItems="flex-start"
    >
      <Chip
        size="small"
        label={"+ altri " + utentiList.length}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Stack
          direction={"column"}
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={0.5}
          p={1}
        >
          {utentiList.map((utente) => {
            return (
              <Stack
                direction={"row"}
                spacing={0.5}
                justifyContent="center"
                alignItems="flex-start"
              >
                <Chip
                  size="small"
                  avatar={
                    <Avatar>
                      {utente.username.length >= 2
                        ? utente.username.charAt(0) + utente.username.charAt(1)
                        : utente.username}
                    </Avatar>
                  }
                  label={utente.nome + " " + utente.cognome}
                />
              </Stack>
            );
          })}
        </Stack>
      </Popover>
    </Stack>
  );
}
