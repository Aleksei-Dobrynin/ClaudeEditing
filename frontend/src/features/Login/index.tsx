import * as React from "react";
import { useTranslation } from "react-i18next";
import { Paper, Grid, Container } from "@mui/material";
import CustomButton from "components/Button";
import CustomTextField from "components/TextField";
import { observer } from "mobx-react";
import store from "./store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = observer(() => {
  const { t: translate } = useTranslation();
  const [login, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorLogin, setErrorLogin] = React.useState("");
  const [errorPassword, setErrorPassword] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    store.setNavigateFunction(navigate); // Pass navigate function to the store
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper
        sx={{
          p: 2,
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomTextField
              id="authorizationLogin"
              label={translate("label:authorization:login")}
              name="login"
              helperText={errorLogin}
              error={errorLogin !== ""}
              onChange={(event) => store.handleChange(event)}
              value={store.login}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <CustomTextField
              name="password"
              label={translate("label:authorization:password")}
              type="password"
              id="authorizationPassword"
              // helperText={"error password"}
              error={store.errorPassword !== ""}
              onChange={(event) => store.handleChange(event)}
              value={store.password}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              id="authorizationSignInButton"
              onClick={() => {
                store.onLogin();
              }}
            >
              {translate("label:authorization:signIn")}
            </CustomButton>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
});

export default Login;
