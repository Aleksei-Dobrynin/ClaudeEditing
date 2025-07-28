import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Home as HomeIcon,
  NavigateNext,
  Security
} from "@mui/icons-material";
import { rootStore } from "./stores/RootStore";
import ObjectStep from "./components/steps/ObjectStep";
import CustomerStep from "./components/steps/CustomerStep";
import DocumentsStep from "./components/steps/DocumentsStep";
import PrintStep from "./components/steps/PrintStep";
import ApplicationStore from "features/Application/ApplicationAddEditView/store";
import { useNavigate } from "react-router-dom";

const App: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");
  const tab = query.get("tab");
  const [consentSign, setConsentSign] = React.useState(false);
  const langRaw = i18n.language.split("-")[0];
  const currentLang = langRaw === "ky" ? "kg" : langRaw;

  React.useEffect(() => {
    if ((id != null) && (id !== "") && !isNaN(Number(id.toString()))) {
      rootStore.applicationId = Number(id);
      if (tab && !isNaN(Number(tab.toString()))) {
        rootStore.setCurrentStep(Number(tab));
      } else {
        setConsentSign(true);
        rootStore.loadPersonalDataAgreementText();
      }
    }
  }, []);

  const stepComponents = [
    <ObjectStep />,
    <CustomerStep />,
    <DocumentsStep />,
    <PrintStep />
  ];

  const handleCloseConsentSign = () => {
    setConsentSign(false);
  };

  const getStepLabel = (step: string, index: number) => {
    if (index === 0 && rootStore.applicationId > 0) {
      return `${step} ✓`;
    }
    return step;
  };

  if (rootStore.isLoading && rootStore.currentStep === 0 && rootStore.applicationId > 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {rootStore.applicationId > 0 ? t("label:ApplicationAddEditView.editApplication") : t("label:ApplicationAddEditView.newApplication")}
              </Typography>
            </Box>
            {rootStore.applicationNumber && (
              <Chip
                label={`№${rootStore.applicationNumber}`}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Paper>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper
            activeStep={rootStore.currentStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
          >
            {rootStore.steps.map((label, index) => (
              <Step key={label} completed={index < rootStore.currentStep}>
                <StepLabel>
                  {getStepLabel(t(label), index)}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {rootStore.isLoading && (
            <LinearProgress sx={{ mt: 2 }} />
          )}
        </Paper>

        {/* Content */}
        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          {rootStore.isLoading && rootStore.currentStep !== 0 ? (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {stepComponents[rootStore.currentStep]}
              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={isMobile ? "column" : "row"}
                gap={2}
                mt={4}
                pt={3}
                borderTop={1}
                borderColor="divider"
              >
                <Button
                  variant="outlined"
                  startIcon={<ChevronLeft />}
                  onClick={() => {
                    if (rootStore.canNavigateBack) {
                      rootStore.previousStep()
                    } else {
                      navigate(`/user/Application`);
                    }
                  }}
                  fullWidth={isMobile}
                >
                  {t("common:back")}
                </Button>
                <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}
                     width={isMobile ? "100%" : "auto"}>
                  <Button
                    variant="contained"
                    endIcon={rootStore.isPrintStep ? <Check /> : <ChevronRight />}
                    onClick={() => {
                      if (rootStore.isObjectStep) {
                        if (!ApplicationStore.validateObjectForm()) {
                          return;
                        }
                        rootStore.service_id = ApplicationStore.service_id;
                      }
                      if (rootStore.isCustomerStep) {
                        ApplicationStore.service_id = rootStore.service_id;
                        ApplicationStore.onSaveClick((id: number) => {
                          if (ApplicationStore.id === 0) {
                            rootStore.applicationId = Number(id)
                            navigate(`/user/ApplicationStepper?id=${id}&tab=2`);
                          }
                          ApplicationStore.doLoad(id);
                        });
                      }
                      if (!rootStore.isLastStep) {
                        rootStore.nextStep();
                      } else {
                        navigate(`/user/Application`);
                      }
                    }}
                    color={rootStore.isLastStep ? "success" : "primary"}
                    fullWidth={isMobile}
                  >
                    {rootStore.isLastStep ? t("common:finish") : t("common:next")}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={rootStore.snackbar.open}
          autoHideDuration={6000}
          onClose={() => rootStore.closeSnackbar()}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => rootStore.closeSnackbar()}
            severity={rootStore.snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {rootStore.snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
});

export default App;