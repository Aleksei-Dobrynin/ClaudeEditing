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
import store from "./store";
import { observer } from "mobx-react";
import AddIcon from "@mui/icons-material/Add";
import DateField from "../../../components/DateField";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import customerRepresentativeStoreList from "../../CustomerRepresentative/CustomerRepresentativeListView/store";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ArchObjectPopupForm from "../../ArchObject/ArchObjectAddEditView/popupForm";
import CustomerRepresentativePopupForm from "../../CustomerRepresentative/CustomerRepresentativeAddEditView/popupForm";
import Box from "@mui/material/Box";
import LookUp from "../../../components/LookUp";
import ApplicationCommentsListView from "../../ApplicationComments/ApplicationCommentsListView";
import ObjectSearch from "./AutocompleteObject";
import CustomerFormView from "./CustomerForm";
import CustomTextField from "components/TextField";
import ObjectFormView from "./ObjectForm";
import mainStore from "../../../MainStore";
import { SelectOrgStructureForWorklofw } from "constants/constant";
import SelectField from "components/SelectField";


type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
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
    store.is_application_read_only = !((mainStore.isAdmin || mainStore.isRegistrar) && store.Statuses.find(s => s.id === store.status_id)?.code !== 'done');
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  return (
    <Container maxWidth="xl" style={{ marginTop: 10 }}>


      <Grid container>


        <CustomerRepresentativePopupForm
          openPanel={store.openCustomerRepresentativePanel}
          customer_id={store.customer_id}
          disabled={store.is_application_read_only}
          onBtnCancelClick={() => store.closeCustomerRepresentativePanel()}
          onSaveClick={() => {
            store.closeCustomerRepresentativePanel();
            customerRepresentativeStoreList.loadCustomerRepresentativesByCustomer(store.customer_id);
          }}
        />

        <form id="ApplicationForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader
                title={<><span
                  id="Application_TitleName">{`${translate("label:ApplicationAddEditView.entityTitle")} #${store.number}`}
                </span>{store.id > 0 && <><small style={{ color: "gray" }}> Регистратор: {store.created_by_name} Время: {store.registration_date ? dayjs(store.registration_date).format("DD.MM.YYYY HH:mm") : ""}</small></>}</>}
                action={
                  <>
                    <Chip color={store.is_paid ? "success" : "error"} sx={{ background: store.is_paid ? "#00875a" : "", color: store.is_paid ? "white" : "" }}
                      label={translate(`label:ApplicationAddEditView.paid_${!!store.is_paid}`)} />
                  </>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={8} xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SelectField
                        id="id_f_service_id"
                        name="service_id"
                        label={translate("label:ApplicationAddEditView.service_id")}
                        value={store.service_id}
                        onChange={(event) => {
                          let value = event.target.value;
                          let service = store.Services.find(arch => arch.id == value)
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
                        options={store.Services.map(service => ({
                          value: service.id,
                          label: `${service.name} (${service.day_count} р.дн.)`,
                          disabled: (() => {
                            const today = dayjs();
                            const isWithinDateRange = (!service.date_start || dayjs(service.date_start).isSame(today, 'day') || dayjs(service.date_start).isBefore(today, 'day')) &&
                              (!service.date_end || dayjs(service.date_end).isSame(today, 'day') || dayjs(service.date_end).isAfter(today, 'day'));
                            return !service.is_active || !isWithinDateRange;
                          })()
                        }))}
                        error={!!store.errorservice_id}
                        helperText={store.errorservice_id}
                        disabled={store.is_application_read_only}
                        required
                        clearable
                        fullWidth
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
                      <SelectField
                        id="id_f_Application_workflow_task_structure_id"
                        name="workflow_task_structure_id"
                        label={translate("label:ApplicationAddEditView.workflow_task_structure_id")}
                        value={store.workflow_task_structure_id}
                        onChange={(event) => store.handleChange(event)}
                        options={store.WorkflowTaskTemplates
                          .filter(x => x.workflow_id == store.workflow_id_for_structure)
                          .map(template => ({
                            value: template.id,
                            label: template.structure_name
                          }))}
                        disabled={store.id > 0}
                        fullWidth
                      />
                    </Grid>
                  }

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorwork_description}
                      error={store.errorwork_description != ''}
                      disabled={store.is_application_read_only}
                      multiline={true}
                      rows={2}
                      id='id_f_Application_work_description'
                      label={translate('label:ApplicationAddEditView.work_description')}
                      value={store.work_description}
                      onChange={(event) => store.handleChange(event)}
                      name="work_description"
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <CustomTextField
                      helperText={store.errorincoming_numbers}
                      error={store.errorincoming_numbers != ''}
                      disabled={store.is_application_read_only}
                      id='id_f_Application_incoming_numbers'
                      label={translate('label:ApplicationAddEditView.incoming_numbers')}
                      value={store.incoming_numbers}
                      onChange={(event) => store.handleChange(event)}
                      name="incoming_numbers"
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <CustomTextField
                      helperText={store.erroroutgoing_numbers}
                      error={store.erroroutgoing_numbers != ''}
                      disabled={store.is_application_read_only}
                      id='id_f_Application_outgoing_numbers'
                      label={translate('label:ApplicationAddEditView.outgoing_numbers')}
                      value={store.outgoing_numbers}
                      onChange={(event) => store.handleChange(event)}
                      name="outgoing_numbers"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomerFormView />
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
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
});


export default BaseView;
