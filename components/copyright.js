import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      className="text-primary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.atechjs.com/">
       Atech.js
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
