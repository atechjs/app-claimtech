import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material";
import NestedAppbar from "./nestedAppbar";
export default function NestedLayout({ title, children }) {
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
    <>
      <NestedAppbar title={title} />
      {children}
    </>
  );
}
