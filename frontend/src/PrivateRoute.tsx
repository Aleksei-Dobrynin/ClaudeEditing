import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainStore from "./MainStore";
import { Backdrop, CircularProgress } from "@mui/material";
import { observer } from "mobx-react";
import ConfirmDialog from "components/ConfirmDialog";

const PrivateRoute = observer(() => {
  const location = useLocation();
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    if (!(location.pathname.includes("/user") || location.pathname === "/")) {
    }
  }, [location.pathname, accessToken]);

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <ConfirmDialog />
      <Backdrop  id={"Preloader_1"} sx={{ color: "#fff", zIndex: 1000000 }} open={MainStore.loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Outlet />
    </>
  );
});

export default PrivateRoute;
