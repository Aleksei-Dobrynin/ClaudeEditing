import React, { FC, useEffect } from "react";
import { default as StreetTypeAddEditBaseView } from "./base";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Box,
  Grid
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import CustomButton from "components/Button";

type StreetTypeProps = {};

const StreetTypeAddEditView: FC<StreetTypeProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");

  useEffect(() => {
    if ((id != null) &&
      (id !== "") &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id));
    } else {
      navigate("/error-404");
    }
    return () => {
      store.clearStore();
    };
  }, []);

  return (
    <StreetTypeAddEditBaseView {...props}>
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_StreetTypeSaveButton"
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate(`/user/StreetType/addedit?id=${store.id}`);
                });
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              color={"secondary"}
              sx={{color:"white", backgroundColor: "red !important"}}
              id="id_StreetTypeCancelButton"
              onClick={() => navigate("/user/StreetType")}
            >
              {translate("common:goOut")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </StreetTypeAddEditBaseView>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default StreetTypeAddEditView;