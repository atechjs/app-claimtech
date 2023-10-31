import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { LoadingButton } from "@mui/lab";
import Copyright from "../components/copyright";
import LoginIcon from "@mui/icons-material/Login";
import { useForm } from "react-hook-form";
import authServ from "../services/auth.service";
import { useRouter } from "next/router";
import axios from "axios";
import getApiUrl from "../utils/BeUrl";

export default function PageLogin() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { register, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const router = useRouter();
  const instance = axios.create();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = (data) => {
    setLoading(true);
    instance
      .post(getApiUrl() + "auth/login", data)
      .then((response) => {
        authServ.saveInfo(response.data);
        router.push("/reclamiAssegnati");
      })
      .catch(() => {
        setError("password", {
          type: "custom",
          message: "Username o password errati",
        });
        setLoading(false);
      });
  };
  return (
    <Container
      maxWidth={false}
      style={{
        background: "white",
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: "0",
        left: "0",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LoginIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            CLAIMOT - Accesso
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              {...register("username", { required: "Username è obbligatorio" })}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              error={!!errors.username}
              helperText={errors.username?.message}
              autoFocus
            />
            <TextField
              {...register("password", { required: "Password è obbligatorio" })}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              Accedi
            </LoadingButton>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </Container>
  );
}
