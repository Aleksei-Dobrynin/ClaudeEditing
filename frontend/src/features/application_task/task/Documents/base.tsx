import React, { FC, ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Button,
  IconButton,
  Divider,
  Paper,
  Stack,
  Tooltip,
  LinearProgress,
  Alert,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ExpandMore,
  Check,
  Schedule,
  Upload,
  Visibility,
  ArrowBack,
  ArrowForward,
  Warning,
  Description,
  Info,
  Pause,
  PlayArrow,
  History,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import store from './store';
import workDocumentStore from './WorkDocument/store';
import { useTranslation } from 'react-i18next';
import { DocumentCard } from 'features/UploadedApplicationDocument/uploaded_application_documentListView/cards';
import { WorkDocumentCard } from './WorkDocument/WorkDocumentCard';
import MainStore from 'MainStore';
import { Add } from '@mui/icons-material';
import AddDocumentDialog from './AddDocument/AddDocumentDialog';
import AddSignerDialog from './AddDocument/AddSignerDialog';
import documentFormsStore from './AddDocument/documentFormsStore';
// import ApplicationWorkDocumentPopupForm from "features/ApplicationWorkDocument/ApplicationWorkDocumentAddEditView/popupForm";
import FileViewer from "components/FileViewer";
import UploadDocumentModal from './WorkDocument/UploadDocumentModal';
import taskStore from './../store'
import LayoutStore from 'layouts/MainLayout/store'
import { APPLICATION_STATUSES } from 'constants/constant';
import { useNavigate } from 'react-router-dom';
import StepStatusHistoryGrid from './StepStatusHistoryGrid';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import AddServiceDialog from "../AddServiceDialog/AddServiceDialog";
import AddServiceDialogStore from "../AddServiceDialog/addServiceDialogStore";

import { NestedStepGroup } from './NestedStepGroup';
import { groupStepsByNested } from 'utils/nestedStepsHelper';

import { AppStep } from './store';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

interface ApplicationStepsBaseViewProps {
  children?: ReactNode;
  service_id: number;
  taskId: number;
  onPaymentDialogOpen?: () => void;
  accessPaymentDialog?: boolean;
}

const ApplicationStepsBaseView: FC<ApplicationStepsBaseViewProps> = observer(({ children, service_id, taskId, onPaymentDialogOpen, accessPaymentDialog }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("app_step_id");

    if (stepParam && store.data.length > 0) {
      const stepId = parseInt(stepParam, 10);
      const foundStep = store.data.find(s => s.id === stepId);
      if (foundStep && !store.isStepExpanded(foundStep.id)) {
        store.toggleStep(foundStep.id);
        setTimeout(() => {
          const el = document.getElementById(`step-${stepId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [store.expandedStepIds, store.data]);

  const hasAccessToStepStatuses = (structureId: number) => {
    let str_ids = taskStore.OrgStructures.filter(x => x.parent_id === structureId).map(x => x.id) // children structures
    str_ids.push(structureId);
    let str_ids2 = taskStore.OrgStructures.filter(x => str_ids.includes(x.parent_id)).map(x => x.id)
    str_ids.push(str_ids2)

    return (
      taskStore.Application.status_code === APPLICATION_STATUSES.preparation
      // && (LayoutStore.my_structures?.find(x => str_ids.includes(x.structure_id)) != null)
    )
      || MainStore.isAdmin
  }

  const hasAccessToStepToReturn = (structureId: number) => ((
    taskStore.Application.status_code === APPLICATION_STATUSES.preparation
    && MainStore.isHeadStructure
  )
    || MainStore.isAdmin)

  const renderStatusChip = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Chip
            icon={<Check />}
            label={"Завершен"}
            color="success"
            size="small"
            variant="filled"
          />
        );
      case "in_progress":
        return (
          <Chip
            icon={<Schedule />}
            label={"В процессе"}
            color="primary"
            size="small"
            variant="filled"
          />
        );
      case "waiting":
        return (
          <Chip
            icon={<Schedule />}
            label={"В ожидании"}
            color="default"
            size="small"
            variant="outlined"
          />
        );
      case "paused":
        return (
          <Chip
            icon={<Pause />}
            label={"Приостановлен"}
            color="warning"
            size="small"
            variant="filled"
          />
        );
      default:
        return (
          <Chip
            label={status}
            size="small"
            variant="outlined"
          />
        );
    }
  };

  const declineDays = (number) => {

    if (!number) return null;
    // Получаем последнюю цифру и последние две цифры числа
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    // Особые случаи для чисел от 11 до 19
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return <span style={{ color: "grey" }}>({number} дней)</span>;
    }

    // Для остальных чисел проверяем последнюю цифру
    switch (lastDigit) {
      case 1:
        return <span style={{ color: "grey" }}>({number} день)</span>;
      case 2:
      case 3:
      case 4:
        return <span style={{ color: "grey" }}>({number} дня)</span>;
      default:
        return <span style={{ color: "grey" }}>({number} дней)</span>;
    }
  }


  // Функция для рендеринга одного шага (используется для обычных и вложенных шагов)
  const renderSingleStep = (step: any, customStepNumber?: string, isNested: boolean = false) => {
    // Используем кастомную нумерацию для вложенных шагов (например "3.1")
    // или обычную для регулярных шагов
    const displayNumber = customStepNumber || step.order_number;

    // Получаем группы вложенных шагов для этого шага (если это не вложенный шаг)
    const nestedGroups = !isNested ? groupsByParentId.get(step.id) || [] : [];

    return (
      <Accordion
        key={step.id}
        expanded={store.isStepExpanded(step.id)}
        onChange={() => {
          store.toggleStep(step.id)
              navigate(`/user/application_task/addedit?id=${taskId}&tab_id=${2}&app_step_id=${step.id}&back=${taskStore.backUrl}`);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                {displayNumber}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              {/* ИНДИКАТОР ПРИОСТАНОВЛЕННОГО ШАГА */}
              {step.is_paused && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    mb: 0.5
                  }}
                >
                  <PauseCircleIcon sx={{ color: '#ff9800', mr: 0.5, fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ff9800',
                      fontWeight: 600
                    }}
                  >
                    Приостановлен
                  </Typography>
                </Box>
              )}

              <Typography variant="h3" component="div">
                {step.name} {declineDays(step.planned_duration)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                <Typography variant="h4" color="text.primary">
                  {store.departments[step.responsible_department_id]?.name}
                </Typography>
              </Box>
              <Box m={1}>
                {renderStatusChip(step.status)}
              </Box>
              <Box>
                {(store.application_additional_service ?? []).filter(x=>x.status == 'active' && x.added_at_step_id == step.id).map((s: any) => (
                  <Chip
                    label={s.service_name}
                    color="success"
                    size="small"
                    variant="filled"
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mr: 2 }}>
              {step.status === "in_progress" &&
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddService(step.id);
                  }}
                  fullWidth
                >
                  Добавить услугу
                </Button>}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mr: 2 }}>
              {step.status === "in_progress" && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  disabled={!hasAccessToStepStatuses(step.responsible_department_id) || !store.canCompleteStep(step.id)}
                  startIcon={<ArrowForward />}
                  onClick={(e) => {
                    e.stopPropagation();
                    store.completeStep(step.id, step.responsible_department_id);
                  }}
                >
                  Завершить
                </Button>
              )}
              {step.status === "paused" && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={!hasAccessToStepStatuses(step.responsible_department_id)}
                  startIcon={<PlayArrow />}
                  onClick={(e) => {
                    e.stopPropagation();
                    store.resumeStep(step.id);
                  }}
                >
                  Возобновить
                </Button>
              )}
              {step.status === "completed" && (
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  disabled={!hasAccessToStepToReturn(step.responsible_department_id)}
                  startIcon={<ArrowBack />}
                  onClick={(e) => {
                    e.stopPropagation();
                    store.returnStep(step.id);
                  }}
                >
                  Вернуть
                </Button>
              )}
              {step.status === "waiting" && (
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  disabled={!hasAccessToStepStatuses(step.responsible_department_id) || !store.canStartStep(step.step_id)}
                  startIcon={<ArrowBack />}
                  onClick={(e) => {
                    e.stopPropagation();
                    store.toProgress(step.id);
                  }}
                >
                  В работу
                </Button>
              )}
            </Box>

            <Tooltip title="Просмотр истории статусов">
              <IconButton
                color="info"
                size="large"
                onClick={(e) => {
                  e.stopPropagation();
                  store.showHistoryDialog(step.id);
                }}
              >
                <History />
              </IconButton>
            </Tooltip>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            {/* Индикатор причины приостановки */}
            {step.is_paused && (
              <Box
                sx={{
                  p: 1.5,
                  mb: 2,
                  backgroundColor: '#fff3e0',
                  borderLeft: '4px solid #ff9800',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" fontWeight="600" sx={{ color: '#e65100', mb: 0.5 }}>
                  ⏸️ Шаг приостановлен
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {step.pause_reason || 'Ожидание завершения добавленных шагов'}
                </Typography>
              </Box>
            )}

            {/* Dates */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Сроки
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Дата начала
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {store.formatDate(step.start_date)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {"Срок выполнения"}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {store.formatDate(step.due_date)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {"Дата завершения"}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {store.formatDate(step.completion_date)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Dependencies */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Зависимости с другими этапами
              </Typography>

              {step.dependencies?.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Предшествующие шаги:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {step.dependencies.map((depId) => {
                      const depStep = store.data.find((s) => s.step_id === depId);
                      return (
                        <Chip
                          key={`dep-${depId}`}
                          label={depStep?.name}
                          size="small"
                          icon={store.isStepCompleted(depStep?.step_id || 0) ? <Check /> : <Warning />}
                          color={store.isStepCompleted(depStep?.step_id || 0) ? "success" : "info"}
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Нет предшествующих шагов
                </Typography>
              )}

              {step.blocks?.length > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Следующие шаги:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {step.blocks.map((blockId) => {
                      const blockedStep = store.data.find((s) => s.step_id === blockId);
                      return (
                        <Chip
                          key={`block-${blockId}`}
                          label={blockedStep?.name}
                          size="small"
                          icon={blockedStep?.status === "waiting" ? <Schedule /> : <ArrowForward />}
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Documents */}
            {step.workDocuments?.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Рабочие документы:
                </Typography>
                <Box>
                  {step.workDocuments?.map(doc => (
                    <WorkDocumentCard
                      key={doc.id}
                      document={doc}
                      t={t}
                      hasAccess={true}
                      step_id={step.id}
                      step={step}
                      onOpenFileHistory={(step: number) => {
                        store.loadGetApplicationWorkDocumentByStepID(step);
                        store.isOpenFileHistory = true;
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Documents */}
            <Box>
              {step.documents?.length > 0 && (
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Документы на подпись
                </Typography>
              )}
              <Box>
                {step.documents?.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    onSigned={() => {
                      store.loadApplication(store.application_id)
                    }}
                    document={doc}
                    onUploadFile={() => {
                      store.onUploadFile(doc.service_document_id ?? 0, doc.upl?.id, step.id);
                    }}
                    hasAccess={true}
                    onOpenSigners={() => {
                      store.ecpListOpen = true;
                      store.loadGetSignByFileId(doc.upl?.file_id)
                    }}
                    onOpenFileHistory={() => {
                      store.isOpenFileHistory = true;
                      store.loadGetUploaded_application_documentsByApplicationIdAndStepId(doc.upl?.application_document_id, doc.upl?.app_step_id)
                    }}
                    onDocumentPreview={() => {
                      store.OpenFileFile(doc.upl?.file_id, doc.upl?.file_name)
                    }}
                    onAddSigner={() => {
                      store.currentStepId = step.id
                      documentFormsStore.openSignerDialog(doc.document_type_id)
                    }}
                    step_id={step.id}
                    step={step}
                    t={t}
                    documentApprovers={store.documentApprovers}
                    onDeleteFile={(reason: string) => {
                      if (!doc.upl?.id) return;
                      store.handleDeleteUploadedDocument(doc.upl.id, reason);
                    }}
                  />
                ))}

                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Для запроса подписания других документов на текущем этапе нажмите здесь
                  <IconButton
                    disabled={!store.hasAccess || step?.status !== "in_progress"}
                    onClick={() => {
                      store.currentStepId = step.id
                      documentFormsStore.openDocumentDialog(service_id)
                    }}
                  >
                    <Add />
                  </IconButton>
                </Typography>
              </Box>
            </Box>

            {step.requiredCalcs?.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  {t("label:application_taskAddEditView.mandatory_calculations_title")}
                </Typography>
                {step.requiredCalcs.map(calc => (
                  <Box
                    key={calc.id}
                    sx={{
                      backgroundColor: "#fff3cd",
                      border: "1px solid #ffeeba",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "space-between"
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <WarningAmberIcon color="error" fontSize="small" />
                      <Typography variant="body2">
                        {`${calc.structure_name} — ${t("label:application_taskAddEditView.calculation_required")}`}
                      </Typography>
                    </Box>
                    {accessPaymentDialog && (LayoutStore.my_structures?.find(x => x.structure_id == calc.structure_id) != null) && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { onPaymentDialogOpen() }}
                      >
                        {t("add")}
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* ВЛОЖЕННЫЕ ГРУППЫ ШАГОВ - ОТОБРАЖАЮТСЯ ЗДЕСЬ ВНУТРИ АККОРДЕОНА */}
            {/* ВЛОЖЕННЫЕ ГРУППЫ ШАГОВ - ОТОБРАЖАЮТСЯ ЗДЕСЬ ВНУТРИ АККОРДЕОНА */}
            {nestedGroups.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Добавленные услуги
                </Typography>
                {nestedGroups.map((group) => (
                  <NestedStepGroup
                    key={`group-${group.linkId}`}
                    group={group}
                    parentStepNumber={step.order_number}
                    renderStep={(nestedStep, stepNumber) => renderSingleStep(nestedStep, stepNumber, true)}
                    onCancelGroup={handleCancelNestedGroup}
                    servicename={
                      (store.application_additional_service ?? [])
                        .find(x => x.status === "active" && x.id === group.linkId)
                        ?.service_name ?? "Дополнительная услуга"
                    }
                  />
                ))}
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  // ДОБАВИТЬ в компонент, после других обработчиков:

  const handleCancelNestedStep = async (stepId: number) => {
    // Найти шаг
    const step = store.data.find(s => s.id === stepId);

    if (!step) {
      MainStore.setSnackbar("Шаг не найден", "error");
      return;
    }

    // Показать диалог подтверждения
    MainStore.openErrorConfirm(
      `Вы уверены, что хотите отменить вложенный шаг "${step.step_name || step.name}"?`,
      "Да, отменить",
      "Нет",
      async () => {
        try {
          MainStore.changeLoader(true);

          // Вызвать API для отмены шага
          // TODO: Заменить на реальный API endpoint когда он будет готов
          // await cancelNestedStep(stepId);

          // Временная заглушка - пока API нет, просто показываем сообщение
          console.log('Отмена вложенного шага:', stepId);

          // Обновить данные
          await store.loadApplication(store.application_id || 0);

          MainStore.setSnackbar(`Вложенный шаг отменен`, "success");
        } catch (err) {
          MainStore.setSnackbar("Ошибка при отмене шага", "error");
        } finally {
          MainStore.changeLoader(false);
          MainStore.onCloseConfirm();
        }
      },
      () => {
        MainStore.onCloseConfirm();
      }
    );
  };

  const handleAddService = (stepId: number) => {
    const currentStep = store.data.find(s => s.id === stepId);
    if (currentStep) {
      AddServiceDialogStore.openDialog(
        currentStep.application_id,
        currentStep.id,
        currentStep.order_number
      );
    }
  };

  // Обработчик отмены всей группы вложенных шагов
  const handleCancelNestedGroup = async (groupLinkId: number) => {
    // Найти группу
    const allGroups: any[] = [];
    groupsByParentId.forEach(groups => allGroups.push(...groups));
    const group = allGroups.find(g => g.linkId === groupLinkId);

    if (!group) {
      MainStore.setSnackbar("Группа не найдена", "error");
      return;
    }

    store.openCancelServiceDialog(groupLinkId);

    // Показать диалог подтверждения
    // MainStore.openErrorConfirm(
    //   `Вы уверены, что хотите отменить всю группу "${group.serviceName}"?\n\nБудут отменены все ${group.steps.length} шагов этой услуги.`,
    //   "Да, отменить",
    //   "Нет",
    //   async () => {
    //     try {
    //       MainStore.changeLoader(true);

    //       // TODO: Вызвать API для отмены всей группы когда он будет готов
    //       // await cancelNestedGroup(groupLinkId);

    //       // Или отменить все шаги группы по отдельности
    //       // for (const step of group.steps) {
    //       //   await cancelNestedStep(step.id);
    //       // }

    //       // Временная заглушка
    //       console.log('Отмена группы вложенных шагов:', groupLinkId, group.serviceName);

    //       // Обновить данные
    //       await store.loadApplication(store.application_id || 0);

    //       MainStore.setSnackbar(`Группа "${group.serviceName}" отменена`, "success");
    //     } catch (err) {
    //       MainStore.setSnackbar("Ошибка при отмене группы", "error");
    //     } finally {
    //       MainStore.changeLoader(false);
    //       MainStore.onCloseConfirm();
    //     }
    //   },
    //   () => {
    //     MainStore.onCloseConfirm();
    //   }
    // );
  };

  if (store.loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  const { regularSteps, groupsByParentId } = groupStepsByNested(store.data || []);


  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', p: 3 }}>
      {/* Application Header */}
      {store.application && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              {store.application.number}:
              {/* {store.application.title} */}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Статус: <strong>{store.application.status}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Срок выполнения: <strong>{store.formatDate(store.application.deadline)}</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Steps List */}
      <Stack spacing={2}>

        {regularSteps.map((step) => (
          <div key={step.id} id={`step-${step.id}`}>
            {renderSingleStep(step)}
          </div>
        ))}
        {/* Диалоги */}
        <AddDocumentDialog stepId={store.currentStepId} onSuccess={() => store.loadApplication(store.application_id)} />
        <AddSignerDialog stepId={store.currentStepId} onSuccess={() => store.loadApplication(store.application_id)} />

      </Stack>

      {/* Children (action buttons) */}
      {children}

      <UploadDocumentModal
        onUpload={() => {
          store.loadApplication(store.application_id)
        }}
      />

      <FileViewer
        isOpen={workDocumentStore.isOpenFileView}
        onClose={() => { workDocumentStore.isOpenFileView = false }}
        fileUrl={workDocumentStore.fileUrl}
        fileType={workDocumentStore.fileType} />

      {/* Pause Dialog */}
      <Dialog
        open={store.pauseDialogOpen}
        onClose={() => store.closePauseDialog()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Приостановка этапа</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Укажите причину приостановки:
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Причина приостановки..."
            value={store.pauseReason}
            onChange={(e) => store.setPauseReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.closePauseDialog()} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={() => store.executePauseStep()}
            color="info"
            variant="contained"
            disabled={!store.pauseReason.trim()}
          >
            Приостановить
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={store.returnDialogOpen}
        onClose={() => store.closeReturnDialog()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Возврат этапа на доработку</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Укажите обоснование возврата:
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Обоснование возврата..."
            value={store.returnReason}
            onChange={(e) => store.setReturnReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.closeReturnDialog()} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={() => store.executeReturnStep()}
            color="warning"
            variant="contained"
            disabled={!store.returnReason.trim()}
          >
            Вернуть
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={store.historyDialogOpen}
        onClose={() => store.closeHistoryDialog()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>История изменения статусов</DialogTitle>
        <DialogContent>
          {store.currentStepForHistory && (
            <StepStatusHistoryGrid stepId={store.currentStepForHistory} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.closeHistoryDialog()} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
      <AddServiceDialog />
      <Dialog
        open={store.cancelServiceDialogOpen}
        onClose={() => store.closeCancelServiceDialog()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Отмена дополнительной услуги</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите отменить дополнительную услугу?
            <br />
            <br />
            Все добавленные шаги будут удалены из заявки.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => store.closeCancelServiceDialog()}
            color="inherit"
          >
            Нет
          </Button>
          <Button
            onClick={() => store.confirmCancelAdditionalService()}
            color="error"
            variant="contained"
          >
            Да, отменить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});



export default ApplicationStepsBaseView;