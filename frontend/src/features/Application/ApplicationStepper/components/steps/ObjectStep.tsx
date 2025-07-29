import React, { FC, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Divider,
  Tooltip,
  Chip,
  alpha,
  styled,
  Fade,
  InputAdornment
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import DateField from "components/DateField";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import customerRepresentativeStoreList from "features/CustomerRepresentative/CustomerRepresentativeListView/store";
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
import {
  BusinessCenter,
  Description,
  DateRange,
  Comment,
  Info,
  Schedule,
  Assignment,
  Numbers
} from "@mui/icons-material";

// Type definitions based on store structure
interface Service {
  id: string | number;
  name: string;
  day_count: number;
  code?: string;
  workflow_id?: string | number;
  is_active?: boolean;
  date_start?: string;
  date_end?: string;
}

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      }
    }
  }
})) as typeof Autocomplete;

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      }
    }
  }
}));

const RequiredFieldIndicator = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: theme.spacing(0.5),
  fontWeight: "bold"
}));

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
    store.is_application_read_only = !((mainStore.isAdmin || mainStore.isRegistrar) && store.Statuses?.find(s => s.id === store.status_id)?.code !== "done");
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  // Cast Services to proper type
  const services = store.Services as Service[];

  return (
    <Fade in timeout={600}>
      <Box>
        <Grid container spacing={3}>
          {/* Service Selection Section */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <SectionTitle variant="h6">
                  <BusinessCenter />
                  {translate("label:ApplicationAddEditView.service_id")}
                  <RequiredFieldIndicator>*</RequiredFieldIndicator>
                </SectionTitle>
                
                <Grid container spacing={3}>
                  <Grid item md={8} xs={12}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <StyledAutocomplete
                        disabled={store.is_application_read_only}
                        value={services.find(arch => arch.id === store.service_id) || null}
                        onChange={(event, newValue) => {
                          let value = newValue ? newValue.id : "";
                          let service = services.find(arch => arch.id == value);
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
                        options={services || []}
                        getOptionLabel={(Service: Service) => Service ? `${Service.name} (${Service.day_count} р.дн.)` : ""}
                        id="id_f_service_id"
                        isOptionEqualToValue={(option: Service, value: Service) => option.id === value.id}
                        fullWidth
                        getOptionDisabled={(option: Service) => {
                          const today = dayjs();
                          const isWithinDateRange = (!option.date_start || dayjs(option.date_start).isSame(today, "day") || dayjs(option.date_start).isBefore(today, "day")) &&
                            (!option.date_end || dayjs(option.date_end).isSame(today, "day") || dayjs(option.date_end).isAfter(today, "day"));

                          return !option.is_active || !isWithinDateRange;
                        }}
                        renderOption={(props, option: Service) => (
                          <Box component="li" {...props}>
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body1">{option.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.day_count} рабочих дней
                                </Typography>
                              </Box>
                              {!option.is_active && (
                                <Chip label="Неактивно" size="small" color="error" />
                              )}
                            </Box>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            label={translate("label:ApplicationAddEditView.service_id")}
                            helperText={store.errorservice_id}
                            error={store.errorservice_id != ""}
                            size={"small"}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start">
                                    <BusinessCenter color="action" />
                                  </InputAdornment>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
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
                        data={store.WorkflowTaskTemplates?.filter(x => x.workflow_id == store.workflow_id_for_structure) || []}
                        id="id_f_Application_workflow_task_structure_id"
                        label={translate("label:ApplicationAddEditView.workflow_task_structure_id")}
                        value={store.workflow_task_structure_id}
                        fieldNameDisplay={(x) => x?.structure_name || ""}
                        onChange={(event) => store.handleChange(event)}
                        name="workflow_task_structure_id"
                      />
                    </Grid>
                  }
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Work Description Section */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <SectionTitle variant="h6">
                  <Description />
                  {translate("label:ApplicationAddEditView.work_description")}
                </SectionTitle>
                
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      helperText={store.errorwork_description}
                      error={store.errorwork_description != ""}
                      disabled={store.is_application_read_only}
                      multiline={true}
                      rows={3}
                      id="id_f_Application_work_description"
                      label={translate("label:ApplicationAddEditView.work_description")}
                      value={store.work_description}
                      onChange={(event) => store.handleChange(event)}
                      name="work_description"
                    />
                  </Grid>
                  
                  <Grid item md={6} xs={12}>
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
                  
                  <Grid item md={6} xs={12}>
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
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Object Form Section */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <SectionTitle variant="h6">
                  <Assignment />
                  {translate("label:ApplicationAddEditView.arch_object_id")}
                </SectionTitle>
                <Box sx={{ mt: 2 }}>
                  <ObjectFormView />
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Comments Section */}
          {store.id > 0 && (
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <SectionTitle variant="h6">
                    <Comment />
                    {translate("label:ApplicationAddEditView.comments_section")}
                  </SectionTitle>
                  <Box sx={{ mt: 2 }}>
                    <ApplicationCommentsListView />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          )}
        </Grid>
      </Box>
    </Fade>
  );
});

export default BaseView;