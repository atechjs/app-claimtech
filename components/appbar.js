import {
  Badge,
  Box,
  Button,
  CssBaseline,
  Divider,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import AppBar from "@mui/material/AppBar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
const theme = createTheme({
  palette: {
    primary: {
      main: "#FFF",
    },
    secondary: {
      main: "#f59342",
    },
  },
});
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import authServ from "../services/auth.service";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";
export default function MyAppBar({ utente, menuItems, onToggle }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const vaiAlMioAccount = () => {
    router.push("/profilo");
    handleClose();
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ThemeProvider theme={theme}>
              <IconButton color="primary" onClick={() => onToggle()}>
                <MenuIcon />
              </IconButton>
            </ThemeProvider>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ bgcolor: "white" }}
            />
            <Typography variant="h6" noWrap component="div">
              CLAIMOT - Gestionale Reclami
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ bgcolor: "white" }}
            />
            {menuItems
              .filter((x) => x.appbar)
              .map((item) => (
                <Link href={item.link} underline="hover" color="white">
                  {item.label}
                </Link>
              ))}
          </Box>
          <Stack sx={{ width: "100%" }} direction={"row-reverse"}>
            <ThemeProvider theme={theme}>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<KeyboardArrowDownIcon />}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                {utente.nome + " " + utente.cognome}
              </Button>
            </ThemeProvider>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
                sx: {
                  width: anchorEl && anchorEl.offsetWidth,
                  minWidth: "150px",
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={() => vaiAlMioAccount()}>
                Il mio account
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  authServ.logout();
                  router.push("/login");
                }}
              >
                Esci
              </MenuItem>
            </Menu>
            {/* <ThemeProvider theme={theme}>
              <Button>
                <Badge color="secondary" badgeContent={10}>
                  <NotificationsIcon color="primary" />
                </Badge>
              </Button>
            </ThemeProvider> */}
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
