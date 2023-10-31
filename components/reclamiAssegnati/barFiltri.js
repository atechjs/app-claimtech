import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
export default function BarFiltri({
  f,
  onAddClick,
  onUpdateClick,
  onDeleteClick,
}) {
  return (
    <Paper elevation={0} square>
      <Stack direction={"column"}>
        <Box
          sx={{
            display: "flex",
          }}
          pr={1}
          pl={1}
        >
          <Stack
            direction={"row"}
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
            mr={3}
          >
            <CategoryOutlinedIcon />
            <Typography variant="button" noWrap component="div">
              Categorie
            </Typography>
          </Stack>
          <Stack sx={{ width: "100%" }} direction={"row-reverse"} spacing={0}>
            <Tooltip title="Nuova categoria">
              <IconButton
                aria-label="add"
                color="info"
                size="small"
                onClick={() => onAddClick()}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Elimina categoria">
              <IconButton
                aria-label="delete"
                color="error"
                disabled={f === undefined || f === -1}
                size="small"
                onClick={() => onDeleteClick(f)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Aggiorna categoria">
              <IconButton
                aria-label="edit"
                color="warning"
                disabled={f === undefined || f === -1}
                size="small"
                onClick={() => onUpdateClick(f)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Divider />
      </Stack>
    </Paper>
  );
}
