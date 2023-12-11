import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Paper, Stack, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";

export default function HorizontalLinearStepper({
  step,
  stepList,
  onStepClick = () => {},
  buttonIndietro = false,
}) {
  const [activeStep, setActiveStep] = React.useState(step);

  React.useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const steps = !stepList
    ? [
        "Ricerca ODL",
        "Validazione cliente",
        "Validazione form",
        "Inserimento dati",
        "Selezione fornitura",
        "Inserimento dati fornitura",
        "Inserimento dati evidenze",
      ]
    : stepList;

  const getMuiTheme = () =>
    createTheme({
      palette: {
        primary: {
          main: "#1976d2",
        },
      },
    });

  return (
    <ThemeProvider theme={getMuiTheme}>
      <Stack direction={"row"}>
        {buttonIndietro && activeStep > 0 ? (
          <Button onClick={() => onStepClick(activeStep - 1)}>Indietro</Button>
        ) : null}
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps} onClick={() => onStepClick(index)}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Stack>
    </ThemeProvider>
  );
}
