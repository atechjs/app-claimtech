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
import { useRef, useState } from "react";
import { useEffect } from "react";

import LoadingBar from "react-top-loading-bar";
import { usePathname } from "next/navigation";

const drawerWidthOpen = 300;
const drawerWidthClosed = 60;

export default function Navbar({ menuItems, utente }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const ref = useRef(null);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      ref.current?.continuousStart();
    };

    const handleRouteChangeComplete = () => {
      ref.current?.complete();
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  const handleToggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const activeRoute = (routeName, currentRoute) => {
    return routeName === currentRoute ? true : false;
  };

  return (
    <>
      <LoadingBar color="#e47908" ref={ref} shadow={true} />
      <MyAppBar
        utente={utente}
        onToggle={handleToggleDrawer}
        menuItems={menuItems}
      />
      <Drawer
       PaperProps={{
        sx: {
          backgroundColor: "#bdc7cf",
          color: "#0d3450",
        }}}
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidthOpen : drawerWidthClosed,
            boxSizing: "border-box",
            transition: "width 0.1s", 
            overflowX: "hidden",
          },
        }}
        onClose={handleCloseDrawer}
      >
        <Toolbar />
        <List className="mt-2">
          {menuItems.map((item) =>
            item.label !== "divider" ? (
              <Link key={item.key} href={item.link}>
                <ListItem disablePadding sx = {{color: activeRoute(item.link, pathname) ? "#e47908" : "#0d3450"}}>
                <ListItemButton
                      sx={{
                        minHeight: 60, 
                        height: open ? "auto" : 60, 
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        
                      }}
                    >


                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: activeRoute(item.link, pathname) ? "#e47908" : "#0d3450",
                      }}
                    
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{ opacity: open ? 1 : 0 }}
                      
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            ) : (
              <Divider orientation="horizontal" key={item.key}></Divider>
            )
          )}
        </List>
      </Drawer>
    </>
  );
}
