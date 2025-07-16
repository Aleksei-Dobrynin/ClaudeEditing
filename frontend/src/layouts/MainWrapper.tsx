import { Outlet } from "react-router-dom";
import React, { FC, useState } from "react";

import styled from "styled-components";
import { observer } from "mobx-react";
import { Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
import MainStore from "MainStore";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AlertDialog from "components/AlertDialog";
import ConfirmDialog from "components/ConfirmDialog";
import DigitalSignDialog from "components/DigitalSignDialog";

type MainWrapperProps = {
  children: React.ReactNode;
};

const MainWrapper: FC<MainWrapperProps> = observer(() => {

  return (
    <AppMainWapper
      id="main-scroll-content"
    >
      <Outlet />

      <Snackbar
        id="Alert_Snackbar"
        anchorOrigin={MainStore.positionSnackbar}
        open={MainStore.openSnackbar}
        onClose={() => MainStore.changeSnackbar(false)}
        autoHideDuration={3000}
        message={MainStore.snackbarMessage}
        key={"bottomleft"}
      >
        <StyledAlert
          icon={MainStore.snackbarSeverity === "error" ? <CancelIconWrapp /> : <CheckIconWrapp />}
          onClose={() => MainStore.changeSnackbar(false)}
          $severity={MainStore.snackbarSeverity}
        >
          {MainStore.snackbarMessage}
        </StyledAlert>
      </Snackbar>

      <Backdrop id={"Preloader_1"} sx={{ color: "#fff", zIndex: 1000000 }} open={MainStore.loader}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <AlertDialog />

      <ConfirmDialog />
      <DigitalSignDialog />

    </AppMainWapper>
  );
});

export default MainWrapper;

const AppMainWapper = styled.div`
`;


const StyledAlert = styled(Alert) <{ $severity?: "success" | "info" | "warning" | "error" }>`
  background-color: var(--colorNeutralForeground1, #3e4450) !important;
  color: var(--colorNeutralBackground1, #fff) !important;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;
const CancelIconWrapp = styled(CancelIcon)`
  color: var(--colorPaletteRedForeground2, #bd0202) !important;
`;
const CheckIconWrapp = styled(CheckCircleIcon)`
  color: var(--colorPaletteGreenBackground2, #3e4450) !important;
`;