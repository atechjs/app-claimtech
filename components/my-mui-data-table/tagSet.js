import React from "react";
import Tag from "../tag";
import Popover from "@mui/material/Popover";
import { Box, Stack } from "@mui/material";
export default function TagSet({ tagList }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Tag
        label={"+ " + tagList.length}
        colore={"gray"}
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
        <Box p={1}>
          <Stack
            direction={"row"}
            spacing={0.5}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            {tagList.map((tag) => (
              <Tag label={tag.descrizione} colore={tag.colore} />
            ))}
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
