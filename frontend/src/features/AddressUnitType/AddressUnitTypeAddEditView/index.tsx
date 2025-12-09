import React, { FC, useEffect } from "react";
import { default as AddressUnitTypeAddEditBaseView } from "./base";
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

type AddressUnitTypeProps = {};

const AddressUnitTypeAddEditView: FC<AddressUnitTypeProps> = observer((props) => {
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
    <AddressUnitTypeAddEditBaseView {...props}>
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_AddressUnitTypeSaveButton"
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate(`/user/AddressUnitType/addedit?id=${store.id}`);
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
              id="id_AddressUnitTypeCancelButton"
              onClick={() => navigate("/user/AddressUnitType")}
            >
              {translate("common:goOut")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </AddressUnitTypeAddEditBaseView>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default AddressUnitTypeAddEditView;