import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import store from "../Login/store";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ForgotPassword = observer(() => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const defaultTheme = createTheme();
  useEffect(() => {
    store.setNavigateFunction(navigate); // Pass navigate function to the store
  }, [navigate]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/logo256.png`} alt="Logo" width="50%" />
          < Typography component="h1" variant="h3">
            Бишкекглавархитектура
          </Typography>
          <br />
          < Typography component="h1" variant="h5">
            {translate("label:forgotPassword:recoveryPassword")}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="loginForRecovery"
              label={translate("label:forgotPassword:email")}
              name="loginForRecovery"
              autoComplete="email"
              autoFocus
              onChange={(event) => store.handleChange(event)}
              value={store.loginForRecovery}
              error={store.errorloginForRecovery !== ""}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                store.onRecoveryPassword();
              }}
            >
              {translate("label:forgotPassword:recovery")}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
    ;
})

export default ForgotPassword;