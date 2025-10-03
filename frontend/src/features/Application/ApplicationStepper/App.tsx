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
  StepButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Chip
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Warning
} from "@mui/icons-material";
import { rootStore } from "./stores/RootStore";
import ObjectStep from "./components/steps/ObjectStep";
import CustomerStep from "./components/steps/CustomerStep";
import DocumentsStep from "./components/steps/DocumentsStep";
import PrintStep from "./components/steps/PrintStep";
import ApplicationStore from "features/Application/ApplicationAddEditView/store";
import { useNavigate } from "react-router-dom";

import store from "features/Application/ApplicationAddEditView/store";
import storeObject from "features/Application/ApplicationAddEditView/storeObject";

const App: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");
  const tab = query.get("tab");
  const [consentSign, setConsentSign] = React.useState(false);
  const [dictionariesLoaded, setDictionariesLoaded] = React.useState(false);

  React.useEffect(() => {
    // Функция загрузки всех необходимых справочников
    const loadInitialData = async () => {
      rootStore.setIsLoading(true);
      try {
        // Загружаем все справочники параллельно
        await Promise.all([
          store.loadServices(),
          store.loadStatuses(),
          store.loadApplicationRoads(),
          store.loadorganization_types(),
          store.loadobject_tags(),
          store.loadIdentity_document_types(),
          store.loadWorkflowTaskTemplates(),
          store.loadCountries(),
          store.loadMyCurrentStructure(),
          store.loadorg_structures(),
          // Загружаем справочники для объектов
          storeObject.loadDictionaries()
        ]);

        setDictionariesLoaded(true);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        rootStore.setIsLoading(false);
      }
    };

    // Создаем асинхронную функцию для инициализации
    const initializeApp = async () => {
      // Всегда загружаем справочники при первом монтировании компонента
      if (!dictionariesLoaded) {
        await loadInitialData();
      }

      // Обработка параметров URL
      if ((id != null) && (id !== "") && !isNaN(Number(id.toString()))) {
        rootStore.applicationId = Number(id);
        if (tab && !isNaN(Number(tab.toString()))) {
          rootStore.setCurrentStep(Number(tab));
        } else {
          setConsentSign(true);
          rootStore.loadPersonalDataAgreementText();
        }

        // Загружаем данные заявки после загрузки справочников
        if (Number(id) > 0 && dictionariesLoaded) {
          store.id = Number(id);
          store.loadApplication(Number(id)).then(() => {
            if (store.customer_id) {
              store.loadCustomer(store.customer_id);
              store.loadCustomerContacts(store.customer_id);
            }
            storeObject.app_id = Number(id);
            storeObject.loadArchObjects(Number(id));
          });
        }
      } else if (id === "0" && dictionariesLoaded) {
        // Новая заявка - инициализируем пустые данные
        store.id = 0;
        store.is_application_read_only = false;
        // Вызываем doLoad который создаст первый объект с правильной структурой
        await storeObject.doLoad(0);
      }
    };


    if (storeObject.arch_objects.length == 0) {
      const defaultDistrictId = storeObject.Districts.find(item => item.code === 'not defined')?.id || 6;

      storeObject.arch_objects = [{
        id: (storeObject.arch_objects.length + 1) * -1,
        address: "",
        name: "",
        identifier: "",
        district_id: defaultDistrictId, // Используем переменную
        tunduk_district_id: 0,
        xcoordinate: null,
        ycoordinate: null,
        description: "",
        name_kg: "",
        tags: [],
        geometry: [],
        addressInfo: [],
        point: [],
        DarekSearchList: [],
        errordistrict_id: "",
        errortunduk_district_id: "",
        errordescription: "",
        erroraddress: "",
        open: false,
        is_manual: false,
        tunduk_address_unit_id: 0,
        tunduk_street_id: 0,
        tunduk_building_id: null,
        tunduk_building_num: '',
        tunduk_flat_num: '',
        tunduk_uch_num: '',
        random_key: (Math.random() + 1).toString(36).substring(5)
      }]
    }

    // Вызываем асинхронную инициализацию
    initializeApp();

    // Cleanup при размонтировании компонента
    return () => {
      // При выходе из степпера полностью очищаем данные
      if (!rootStore.useCache) {
        store.clearApplicationData();
        storeObject.clearStore();
      }
    };
  }, [id, dictionariesLoaded]);

  const stepComponents = [
    <ObjectStep />,
    <CustomerStep />,
    <DocumentsStep register={true} />,
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

  // Обработчик клика по шагу степпера
  const handleStepClick = (stepIndex: number) => {
    // Проверяем возможность перехода
    if (!rootStore.canNavigateToStep(stepIndex)) {
      if (rootStore.applicationId === 0) {
        rootStore.showSnackbar(t("common:saveApplicationFirst"), "warning");
      }
      return;
    }

    // Валидация только если идем вперед (на следующие шаги)
    // При переходе назад валидация не нужна
    if (stepIndex > rootStore.currentStep) {
      if (!validateCurrentStep()) {
        return;
      }
    }

    // Переходим на выбранный шаг - ИСПРАВЛЕНО: используем правильный метод
    rootStore.setStep(stepIndex);
  };

  // Функция валидации текущего шага
  const validateCurrentStep = (): boolean => {
    switch (rootStore.currentStep) {
      case 0: // Objects
        if (rootStore.applicationId > 0) {
          return ApplicationStore.validateObjectForm();
        }
        return true;
      case 1: // Customer
        return ApplicationStore.validateCustomerForm();
      case 2: // Documents
        return true;
      case 3: // Review
        return true;
      default:
        return true;
    }
  };

  // Обработчик кнопки "Назад"
  const handleBackClick = () => {
    if (rootStore.isFirstStep) {
      // На первом шаге показываем диалог подтверждения выхода
      rootStore.setShowExitDialog(true);
    } else if (rootStore.canNavigateBack) {
      rootStore.previousStep();
    }
  };

  // Обработчик подтверждения выхода
  const handleExitConfirm = () => {
    rootStore.confirmExit();
    // Очищаем stores при выходе
    store.clearStore();
    storeObject.clearStore();
    navigate(`/user/Application`);
  };

  // Обработчик кнопки "Далее"
  const handleNextClick = () => {
    if (rootStore.isObjectStep) {
      if (!ApplicationStore.validateObjectForm()) {
        return;
      }
      rootStore.service_id = ApplicationStore.service_id;
    }

    if (rootStore.isCustomerStep) {
      if (!ApplicationStore.validateCustomerForm()) {
        return;
      }
      ApplicationStore.service_id = rootStore.service_id;
      ApplicationStore.onSaveClick((id: number) => {
        if (ApplicationStore.id === 0) {
          rootStore.applicationId = Number(id);
          navigate(`/user/ApplicationStepper?id=${id}&tab=2`);
        }
        ApplicationStore.doLoad(id);
      });
    }

    if (!rootStore.isLastStep) {
      rootStore.nextStep();
    } else {
      rootStore.useCache = false;
      navigate(`/user/Application`);
    }
  };

  // Показываем загрузку пока справочники не загружены
  if (!dictionariesLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Показываем загрузку при загрузке данных заявки
  if (rootStore.isLoading && rootStore.currentStep === 0 && rootStore.applicationId > 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const navsButtons = () => {
    return <Box
      display="flex"
      justifyContent="space-between"
      flexDirection={isMobile ? "column" : "row"}
      gap={2}
      mt={1}
      mb={1}
    >
      <Button
        variant="outlined"
        startIcon={<ChevronLeft />}
        onClick={handleBackClick}
        fullWidth={isMobile}
      >
        {rootStore.isFirstStep ? t("common:exit") : t("common:back")}
      </Button>
      <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}
        width={isMobile ? "100%" : "auto"}>
        <Button
          variant="contained"
          endIcon={rootStore.isPrintStep ? <Check /> : <ChevronRight />}
          onClick={handleNextClick}
          color={rootStore.isLastStep ? "success" : "primary"}
          fullWidth={isMobile}
        >
          {rootStore.isLastStep ? t("common:finish") : t("common:next")}
        </Button>
      </Box>
    </Box>
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        {rootStore.applicationNumber &&
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Chip
                label={`№${rootStore.applicationNumber}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Paper>
        }

        {/* Stepper с кликабельными шагами */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper
            activeStep={rootStore.currentStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            nonLinear={rootStore.applicationId > 0}
          >
            {rootStore.steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
                error?: boolean;
              } = {};

              if (index < rootStore.currentStep) {
                stepProps.completed = true;
              }

              // Проверяем, можно ли кликнуть на этот шаг
              const canClick = rootStore.canNavigateToStep(index);

              return (
                <Step key={label} {...stepProps}>
                  {canClick ? (
                    <StepButton
                      onClick={() => handleStepClick(index)}
                      optional={
                        index === rootStore.currentStep ? (
                          <Typography variant="caption" color="primary">
                            {t("common:currentStep")}
                          </Typography>
                        ) : null
                      }
                    >
                      {getStepLabel(t(label), index)}
                    </StepButton>
                  ) : (
                    <StepLabel {...labelProps}>
                      {getStepLabel(t(label), index)}
                    </StepLabel>
                  )}
                </Step>
              );
            })}
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
              {navsButtons()}
            </>
          )}
        </Paper>

        {/* Диалог подтверждения выхода */}
        <Dialog
          open={rootStore.showExitDialog}
          onClose={() => rootStore.cancelExit()}
          aria-labelledby="exit-dialog-title"
          aria-describedby="exit-dialog-description"
        >
          <DialogTitle id="exit-dialog-title">
            <Box display="flex" alignItems="center" gap={1}>
              <Warning color="warning" />
              {t("common:confirmExit")}
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="exit-dialog-description">
              {t("common:confirmExitMessage")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => rootStore.cancelExit()} color="primary">
              {t("common:cancel")}
            </Button>
            <Button onClick={handleExitConfirm} color="error" autoFocus>
              {t("common:exit")}
            </Button>
          </DialogActions>
        </Dialog>

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