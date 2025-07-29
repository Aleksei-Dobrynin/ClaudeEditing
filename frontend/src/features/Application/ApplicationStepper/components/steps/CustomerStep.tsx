import React, { FC, useState, useEffect } from "react";
import { Box, Fade } from "@mui/material";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import CustomerFormView from "features/Application/ApplicationAddEditView/CustomerForm";
import mainStore from "../../../../../MainStore";

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  useEffect(() => {
    if (store.customer_id) {
      store.loadCustomerContacts(store.customer_id);
    }
  }, [store.customer_id]);
  
  useEffect(() => {
    store.is_application_read_only = !((mainStore.isAdmin || mainStore.isRegistrar) && store.Statuses.find(s => s.id === store.status_id)?.code !== "done");
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  return (
    <Fade in timeout={600}>
      <Box>
        <CustomerFormView />
      </Box>
    </Fade>
  );
});

export default BaseView;