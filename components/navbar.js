import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import MyAppBar from "./appbar";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const drawerWidth = 300;
//IN CASO DI DUBBI SU COME FARE I LAYOUT GUARDARE QUESTO LINK
//https://blog.logrocket.com/guide-next-js-layouts-nested-layouts/

export default function Navbar({ menuItems, utente }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleToggleDrawer = () => {
    setOpen((open) => !open);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const activeRoute = (routeName, currentRoute) => {
    return routeName === currentRoute ? true : false;
  };

  return (
    <>
      <MyAppBar
        utente={utente}
        onToggle={handleToggleDrawer}
        menuItems={menuItems}
      />
      <Drawer
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        onClose={handleCloseDrawer}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) =>
              item.label !== "divider" ? (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    LinkComponent={Link}
                    href={item.link}
                    selected={activeRoute(item.link, router.pathname)}
                    onClick={() => handleCloseDrawer()}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ) : (
                <Divider orientation="horizontal" key={item.key}></Divider>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
