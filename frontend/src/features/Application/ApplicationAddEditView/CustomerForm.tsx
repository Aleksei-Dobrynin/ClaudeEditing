import React, { FC, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  alpha,
  styled,
  Fade,
  Chip,
  InputAdornment,
  Collapse,
  Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "../../../components/Checkbox";
import DateField from "components/DateField";
import dayjs from "dayjs";
import AutocompleteCustomer from "./AutocompleteCustomer";
import CloseIcon from "@mui/icons-material/Close";
import FastInputView from "./fastInput";
import MaskedTextField from "../../../components/MaskedTextField";
import AutocompleteCustomImg from "../../../components/AutocompleteWithImg";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import PopupApplicationListView from "../PopupAplicationListView/PopupAplicationListView";
import PopupApplicationStore from "../PopupAplicationListView/store";
import BadgeButton from "../../../components/BadgeButton";
import {
  Person,
  Business,
  LocationOn,
  Phone,
  Email,
  CreditCard,
  AccountBalance,
  Public,
  Assignment,
  ContactMail,
  Badge,
  Warning
} from "@mui/icons-material";
import SelectField from "components/SelectField";

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

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  marginBottom: theme.spacing(3)
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const SubSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: 0.5
}));

const StyledTextField = styled(CustomTextField)(({ theme }) => ({
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

const StyledMaskedTextField = styled(MaskedTextField)(({ theme }) => ({
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

const SectionErrorIndicator = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.error.main,
  fontSize: "0.875rem",
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.error.main, 0.1),
  borderRadius: theme.spacing(1),
}));

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const CustomerFormView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  // Функция для проверки наличия ошибок в секции
  const hasErrorsInSection = (section: 'main_info' | 'identity_documents' | 'contact_info' | 'organization_details'): boolean => {
    const sectionFields = {
      main_info: ['pin', 'full_name', 'individual_surname', 'individual_name', 'address', 'foreign_country'],
      identity_documents: ['identity_document_type_id', 'document_serie', 'document_date_issue', 'document_whom_issued'],
      contact_info: ['sms_1', 'sms_2', 'email_1', 'email_2'],
      organization_details: ['director', 'organization_type_id', 'ugns', 'registration_number', 'payment_account', 'bank', 'bik']
    };

    return sectionFields[section].some(field => store.customerErrors[field] !== "");
  };

  // Улучшенный обработчик изменения полей
  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.handleChangeCustomer(event);
  };

  // Обработчик потери фокуса для отдельного поля
  const handleFieldBlur = (fieldName: string) => {
    store.validateCustomerField(fieldName);
  };

  useEffect(() => {
  }, [store.customerErrors.pin])

  return (
    <Fade in timeout={600}>
      <Box>
        <StyledCard>
          <CardContent>
            {/* Customer Selection Section */}
            <SectionTitle variant="h6">
              <Person />
              {translate("label:ApplicationAddEditView.customer_id")}
              <RequiredFieldIndicator>*</RequiredFieldIndicator>
            </SectionTitle>

            <Grid container spacing={3}>
              <Grid item md={8} xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AutocompleteCustomer />
                  <Tooltip title={translate("tooltip:clear_customer")}>
                    <IconButton
                      disabled={store.id > 0}
                      sx={{
                        ml: 1,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: alpha("#ef4444", 0.1),
                          color: "#ef4444"
                        }
                      }}
                      onClick={() => {
                        store.changeCustomer(null);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                  {store.customer.id !== 0 && (
                    <BadgeButton
                      count={store.badgeCount}
                      circular={<CircularProgress size="20px" />}
                      stateCircular={store.loading}
                      icon={<ContentPasteSearchIcon sx={{ color: "#FF652F" }} />}
                      onClick={() => {
                        PopupApplicationStore.handleChange({ target: { name: "openCustomerApplicationDialog", value: !PopupApplicationStore.openCustomerApplicationDialog } })
                        PopupApplicationStore.handleChange({ target: { name: "common_filter", value: store.customer.pin } }, "filter")
                        PopupApplicationStore.handleChange({ target: { name: "only_count", value: false } }, "filter")
                      }}
                    />
                  )}
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <StyledMaskedTextField
                  disabled={store.is_application_read_only}
                  helperText={store.customerErrors.pin}
                  error={!!store.customerErrors.pin}
                  id="id_f_Customer_pin"
                  label={translate("label:CustomerAddEditView.pin")}
                  value={store.customer.pin}
                  onChange={handleFieldChange}
                  name="pin"
                  mask={store.customer.is_foreign ? null : "00000000000000"}
                  onBlur={() => {
                    store.setBadge();
                    handleFieldBlur('pin');
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Customer Type Options */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item md={3} xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid ${store.customer.is_organization ? alpha("#3b82f6", 0.5) : alpha("#9ca3af", 0.3)}`,
                      backgroundColor: store.customer.is_organization ? alpha("#3b82f6", 0.08) : "transparent",
                      transition: "all 0.3s ease",
                      cursor: store.is_application_read_only ? "default" : "pointer",
                      "&:hover": {
                        borderColor: store.is_application_read_only ? "" : alpha("#3b82f6", 0.5),
                      }
                    }}
                  >
                    <CustomCheckbox
                      value={store.customer.is_organization}
                      disabled={store.is_application_read_only}
                      onChange={handleFieldChange}
                      name="is_organization"
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Business />
                          {translate("label:CustomerAddEditView.is_organization")}
                        </Box>
                      }
                      id="id_f_is_organization"
                    />
                  </Paper>
                </Grid>

                <Grid item md={3} xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid ${store.customer.is_foreign ? alpha("#3b82f6", 0.5) : alpha("#9ca3af", 0.3)}`,
                      backgroundColor: store.customer.is_foreign ? alpha("#3b82f6", 0.08) : "transparent",
                      transition: "all 0.3s ease",
                      cursor: store.is_application_read_only ? "default" : "pointer",
                      "&:hover": {
                        borderColor: store.is_application_read_only ? "" : alpha("#3b82f6", 0.5),
                      }
                    }}
                  >
                    <CustomCheckbox
                      disabled={store.is_application_read_only}
                      value={store.customer.is_foreign}
                      onChange={handleFieldChange}
                      name="is_foreign"
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Public />
                          {translate("label:CustomerAddEditView.is_foreign")}
                        </Box>
                      }
                      id="id_f_is_foreign"
                    />
                  </Paper>
                </Grid>

                <Grid item md={4} xs={12}>
                  <Collapse in={store.customer.is_foreign}>
                    <SelectField
                      id="id_f_customer_identity_foreign_country_id"
                      name="foreign_country"
                      label={translate("common:country")}
                      value={store.customer.foreign_country}
                      onChange={handleFieldChange}
                      options={store.Countries.map(country => ({
                        value: country.id,
                        label: country.name,
                        icon: country.icon_svg ? <img src={country.icon_svg} alt="flag" style={{ width: 20, height: 15 }} /> : undefined
                      }))}
                      error={!!store.customerErrors.foreign_country}
                      helperText={store.customerErrors.foreign_country}
                      disabled={store.is_application_read_only}
                      required
                      searchable
                      fullWidth
                    />
                  </Collapse>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Main Information Section */}
            <SectionPaper elevation={0}>
              <SectionTitle variant="subtitle1">
                <ContactMail />
                {translate("Основная информация")}
                {hasErrorsInSection('main_info') && (
                  <Warning sx={{ color: 'error.main', ml: 1, fontSize: '1.2rem' }} />
                )}
              </SectionTitle>

              <Grid container spacing={3}>
                {store.customer.is_organization ? (
                  <Grid item md={12} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      helperText={store.customerErrors.full_name}
                      error={!!store.customerErrors.full_name}
                      id="id_f_Customer_full_name"
                      label={translate("label:CustomerAddEditView.full_name")}
                      value={store.customer.full_name}
                      onChange={handleFieldChange}
                      name="full_name"
                      onBlur={() => handleFieldBlur('full_name')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item md={4} xs={12}>
                      <StyledTextField
                        disabled={store.is_application_read_only}
                        value={store.customer.individual_surname}
                        onChange={handleFieldChange}
                        name="individual_surname"
                        data-testid="id_f_customer_individual_surname"
                        id="id_f_customer_individual_surname"
                        label={translate("label:CustomerAddEditView.individual_surname")}
                        helperText={store.customerErrors.individual_surname}
                        error={!!store.customerErrors.individual_surname}
                        onBlur={() => handleFieldBlur('individual_surname')}
                      />
                    </Grid>

                    <Grid item md={4} xs={12}>
                      <StyledTextField
                        disabled={store.is_application_read_only}
                        value={store.customer.individual_name}
                        onChange={handleFieldChange}
                        name="individual_name"
                        data-testid="id_f_customer_individual_name"
                        id="id_f_customer_individual_name"
                        label={translate("label:CustomerAddEditView.individual_name")}
                        helperText={store.customerErrors.individual_name}
                        error={!!store.customerErrors.individual_name}
                        onBlur={() => handleFieldBlur('individual_name')}
                      />
                    </Grid>

                    <Grid item md={4} xs={12}>
                      <StyledTextField
                        disabled={store.is_application_read_only}
                        value={store.customer.individual_secondname}
                        onChange={handleFieldChange}
                        name="individual_secondname"
                        data-testid="id_f_customer_individual_secondname"
                        id="id_f_customer_individual_secondname"
                        label={translate("label:CustomerAddEditView.individual_secondname")}
                        helperText={store.customerErrors.individual_secondname}
                        error={!!store.customerErrors.individual_secondname}
                        onBlur={() => handleFieldBlur('individual_secondname')}
                      />
                    </Grid>
                  </>
                )}

                <Grid item md={12} xs={12}>
                  <StyledTextField
                    disabled={store.is_application_read_only}
                    helperText={store.customerErrors.address}
                    error={!!store.customerErrors.address}
                    id="id_f_Customer_address"
                    label={translate("label:CustomerAddEditView.address")}
                    value={store.customer.address}
                    onChange={handleFieldChange}
                    name="address"
                    onBlur={() => handleFieldBlur('address')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {hasErrorsInSection('main_info') && (
                <SectionErrorIndicator>
                  <Warning />
                  Пожалуйста, заполните все обязательные поля в разделе "Основная информация"
                </SectionErrorIndicator>
              )}
            </SectionPaper>

            {/* Organization Details Section */}
            <Collapse in={store.customer.is_organization}>
              <SectionPaper elevation={0}>
                <SectionTitle variant="subtitle1">
                  <Business />
                  {translate("Реквизиты организации")}
                  {hasErrorsInSection('organization_details') && (
                    <Warning sx={{ color: 'error.main', ml: 1, fontSize: '1.2rem' }} />
                  )}
                </SectionTitle>

                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      helperText={store.customerErrors.director}
                      error={!!store.customerErrors.director}
                      id="id_f_Customer_director"
                      label={translate("label:CustomerAddEditView.director")}
                      value={store.customer.director}
                      onChange={handleFieldChange}
                      name="director"
                      onBlur={() => handleFieldBlur('director')}
                    />
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <SelectField
                      id="id_f_Customer_organization_type_id"
                      name="organization_type_id"
                      label={translate("label:CustomerAddEditView.organization_type_id")}
                      value={store.customer.organization_type_id}
                      onChange={handleFieldChange}
                      options={store.OrganizationTypes.map(type => ({
                        value: type.id,
                        label: type.name
                      }))}
                      error={!!store.customerErrors.organization_type_id}
                      helperText={store.customerErrors.organization_type_id}
                      disabled={store.is_application_read_only}
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      helperText={store.customerErrors.ugns}
                      error={!!store.customerErrors.ugns}
                      id="id_f_Customer_ugns"
                      label={translate("label:CustomerAddEditView.ugns")}
                      value={store.customer.ugns}
                      onChange={handleFieldChange}
                      name="ugns"
                      onBlur={() => handleFieldBlur('ugns')}
                    />
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      helperText={store.customerErrors.registration_number}
                      error={!!store.customerErrors.registration_number}
                      id="id_f_Customer_registration_number"
                      label={translate("label:CustomerAddEditView.registration_number")}
                      value={store.customer.registration_number}
                      onChange={handleFieldChange}
                      name="registration_number"
                      onBlur={() => handleFieldBlur('registration_number')}
                    />
                  </Grid>
                </Grid>

                <SubSectionTitle>
                  {translate("Банковские реквизиты")}
                </SubSectionTitle>

                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      helperText={store.customerErrors.payment_account}
                      error={!!store.customerErrors.payment_account}
                      id="id_f_Customer_payment_account"
                      label={translate("label:CustomerAddEditView.payment_account")}
                      value={store.customer.payment_account}
                      onChange={handleFieldChange}
                      name="payment_account"
                      onBlur={() => handleFieldBlur('payment_account')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      helperText={store.customerErrors.bank}
                      error={!!store.customerErrors.bank}
                      id="id_f_Customer_bank"
                      label={translate("label:CustomerAddEditView.bank")}
                      value={store.customer.bank}
                      onChange={handleFieldChange}
                      name="bank"
                      onBlur={() => handleFieldBlur('bank')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBalance color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      helperText={store.customerErrors.bik}
                      error={!!store.customerErrors.bik}
                      id="id_f_Customer_bik"
                      label={translate("label:CustomerAddEditView.bik")}
                      value={store.customer.bik}
                      onChange={handleFieldChange}
                      name="bik"
                      onBlur={() => handleFieldBlur('bik')}
                    />
                  </Grid>
                </Grid>

                {hasErrorsInSection('organization_details') && (
                  <SectionErrorIndicator>
                    <Warning />
                    Пожалуйста, заполните все обязательные поля в разделе "Реквизиты организации"
                  </SectionErrorIndicator>
                )}
              </SectionPaper>
            </Collapse>

            {/* Personal Documents Section */}
            <Collapse in={!store.customer.is_organization}>
              <SectionPaper elevation={0}>
                <SectionTitle variant="subtitle1">
                  <Assignment />
                  {translate("Документы, удостоверяющие личность")}
                  {hasErrorsInSection('identity_documents') && (
                    <Warning sx={{ color: 'error.main', ml: 1, fontSize: '1.2rem' }} />
                  )}
                </SectionTitle>

                <Grid container spacing={3}>
                  <Grid item md={4} xs={12}>
                    <SelectField
                      id="id_f_customer_identity_document_type_id"
                      name="identity_document_type_id"
                      label={translate("label:CustomerAddEditView.identity_document_type_id")}
                      value={store.customer.identity_document_type_id}
                      onChange={handleFieldChange}
                      options={store.Identity_document_types.map(type => ({
                        value: type.id,
                        label: type.name
                      }))}
                      error={!!store.customerErrors.identity_document_type_id}
                      helperText={store.customerErrors.identity_document_type_id}
                      disabled={store.is_application_read_only}
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      value={store.customer.document_serie}
                      onChange={handleFieldChange}
                      name="document_serie"
                      data-testid="id_f_customer_document_serie"
                      id="id_f_customer_document_serie"
                      label={translate("label:CustomerAddEditView.document_serie")}
                      helperText={store.customerErrors.document_serie}
                      error={!!store.customerErrors.document_serie}
                      onBlur={() => handleFieldBlur('document_serie')}
                    />
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <DateField
                      disabled={store.is_application_read_only}
                      value={store.customer.document_date_issue ? dayjs(store.customer.document_date_issue) : null}
                      onChange={(event) => {
                        const formattedEvent = {
                          target: {
                            name: 'document_date_issue',
                            value: event.target.value?.format()
                          }
                        };
                        handleFieldChange(formattedEvent as any);
                        // Валидация после изменения
                        setTimeout(() => handleFieldBlur('document_date_issue'), 0);
                      }}
                      name="document_date_issue"
                      id="id_f_customer_document_date_issue"
                      label={translate("label:CustomerAddEditView.document_date_issue")}
                      helperText={store.customerErrors.document_date_issue}
                      error={!!store.customerErrors.document_date_issue}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <StyledTextField
                      disabled={store.is_application_read_only}
                      value={store.customer.document_whom_issued}
                      onChange={handleFieldChange}
                      name="document_whom_issued"
                      data-testid="id_f_customer_document_whom_issued"
                      id="id_f_customer_document_whom_issued"
                      label={translate("label:CustomerAddEditView.document_whom_issued")}
                      helperText={store.customerErrors.document_whom_issued}
                      error={!!store.customerErrors.document_whom_issued}
                      onBlur={() => handleFieldBlur('document_whom_issued')}
                    />
                  </Grid>
                </Grid>

                {hasErrorsInSection('identity_documents') && (
                  <SectionErrorIndicator>
                    <Warning />
                    Пожалуйста, заполните все обязательные поля в разделе "Документы, удостоверяющие личность"
                  </SectionErrorIndicator>
                )}
              </SectionPaper>
            </Collapse>

            {/* Contact Information Section */}
            <SectionPaper elevation={0}>
              <SectionTitle variant="subtitle1">
                <Phone />
                {translate("Контактная информация")}
                {hasErrorsInSection('contact_info') && (
                  <Warning sx={{ color: 'error.main', ml: 1, fontSize: '1.2rem' }} />
                )}
              </SectionTitle>

              <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                  <StyledMaskedTextField
                    disabled={store.is_application_read_only}
                    helperText={store.customerErrors.sms_1}
                    error={!!store.customerErrors.sms_1}
                    id="id_f_Customer_sms_1"
                    label={translate("label:CustomerAddEditView.sms_1")}
                    value={store.customer.sms_1}
                    onChange={handleFieldChange}
                    name="sms_1"
                    mask="+(996)000-00-00-00"
                    onBlur={() => handleFieldBlur('sms_1')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <StyledMaskedTextField
                    disabled={store.is_application_read_only}
                    helperText={store.customerErrors.sms_2}
                    error={!!store.customerErrors.sms_2}
                    id="id_f_Customer_sms_2"
                    label={translate("label:CustomerAddEditView.sms_2")}
                    value={store.customer.sms_2}
                    onChange={handleFieldChange}
                    name="sms_2"
                    mask="+(996)000-00-00-00"
                    onBlur={() => handleFieldBlur('sms_2')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <StyledTextField
                    disabled={store.is_application_read_only}
                    helperText={store.customerErrors.email_1}
                    error={!!store.customerErrors.email_1}
                    id="id_f_Customer_email_1"
                    label={translate("label:CustomerAddEditView.email_1")}
                    value={store.customer.email_1}
                    onChange={handleFieldChange}
                    name="email_1"
                    onBlur={() => handleFieldBlur('email_1')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <StyledTextField
                    disabled={store.is_application_read_only}
                    helperText={store.customerErrors.email_2}
                    error={!!store.customerErrors.email_2}
                    id="id_f_Customer_email_2"
                    label={translate("label:CustomerAddEditView.email_2")}
                    value={store.customer.email_2}
                    onChange={handleFieldChange}
                    name="email_2"
                    onBlur={() => handleFieldBlur('email_2')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {hasErrorsInSection('contact_info') && (
                <SectionErrorIndicator>
                  <Warning />
                  Проверьте правильность заполнения контактной информации
                </SectionErrorIndicator>
              )}
            </SectionPaper>

            {/* Fast Input Section */}
            <Box sx={{ mt: 3 }}>
              <FastInputView idMain={store.customer_id} />
            </Box>
          </CardContent>
        </StyledCard>

        <PopupApplicationListView />
      </Box>
    </Fade>
  );
});

export default CustomerFormView;