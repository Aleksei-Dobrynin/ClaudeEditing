import React, { FC, useEffect } from "react";
import { default as ServicePriceAddEditBaseView } from "./base";
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
import MtmTabs from "./mtmTabs";
import S_DocumentTemplateTranslationTabView
  from "../../S_DocumentTemplateTranslation/S_DocumentTemplateTranslationListView/TabView";
import MainStore from "../../../MainStore";
import LayoutStore from "../../../layouts/MainLayout/store";

type ServicePriceProps = {};

const ServicePriceAddEditView: FC<ServicePriceProps> = observer((props) => {
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

  useEffect(() => {
    if(MainStore.isHeadStructure && id != null && id !== "") {
      store.structure_id = LayoutStore.head_of_structures[0].id
      store.loadServicesByStructure(LayoutStore.head_of_structures[0].id);
    }
  }, [LayoutStore.head_of_structures]);

  return (
    <ServicePriceAddEditBaseView {...props}>

      {store.document_template_id > 0 && <Grid item xs={12} spacing={0}>
        <S_DocumentTemplateTranslationTabView idMain={store.document_template_id} onChange={(translates) => store.languageChanged(translates)} />
      </Grid>}

      <Grid item xs={12} spacing={0}>
        <Box display="flex" p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_ServicePriceSaveButton"
              onClick={() => {
                store.onSaveClick((id: number) => {
                  navigate(`/user/ServicePrice`);
                });
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
          <Box m={2}>
            <CustomButton
              variant="contained"
              id="id_ServicePriceCancelButton"
              onClick={() => navigate("/user/ServicePrice")}
            >
              {translate("common:cancel")}
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    </ServicePriceAddEditBaseView>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ServicePriceAddEditView;