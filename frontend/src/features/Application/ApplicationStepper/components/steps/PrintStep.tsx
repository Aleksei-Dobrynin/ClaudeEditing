import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Chip,
  Stack
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import AddIcon from "@mui/icons-material/Add";
import DateField from "components/DateField";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import customerRepresentativeStoreList from "features/CustomerRepresentative/CustomerRepresentativeListView/store";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ArchObjectPopupForm from "features/ArchObject/ArchObjectAddEditView/popupForm";
import CustomerRepresentativePopupForm
  from "features/CustomerRepresentative/CustomerRepresentativeAddEditView/popupForm";
import Box from "@mui/material/Box";
import LookUp from "components/LookUp";
import ApplicationCommentsListView from "features/ApplicationComments/ApplicationCommentsListView";
import ObjectSearch from "features/Application/ApplicationAddEditView/AutocompleteObject";
import CustomerFormView from "features/Application/ApplicationAddEditView/CustomerForm";
import CustomTextField from "components/TextField";
import ObjectFormView from "features/Application/ApplicationAddEditView/ObjectForm";
import mainStore from "../../../../../MainStore";
import { SelectOrgStructureForWorklofw } from "constants/constant";
import Uploaded_application_documentListView
  from "../../../../UploadedApplicationDocument/uploaded_application_documentListView";
import Outgoing_Uploaded_application_documentListGridView
  from "../../../../UploadedApplicationDocument/uploaded_application_documentListView/index_outgoing_grid";
import ApplicationWorkDocumentListView from "../../../../ApplicationWorkDocument/ApplicationWorkDocumentListView";
import MyTemplatesPrintView from "../../../../org_structure_templates/my_templates";
import Saved_application_documentListView
  from "../../../../saved_application_document/saved_application_documentListView";


type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");
  const { t } = useTranslation();
  const translate = t;
  useEffect(() => {
  }, [store.errorcustomer_id, store.errorarch_object_id, customerRepresentativeStoreList.data, store.errorservice_id]);
  useEffect(() => {
    if (store.customer_id) {
      store.loadCustomerContacts(store.customer_id);
    }
  }, [store.customer_id]);
  useEffect(() => {
    store.is_application_read_only = false && !((mainStore.isAdmin || mainStore.isRegistrar) && store.Statuses.find(s => s.id === store.status_id)?.code !== "done");
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  return (
    <Saved_application_documentListView idMain={Number(id)} templateCodeFilter={ ["statement", "confirm"] } />
  );
});


export default BaseView;
