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
  Autocomplete,
  AlertTitle,
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
  Add,
  AddCircleOutline as AddCircleOutlineIcon,
  CancelOutlined as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import store from './store';
import workDocumentStore from './WorkDocument/store';
import { useTranslation } from 'react-i18next';
import { DocumentCard } from 'features/UploadedApplicationDocument/uploaded_application_documentListView/cards';
import { WorkDocumentCard } from './WorkDocument/WorkDocumentCard';
import MainStore from 'MainStore';
import AddDocumentDialog from './AddDocument/AddDocumentDialog';
import AddSignerDialog from './AddDocument/AddSignerDialog';
import documentFormsStore from './AddDocument/documentFormsStore';
import FileViewer from "components/FileViewer";
import UploadDocumentModal from './WorkDocument/UploadDocumentModal';
import taskStore from './../store'
import LayoutStore from 'layouts/MainLayout/store'
import { APPLICATION_STATUSES } from 'constants/constant';
import { useNavigate } from 'react-router-dom';
import StepStatusHistoryGrid from './StepStatusHistoryGrid';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutocompleteCustom from 'components/Autocomplete';
import CustomTextField from 'components/TextField';

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
      if (foundStep) {
        store.expandedStepId = foundStep.id;
        setTimeout(() => {
          const el = document.getElementById(`step-${stepId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [store.expandedStepId, store.data]);

  const hasAccessToStepStatuses = (structureId: number) => {
    let str_ids = taskStore.OrgStructures.filter(x => x.parent_id === structureId).map(x => x.id)
    str_ids.push(structureId);
    let str_ids2 = taskStore.OrgStructures.filter(x => str_ids.includes(x.parent_id)).map(x => x.id)
    str_ids.push(str_ids2)

    return (
      taskStore.Application.status_code === APPLICATION_STATUSES.preparation
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
            label={"Ожидает"}
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
        return null;
    }
  };

  const [expandedPanel, setExpandedPanel] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {store.data.map((step, index) => {
          // Получаем информацию о динамическом шаге
          const dynamicInfo = store.getDynamicStepInfo(step.id);

          return (
            <div key={step.id} id={`step-${step.id}`}>
              <Accordion
                expanded={expandedPanel === `panel${step.id}`}
                onChange={handleChange(`panel${step.id}`)}
                sx={{
                  // Визуальное выделение динамических шагов
                  ...(dynamicInfo.isDynamic && {
                    borderLeft: '4px solid #2196f3',
                    bgcolor: '#f5f9ff',
                  })
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel${step.id}-content`}
                  id={`panel${step.id}-header`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {step.order_number}. {step.name}
                    </Typography>
                    {renderStatusChip(step.status)}
                    {dynamicInfo.isDynamic && (
                      <Chip
                        icon={<InfoIcon />}
                        label="Доп. услуга"
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    
                    {/* НОВОЕ: Индикатор динамического шага */}
                    {dynamicInfo.isDynamic && (
                      <Alert 
                        severity="info" 
                        icon={<InfoIcon />}
                        sx={{ bgcolor: '#e3f2fd' }}
                      >
                        <AlertTitle>Динамически добавленный шаг</AlertTitle>
                        <Typography variant="body2">
                          <strong>Из услуги:</strong> {dynamicInfo.serviceName} ({dynamicInfo.servicePathName})
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Обоснование:</strong> {dynamicInfo.addReason}
                        </Typography>
                        {store.hasAccess && dynamicInfo.canCancel && (
                          <Button
                            size="small"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => store.cancelAddedService(dynamicInfo.linkId!)}
                            sx={{ mt: 1 }}
                          >
                            Отменить добавление услуги
                          </Button>
                        )}
                      </Alert>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mr: 2 }}>
                      {step.status === "in_progress" && store.canCompleteStep(step.step_id) && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={!hasAccessToStepStatuses(step.responsible_department_id)}
                          startIcon={<Check />}
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
                            store.showReturnDialog(step.id);
                          }}
                        >
                          Вернуть
                        </Button>
                      )}

                      {step.status === "waiting" && store.canStartStep(step.step_id) && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!hasAccessToStepStatuses(step.responsible_department_id)}
                          startIcon={<PlayArrow />}
                          onClick={(e) => {
                            e.stopPropagation();
                            store.startStep(step.id, step.responsible_department_id);
                          }}
                        >
                          Запустить
                        </Button>
                      )}

                      {/* НОВОЕ: Кнопка добавления шагов из другой услуги */}
                      {step.status === "in_progress" && store.canAddStepsToStep(step.id) && (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          disabled={!store.hasAccess}
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            store.openAddStepsDialog(step.id);
                          }}
                          sx={{ mt: 1 }}
                        >
                          Добавить шаги из другой услуги
                        </Button>
                      )}

                      <Button
                        variant="text"
                        size="small"
                        startIcon={<History />}
                        onClick={(e) => {
                          e.stopPropagation();
                          store.showHistoryDialog(step.id);
                        }}
                      >
                        История
                      </Button>
                    </Box>

                    <Box>
                      {step.dependencies?.length > 0 ? (
                        <Box>
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
                                  icon={store.isStepCompleted(depStep?.step_id || 0) ?
                                    <Check /> : <Warning />}
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
                                  icon={blockedStep?.status === "waiting" ?
                                    <Schedule /> : <ArrowForward />}
                                  variant="outlined"
                                />
                              );
                            })}
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Work Documents */}
                    {step.workDocuments?.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Рабочие документы:
                        </Typography>
                        <Box>
                          {step.workDocuments?.map(doc => {
                            return (
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
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Documents for signing */}
                    <Box>
                      {step.documents?.length > 0 && (
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Документы на подпись
                        </Typography>
                      )}
                      <Box>
                        {step.documents?.map(doc => {
                          return (
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
                            />
                          );
                        })}

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

                    {/* Required calculations warning */}
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
                                onClick={() => { onPaymentDialogOpen && onPaymentDialogOpen() }}
                              >
                                {t("add")}
                              </Button>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
          )
        })}

        {/* Existing Dialogs */}
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
        fileType={workDocumentStore.fileType}
      />

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

      {/* Return Dialog */}
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

      {/* НОВЫЙ ДИАЛОГ: Добавление шагов из другой услуги */}
      <Dialog
        open={store.addStepsDialogOpen}
        onClose={() => store.closeAddStepsDialog()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавить шаги из другой услуги</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Выберите услугу, шаги которой необходимо добавить в текущую заявку.
            Шаги будут вставлены после текущего шага.
          </DialogContentText>

          {/* Выбор услуги */}
          <Box sx={{ mb: 2 }}>
            <AutocompleteCustom
              data={store.availableServicePaths}
              value={store.selectedServicePath?.id || 0}
              onChange={(e) => {
                const selected = store.availableServicePaths.find(sp => sp.id === e.target.value);
                store.setSelectedServicePath(selected || null);
              }}
              fieldNameDisplay={(option) => `${option.service_name} - ${option.name}`}
              label="Услуга"
              name="service_path_id"
              id="id_f_service_path_id"
              helperText=""
              error={false}
            />
          </Box>

          {/* Информация о выбранной услуге */}
          {store.selectedServicePath && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Будет добавлено шагов: {store.selectedServicePath.steps_count || 0}</AlertTitle>
              {store.selectedServicePath.description && (
                <Typography variant="body2">
                  {store.selectedServicePath.description}
                </Typography>
              )}
            </Alert>
          )}

          {/* Обоснование */}
          <CustomTextField
            value={store.addStepsReason}
            onChange={(e) => store.setAddStepsReason(e.target.value)}
            name="add_steps_reason"
            id="id_f_add_steps_reason"
            label="Обоснование добавления (обязательно)"
            helperText="Объясните, почему необходимо добавить эти шаги в заявку"
            error={false}
            multiline
            rows={4}
          />

          {/* Предупреждение о лимите */}
          {store.additionalServices.filter(s =>
            s.status === 'active' || s.status === 'pending'
          ).length >= 2 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                У вас уже есть {store.additionalServices.filter(s =>
                  s.status === 'active' || s.status === 'pending'
                ).length} активных добавлений. Максимум разрешено 3.
              </Alert>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.closeAddStepsDialog()} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={() => store.addStepsFromService()}
            variant="contained"
            color="primary"
            disabled={!store.selectedServicePath || !store.addStepsReason.trim()}
          >
            Добавить шаги
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default ApplicationStepsBaseView;