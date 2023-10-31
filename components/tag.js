import { Chip } from "@mui/material";

export default function Tag(props) {
  if (props.variante === undefined || props.variante === "filled")
    return (
      <Chip
        variant="square"
        size="small"
        {...props}
        sx={{ bgcolor: props.colore, color: "white" }}
      />
    );
  else
    return (
      <Chip
        variant="square"
        size="small"
        {...props}
        sx={{
          bgcolor: "transparent",
          color: props.colore,
          border: 1,
          borderColor: props.colore,
        }}
      />
    );
}
