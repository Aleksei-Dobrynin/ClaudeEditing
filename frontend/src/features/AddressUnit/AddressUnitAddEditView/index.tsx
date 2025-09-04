import React, { FC, useEffect } from "react";
import { default as AddressUnitAddEditBaseView } from "./base";
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

type AddressUnitProps = {};

const AddressUnitAddEditView: FC<AddressUnitProps> = observer((props) => {
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
    <AddressUnitAddEditBaseView {...props}>
      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_AddressUnitSaveButton"
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate(`/user/AddressUnit/addedit?id=${store.id}`);
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
              id="id_AddressUnitCancelButton"
              onClick={() => navigate("/user/AddressUnit")}
            >
              {translate("common:goOut")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </AddressUnitAddEditBaseView>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default AddressUnitAddEditView;