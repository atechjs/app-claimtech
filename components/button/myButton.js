import { Button, createTheme, ThemeProvider } from "@mui/material";



export default function MyButton({ label, variant, onClick, className, color, type}) {


    const claimTheme = createTheme({
        palette: {
            primary: {
              main: '#0d3450',
              contrastText: '#fff',
            },
            secondary: {
              main: '#ffa852',
              contrastText: '#fff',              
            },
          },
          typography: {
            button: {
              textTransform: 'none'
            }
          }

      });


    return (
        
        <ThemeProvider theme={claimTheme}>
            <Button
                variant={variant}
                onClick={onClick}
                className={className}
                color={color}
                type={type}
            >
                {label}
            </Button>
        </ThemeProvider>
    );
}