import React, { FC, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  alpha,
  styled,
  Fade,
  Alert
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import DateField from "components/DateField";
import SelectField from "components/SelectField";
import dayjs from "dayjs";
import ApplicationCommentsListView from "features/ApplicationComments/ApplicationCommentsListView";
import CustomTextField from "components/TextField";
import ObjectFormView from "features/Application/ApplicationAddEditView/ObjectForm";
import mainStore from "../../../../../MainStore";
import { SelectOrgStructureForWorklofw } from "constants/constant";
import storeComments from "../../../../ApplicationComments/ApplicationCommentsListView/store";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { rootStore } from "../../stores/RootStore";
import {
  BusinessCenter,
  Description,
  Comment,
  Assignment,
  Warning
} from "@mui/icons-material";

// Types
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

const RequiredFieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  "& .required-star": {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(0.5),
    fontWeight: "bold"
  }
}));

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const ObjectStep: FC<ProjectsTableProps> = observer((props) => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");
  const { t } = useTranslation();
  const translate = t;

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  useEffect(() => {
    if ((id != null) && (id !== "") && !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id));
      storeComments.setApplicationId(Number(id));
    } else {
      navigate("/error-404");
    }
  }, []);

  useEffect(() => {
    if (store.customer_id) {
      store.loadCustomerContacts(store.customer_id);
    }
  }, [store.customer_id]);

  useEffect(() => {
    store.is_application_read_only = !((mainStore.isAdmin || mainStore.isRegistrar) &&
      store.Statuses?.find(s => s.id === store.status_id)?.code !== "done");
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  // Валидация в реальном времени
  useEffect(() => {
    const errors: string[] = [];
    
    if (!store.service_id) {
      errors.push("Выберите услугу");
    }
    
    if (store.errorservice_id !== "") {
      errors.push("Исправьте ошибки в форме услуги");
    }

    setValidationErrors(errors);
    setShowValidationAlert(errors.length > 0);
    
    // Обновляем прогресс шага
    const progress = errors.length === 0 ? 100 : Math.max(0, 50 - (errors.length * 25));
    rootStore.updateStepProgress(0, progress);
  }, [store.service_id, store.errorservice_id]);

  // Cast Services to proper type
  const services = store.Services as Service[];

  // Service change handler
  const handleServiceChange = (event: any) => {
    const value = event.target.value;
    const service = services.find(s => s.id == value);

    // Update workflow logic
    if (service?.code == SelectOrgStructureForWorklofw.GIVE_DUPLICATE) {
      store.workflow_id_for_structure = service.workflow_id;
    } else {
      store.workflow_id_for_structure = null;
      store.workflow_task_structure_id = null;
    }

    // Use existing store method
    store.handleChange(event);
  };

  // Helper text logic
  const getServiceHelperText = (): string => {
    if (store.errorservice_id !== "") {
      return store.errorservice_id;
    }
    if (store.service_id) {
      return "Услуга выбрана";
    }
    return "Обязательное поле - выберите услугу";
  };

  // Prepare service options
  const serviceOptions = services.map(service => ({
    value: service.id,
    label: `${service.name} (${service.day_count} р.дн.)`,
    disabled: !service.is_active || !(() => {
      const today = dayjs();
      const isWithinDateRange = (!service.date_start || dayjs(service.date_start).isSame(today, "day") || dayjs(service.date_start).isBefore(today, "day")) &&
        (!service.date_end || dayjs(service.date_end).isSame(today, "day") || dayjs(service.date_end).isAfter(today, "day"));
      return isWithinDateRange;
    })(),
    description: `${service.day_count} рабочих дней`,
    group: service.is_active ? "Активные" : "Неактивные"
  }));

  const workflowOptions = store.WorkflowTaskTemplates
    ?.filter(x => x.workflow_id == store.workflow_id_for_structure)
    .map(template => ({
      value: template.id,
      label: template.structure_name || "",
      disabled: false
    })) || [];

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Validation Alert */}
        {showValidationAlert && validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Warning sx={{ mr: 1 }} />
              Необходимо заполнить обязательные поля
            </Typography>
            <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
              {validationErrors.map((error, index) => (
                <Typography key={index} component="li" variant="body2">
                  {error}
                </Typography>
              ))}
            </Box>
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Service Selection Section */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <RequiredFieldLabel variant="h6">
                  <BusinessCenter />
                  {translate("label:ApplicationAddEditView.service_id")}
                  <span className="required-star">*</span>
                </RequiredFieldLabel>

                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <SelectField
                      id="id_f_service_id"
                      name="service_id"
                      label={translate("label:ApplicationAddEditView.service_id")}
                      value={store.service_id || ''}
                      onChange={handleServiceChange}
                      options={serviceOptions}
                      required={true}
                      error={!store.service_id || store.errorservice_id !== ""}
                      helperText={getServiceHelperText()}
                      disabled={store.is_application_read_only}
                      searchable={true}
                      clearable={true}
                      showDescription={true}
                      groupBy={true}
                      size="small"
                      fullWidth
                    />
                  </Grid>

                  {store.id > 0 && (
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
                  )}

                  {store.workflow_id_for_structure && (
                    <Grid item md={12} xs={12}>
                      <SelectField
                        id="id_f_Application_workflow_task_structure_id"
                        name="workflow_task_structure_id"
                        label={translate("label:ApplicationAddEditView.workflow_task_structure_id")}
                        value={store.workflow_task_structure_id || ''}
                        onChange={(event) => store.handleChange(event)}
                        options={workflowOptions}
                        disabled={store.id > 0}
                        multiple={true}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  )}
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

          {/* Info Section */}
          <Grid item xs={12}>
            <Alert 
              severity={validationErrors.length === 0 ? "success" : "info"} 
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body2">
                {validationErrors.length === 0 ? (
                  <><strong>Готово!</strong> Все обязательные поля заполнены корректно.</>
                ) : (
                  <><strong>Обратите внимание:</strong> Поля отмеченные звездочкой (*) являются обязательными для заполнения.</>
                )}
              </Typography>
            </Alert>
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

export default ObjectStep;