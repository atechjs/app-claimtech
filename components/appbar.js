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
import { HambergerMenu, Slack } from "iconsax-react";
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
        className="text-white bg-primary"
      >
        <Toolbar className="pl-5">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
           
               <HambergerMenu className="cursor-pointer" onClick={() => onToggle()}/>
            
            
          
            <div className=" md:p-4 flex cursor-pointer group items-center gap-2">
            <div className="h-10 outline w-10 flex items-center bg-gradient-to-br justify-center rounded-full bg-primary text-orange-100">
              <Slack size={24} className="relative group-hover:scale-75 duration-200" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-tertiary">ClaimTech</h1>
              <p className="text-xs text-gray-500 ml-2 font-medium">by Atech.js</p>
            </div>
          </div>
           
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
