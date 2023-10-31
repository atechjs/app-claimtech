import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Stack, createTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material";

export default function NestedAppbar({ title, children }) {
  const router = useRouter();

  const getMuiTheme = () =>
    createTheme({
      palette: {
        primary: {
          main: "#FFFFFF",
        },
      },
    });

  return (
    <ThemeProvider theme={getMuiTheme}>
      <AppBar position="static" sx={{ maxWidth: "100%" }}>
        <Toolbar>
          <Stack
            direction={"row"}
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => router.back()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              {title.toUpperCase()}
            </Typography>
            {children}
          </Stack>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
