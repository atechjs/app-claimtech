import { ThemeProvider, createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import MyToastContainer from "../components/toast/MyToastContainer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/it";
import { LocalizationProvider } from "@mui/x-date-pickers";

const theme = createTheme({
  components: {
    MuiChip: {
      variants: [
        {
          props: { variant: "square" },
          style: {
            borderRadius: 8,
            justifyContent: "center",
            flexWrap: "wrap",
          },
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        autoComplete: "off",
      },
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"it"}>
        <MyToastContainer />
        {getLayout(<Component {...pageProps} />)}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
