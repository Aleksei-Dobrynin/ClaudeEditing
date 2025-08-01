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
  Chip,
  StepIcon,
  StepIconProps,
  Fade,
  Slide,
  styled,
  alpha
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Description,
  Person,
  Assignment,
  Print,
  CheckCircle
} from "@mui/icons-material";
import { rootStore } from "./stores/RootStore";
import ObjectStep from "./components/steps/ObjectStep";
import CustomerStep from "./components/steps/CustomerStep";
import DocumentsStep from "./components/steps/DocumentsStep";
import PrintStep from "./components/steps/PrintStep";
import ApplicationStore from "features/Application/ApplicationAddEditView/store";
import { useNavigate } from "react-router-dom";

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: theme.palette.background.paper,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }
}));

const StepperPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: theme.palette.background.paper,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  position: "relative",
  minHeight: 400,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: `${theme.spacing(1.25)} ${theme.spacing(3)}`,
  fontWeight: 500,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  }
}));

const CustomStepIconRoot = styled("div")<{ active?: boolean; completed?: boolean }>(
  ({ theme, active, completed }) => ({
    backgroundColor: completed 
      ? theme.palette.primary.main 
      : active 
        ? theme.palette.primary.light 
        : alpha(theme.palette.action.disabled, 0.5),
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease",
    boxShadow: active || completed 
      ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` 
      : "none",
    ...(active && {
      animation: "pulse 2s infinite",
    }),
    "@keyframes pulse": {
      "0%": {
        boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`,
      },
      "70%": {
        boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`,
      },
      "100%": {
        boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
      },
    },
  })
);

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  const icons: { [index: string]: React.ReactElement } = {
    1: <Assignment />,
    2: <Person />,
    3: <Description />,
    4: <Print />,
  };

  return (
    <CustomStepIconRoot active={active} completed={completed} className={className}>
      {completed ? <CheckCircle /> : icons[String(props.icon)]}
    </CustomStepIconRoot>
  );
}

const StepperView: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");
  const tab = query.get("tab");
  const [consentSign, setConsentSign] = React.useState(false);
  const [stepDirection, setStepDirection] = React.useState<"left" | "right">("right");
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

  // Защита от undefined
  const currentStepComponent = stepComponents[rootStore.currentStep] || <ObjectStep />;

  const handleCloseConsentSign = () => {
    setConsentSign(false);
  };

  const getStepLabel = (step: string, index: number) => {
    return t(step);
  };

  // Новая логика обработки перехода на следующий шаг
  const handleNext = async () => {
    setStepDirection("right");
    
    try {
      const success = await rootStore.handleNextStep(ApplicationStore, navigate);
      if (!success) {
        // Ошибка уже показана в rootStore
        return;
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      rootStore.showSnackbar("Произошла ошибка при переходе", "error");
    }
  };

  const handleBack = () => {
    setStepDirection("left");
    if (rootStore.canNavigateBack) {
      rootStore.previousStep();
    } else {
      navigate(`/user/Application`);
    }
  };

  // Определяем текст кнопки и индикатор загрузки
  const getNextButtonText = () => {
    if (rootStore.isCurrentStepLoading) {
      if (rootStore.isCustomerStep && rootStore.isNewApplication) {
        return "Создание заявки...";
      }
      return "Загрузка...";
    }
    
    if (rootStore.isLastStep) {
      return t("common:finish");
    }
    
    return t("common:next");
  };

  const getNextButtonIcon = () => {
    if (rootStore.isCurrentStepLoading) {
      return <CircularProgress size={16} color="inherit" />;
    }
    
    if (rootStore.isPrintStep) {
      return <Check />;
    }
    
    return <ChevronRight />;
  };

  if (rootStore.isLoading && rootStore.currentStep === 0 && rootStore.applicationId > 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      {/* Header */}
      <Fade in timeout={600}>
        <HeaderPaper>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {rootStore.applicationId > 0 
                  ? t("label:ApplicationAddEditView.editApplication") 
                  : t("label:ApplicationAddEditView.newApplication")}
              </Typography>
              {rootStore.applicationId > 0 && rootStore.applicationNumber && (
                <Typography variant="body2" color="text.secondary">
                  {t("label:ApplicationListView.number")}: {rootStore.applicationNumber}
                </Typography>
              )}
              {rootStore.isNewApplication && (
                <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                  Черновик (не сохранено)
                </Typography>
              )}
            </Box>
            {rootStore.applicationNumber ? (
              <Chip
                label={`№${rootStore.applicationNumber}`}
                color="primary"
                variant="outlined"
                sx={{ 
                  fontWeight: 600,
                  borderWidth: 2,
                  borderRadius: 2,
                  fontSize: "1rem"
                }}
              />
            ) : (
              <Chip
                label="Черновик"
                color="warning"
                variant="outlined"
                sx={{ 
                  fontWeight: 600,
                  borderWidth: 2,
                  borderRadius: 2,
                  fontSize: "1rem"
                }}
              />
            )}
          </Box>
        </HeaderPaper>
      </Fade>

      {/* Stepper */}
      <Fade in timeout={800} style={{ transitionDelay: "200ms" }}>
        <StepperPaper>
          <Stepper
            activeStep={rootStore.currentStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
          >
            {rootStore.steps.map((label, index) => (
              <Step key={label} completed={index < rootStore.currentStep}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: index === rootStore.currentStep ? 600 : 400,
                      color: index === rootStore.currentStep 
                        ? theme.palette.primary.main 
                        : index < rootStore.currentStep 
                          ? theme.palette.text.primary 
                          : theme.palette.text.secondary
                    }}
                  >
                    {getStepLabel(label, index)}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {rootStore.isCurrentStepLoading && (
            <LinearProgress 
              sx={{ 
                mt: 2, 
                borderRadius: 1,
                height: 6,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 1,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }
              }} 
            />
          )}
        </StepperPaper>
      </Fade>

      {/* Content */}
      <Slide 
        direction={stepDirection} 
        in={!rootStore.isLoading || rootStore.currentStep === 0} 
        timeout={400}
        mountOnEnter
        unmountOnExit
      >
        <ContentPaper>
          {rootStore.isLoading && rootStore.currentStep !== 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <Fade in timeout={300}>
              <Box>
                {currentStepComponent}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={2}
                  mt={4}
                  pt={3}
                  sx={{ 
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  }}
                >
                  <StyledButton
                    variant="outlined"
                    startIcon={<ChevronLeft />}
                    onClick={handleBack}
                    fullWidth={isMobile}
                    disabled={rootStore.isCurrentStepLoading || !rootStore.canNavigateBack}
                  >
                    {t("common:back")}
                  </StyledButton>
                  <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}
                       width={isMobile ? "100%" : "auto"}>
                    <StyledButton
                      variant="contained"
                      endIcon={getNextButtonIcon()}
                      onClick={handleNext}
                      color={rootStore.isLastStep ? "success" : "primary"}
                      fullWidth={isMobile}
                      disabled={rootStore.isCurrentStepLoading}
                      sx={{
                        background: rootStore.isLastStep 
                          ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                          : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      }}
                    >
                      {getNextButtonText()}
                    </StyledButton>
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}
        </ContentPaper>
      </Slide>

      {/* Snackbar */}
      <Snackbar
        open={rootStore.snackbar.open}
        autoHideDuration={6000}
        onClose={() => rootStore.closeSnackbar()}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => rootStore.closeSnackbar()}
          severity={rootStore.snackbar.severity}
          variant="filled"
          sx={{ 
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          {rootStore.snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
});

export default StepperView;