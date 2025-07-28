import React, { FC, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import DateField from "components/DateField";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import customerRepresentativeStoreList from "features/CustomerRepresentative/CustomerRepresentativeListView/store";
import Box from "@mui/material/Box";
import LookUp from "components/LookUp";
import ApplicationCommentsListView from "features/ApplicationComments/ApplicationCommentsListView";
import CustomTextField from "components/TextField";
import ObjectFormView from "features/Application/ApplicationAddEditView/ObjectForm";
import mainStore from "../../../../../MainStore";
import { SelectOrgStructureForWorklofw } from "constants/constant";
import storeComments from "../../../../ApplicationComments/ApplicationCommentsListView/store";
import storeObject from "../../../ApplicationAddEditView/storeObject";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";


type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");

  useEffect(() => {
    if ((id != null) &&
      (id !== "") &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id));
      storeComments.setApplicationId(Number(id));
    } else {
      navigate("/error-404");
    }
    // return () => {
    //   store.clearStore();
    //   storeObject.clearStore();
    // };
  }, []);

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
    store.is_application_read_only = !((mainStore.isAdmin || mainStore.isRegistrar) && store.Statuses.find(s => s.id === store.status_id)?.code !== "done");
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={3}>

          <Grid item md={8} xs={12}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Autocomplete
                disabled={store.is_application_read_only}
                value={store.Services.find(arch => arch.id === store.service_id) || null}
                onChange={(event, newValue) => {
                  let value = newValue ? newValue.id : "";
                  let service = store.Services.find(arch => arch.id == value);
                  if (service?.code == SelectOrgStructureForWorklofw.GIVE_DUPLICATE) {
                    store.workflow_id_for_structure = service.workflow_id;
                  } else {
                    store.workflow_id_for_structure = null;
                    store.workflow_task_structure_id = null;
                  }
                  store.handleChange({
                    target: { name: "service_id", value: value }

                  });
                }}
                options={store.Services}
                getOptionLabel={(Service) => `${Service.name} (${Service.day_count} р.дн.)` || ""}
                id="id_f_service_id"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                fullWidth
                getOptionDisabled={(option) => {
                  const today = dayjs();
                  const isWithinDateRange = (!option.date_start || dayjs(option.date_start).isSame(today, "day") || dayjs(option.date_start).isBefore(today, "day")) &&
                    (!option.date_end || dayjs(option.date_end).isSame(today, "day") || dayjs(option.date_end).isAfter(today, "day"));

                  return !option.is_active || !isWithinDateRange;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translate("label:ApplicationAddEditView.service_id")}
                    helperText={store.errorservice_id}
                    error={store.errorservice_id != ""}
                    size={"small"}
                  />
                )}
              />
            </Box>
          </Grid>

          {store.id > 0 &&
            <Grid item md={4} xs={12}>
              <DateField
                value={store.deadline ? dayjs(store.deadline) : null}
                onChange={(event) => store.handleChange(event)}
                name="deadline"
                id="id_f_deadline"
                label={translate("label:ApplicationAddEditView.deadline")}
                helperText={store.errordeadline}
                error={!!store.errordeadline}
                disabled={store.is_application_read_only}
              />
            </Grid>
          }

          {store.workflow_id_for_structure &&
            <Grid item md={12} xs={12}>
              <LookUp
                disabled={store.id > 0}
                data={store.WorkflowTaskTemplates.filter(x => x.workflow_id == store.workflow_id_for_structure)}
                id="id_f_Application_workflow_task_structure_id"
                label={translate("label:ApplicationAddEditView.workflow_task_structure_id")}
                value={store.workflow_task_structure_id}
                fieldNameDisplay={(x) => x.structure_name}
                onChange={(event) => store.handleChange(event)}
                name="workflow_task_structure_id"
              />
            </Grid>
          }

          <Grid item md={12} xs={12}>
            <CustomTextField
              helperText={store.errorwork_description}
              error={store.errorwork_description != ""}
              disabled={store.is_application_read_only}
              multiline={true}
              rows={2}
              id="id_f_Application_work_description"
              label={translate("label:ApplicationAddEditView.work_description")}
              value={store.work_description}
              onChange={(event) => store.handleChange(event)}
              name="work_description"
            />
          </Grid>
          <Grid item md={6} xs={6}>
            <CustomTextField
              helperText={store.errorincoming_numbers}
              error={store.errorincoming_numbers != ""}
              disabled={store.is_application_read_only}
              id="id_f_Application_incoming_numbers"
              label={translate("label:ApplicationAddEditView.incoming_numbers")}
              value={store.incoming_numbers}
              onChange={(event) => store.handleChange(event)}
              name="incoming_numbers"
            />
          </Grid>
          <Grid item md={6} xs={6}>
            <CustomTextField
              helperText={store.erroroutgoing_numbers}
              error={store.erroroutgoing_numbers != ""}
              disabled={store.is_application_read_only}
              id="id_f_Application_outgoing_numbers"
              label={translate("label:ApplicationAddEditView.outgoing_numbers")}
              value={store.outgoing_numbers}
              onChange={(event) => store.handleChange(event)}
              name="outgoing_numbers"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <ObjectFormView />
          </Grid>

          <Grid item md={12} xs={12}>
            {store.id > 0 && <ApplicationCommentsListView />}
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
});


export default BaseView;
