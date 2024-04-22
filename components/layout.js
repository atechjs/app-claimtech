import { Box, Toolbar } from "@mui/material";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ProtectedRoute from "./protectedroute";
import authServ from "../services/auth.service";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TagIcon from "@mui/icons-material/Tag";
import WarningIcon from "@mui/icons-material/Warning";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import FactoryIcon from "@mui/icons-material/Factory";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import EuroIcon from "@mui/icons-material/Euro";
import SchemaIcon from "@mui/icons-material/Schema";
import BiotechIcon from "@mui/icons-material/Biotech";
import CircleIcon from "@mui/icons-material/Circle";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import NetworkPingIcon from "@mui/icons-material/NetworkPing";
import { usePathname } from "next/navigation";
export default function Layout({ children }) {
  //Il data fetching deve essere fatto qua usare SWR
  //data fetching dell'utente con relativi permessi e creazione web sockets per notifiche
  const [menuItems, setMenuItems] = useState([
    {
      label: "Reclami",
      link: "/reclamiAssegnati",
      icon: <AssignmentIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE", "ROLE_STANDARD"],
      appbar: true,
    },
    {
      label: "Proposte",
      link: "/proposte",
      icon: <FactCheckIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE", "ROLE_STANDARD"],
      appbar: true,
    },
    {
      label: "Tags",
      link: "/tags",
      icon: <TagIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE"],
    },
    {
      label: "Cause",
      link: "/cause",
      icon: <WarningIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE"],
    },
    {
      label: "Difetti",
      link: "/difetti",
      icon: <CircleIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE"],
    },
    {
      label: "Tipologie analisi",
      link: "/tipologieAnalisi",
      icon: <BiotechIcon />,
      ruoli: ["ROLE_AMMINISTRATORE"],
    },
    {
      label: "Stabilimenti",
      link: "/stabilimenti",
      icon: <FactoryIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE"],
    },
    {
      label: "divider",
      key: "divider1",
      ruoli: [],
    },
    {
      label: "Stat. N.C.",
      link: "/statNoteAccredito",
      icon: <EuroIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE"],
    },
    {
      label: "KPI",
      link: "/kpiT",
      icon: <NetworkPingIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE", "ROLE_STANDARD"],
      appbar: true,
    },
    {
      label: "divider",
      key: "divider2",
      ruoli: [],
    },
    {
      label: "Clienti",
      link: "/clienti",
      icon: <PersonIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE"],
    },
    {
      label: "Form",
      link: "/forms",
      icon: <DynamicFormIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE"],
    },
    {
      label: "divider",
      key: "divider3",
      ruoli: [],
    },
    {
      label: "Workflows gestione reclami",
      link: "/workflowsGestioneReclamo",
      icon: <SchemaIcon />,
      ruoli: ["ROLE_AMMINISTRATORE"],
    },
    {
      label: "Liste approvazione",
      link: "/listeApprovazione",
      icon: <ChecklistIcon />,
      ruoli: ["ROLE_AMMINISTRATORE"],
    },
    {
      label: "divider",
      key: "divider4",
      ruoli: [],
    },
    {
      label: "Utenti",
      link: "/utenti",
      icon: <SupervisedUserCircleIcon />,
      ruoli: ["ROLE_AMMINISTRATORE"],
    },
    {
      label: "Gruppi",
      link: "/gruppiUtente",
      icon: <PeopleIcon />,
      ruoli: ["ROLE_AMMINISTRATORE", "ROLE_GESTORE"],
    },
    {
      label: "Liste distribuzione",
      link: "/listeDistribuzione",
      icon: <AllInboxIcon />,
      ruoli: ["ROLE_AMMINISTRATORE"],
    },
  ]);

  const [utente, setUtente] = useState(undefined);
  useEffect(() => {
    setUtente(authServ.getCurrentUser());
  }, []);

  const getMenuItemsAutorizzati = (menuItems, utente) => {
    return menuItems.filter(
      (x) =>
        x.ruoli.find((element) => element === utente.ruolo) !== undefined ||
        x.label === "divider"
    );
  };
  const pathname = usePathname();
  return (
    <ProtectedRoute pathname={pathname}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {menuItems !== undefined && utente !== undefined && utente !== null ? (
          <>
            <Navbar
              utente={utente}
              menuItems={getMenuItemsAutorizzati(menuItems, utente)}
            />
            <Box component="main" sx={{ flexGrow: 1, height: "100%" }}>
              <Toolbar />
              {children}
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>
    </ProtectedRoute>
  );
}
