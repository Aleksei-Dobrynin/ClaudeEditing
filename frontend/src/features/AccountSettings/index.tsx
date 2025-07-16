import * as React from "react";
import { Container } from "@mui/material";
import { observer } from "mobx-react";
import ChangePassword from "./changePassword";

const Login = observer(() => {
  return (
    <Container>
      <ChangePassword />
    </Container>
  );
});

export default Login;
