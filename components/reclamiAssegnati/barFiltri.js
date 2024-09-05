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
import LayoutBarFiltri from "../menuFiltri/layoutBarFiltri";
import { AddCircle, BoxAdd, Category, Edit, Edit2, FilterAdd, Trash } from "iconsax-react";
export default function BarFiltri({
  f,
  onAddClick,
  onUpdateClick,
  onDeleteClick,
}) {
  return (
    
    <LayoutBarFiltri icon={<Category className="text-primary w-4" />} title={"Categorie"} >
      <Stack sx={{ width: "100%" }} direction={"row-reverse"} spacing={0}>
        <Tooltip title="Nuova categoria">
          <IconButton
            aria-label="add"
            color="info"
            size="small"
            onClick={() => onAddClick()}
          >
            <AddCircle className="text-primary w-5" variant="Outline" />
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
             <Trash className="text-danger w-5" variant="Outline" />
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
            <Edit2 className="text-warning w-5" variant="Outline" />
          </IconButton>
        </Tooltip>
      </Stack>
    </LayoutBarFiltri>
  );
}
