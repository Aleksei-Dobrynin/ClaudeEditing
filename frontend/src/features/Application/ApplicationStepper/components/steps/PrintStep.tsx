import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  alpha,
  styled,
  Fade,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Alert,
  AlertTitle,
  LinearProgress,
  CircularProgress
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import mainStore from "../../../../../MainStore";
import { SelectOrgStructureForWorklofw } from "constants/constant";
import Saved_application_documentListView from "../../../../saved_application_document/saved_application_documentListView";
import { rootStore } from "../../stores/RootStore";
import dayjs from "dayjs";
import {
  Print,
  Description,
  Check,
  Security,
  GetApp,
  Visibility,
  CheckCircle,
  PictureAsPdf,
  Assignment,
  Warning,
  Info
} from "@mui/icons-material";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  marginBottom: theme.spacing(3),
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

const PreviewSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  marginBottom: theme.spacing(3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
  fontWeight: 500,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  }
}));

const DocumentItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.main,
  }
}));

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");
  const { t } = useTranslation();
  const translate = t;
  const theme = useTheme();
  
  const [documentsReady, setDocumentsReady] = useState(false);
  const [signatureInProgress, setSignatureInProgress] = useState(false);
  const [completionStatus, setCompletionStatus] = useState({
    documentsGenerated: false,
    dataSaved: false,
    readyToSign: false,
    signatureCompleted: false,
    progress: 0
  });

  useEffect(() => {
    if (store.customer_id) {
      store.loadCustomerContacts(store.customer_id);
    }
  }, [store.customer_id]);
  
  useEffect(() => {
    store.is_application_read_only = !((mainStore.isAdmin || mainStore.isRegistrar) && 
      store.Statuses?.find(s => s.id === store.status_id)?.code !== "done");
  }, [mainStore.isRegistrar, mainStore.isAdmin, store.status_id]);

  // Проверка готовности документов и обновление статуса
  useEffect(() => {
    const checkApplicationCompleteness = () => {
      let progress = 0;
      const status = { ...completionStatus };

      // Проверяем что заявка создана и данные сохранены
      if (rootStore.applicationId > 0) {
        status.dataSaved = true;
        progress += 25;
      }

      // Проверяем готовность документов (симуляция)
      if (status.dataSaved) {
        status.documentsGenerated = true;
        progress += 25;
      }

      // Проверяем готовность к подписанию
      if (status.documentsGenerated && rootStore.service_id > 0) {
        status.readyToSign = true;
        progress += 25;
      }

      // Проверяем статус подписи
      if (rootStore.isDigitallySigned) {
        status.signatureCompleted = true;
        progress += 25;
      }

      status.progress = progress;
      setCompletionStatus(status);
      setDocumentsReady(status.readyToSign);
      
      // Обновляем прогресс в rootStore
      rootStore.updateStepProgress(3, progress);
    };

    checkApplicationCompleteness();
  }, [rootStore.applicationId, rootStore.service_id, rootStore.isDigitallySigned]);

  // Mock data for preview with safe access
  const applicationData = {
    service: store.Services?.find(s => s.id === store.service_id)?.name || "Не указано",
    customer: store.customer?.full_name || 
      (store.customer ? `${store.customer.individual_surname || ""} ${store.customer.individual_name || ""}`.trim() : "Не указано"),
    workDescription: store.work_description || "Не указано",
    status: store.Statuses?.find(s => s.id === store.status_id)?.name || "В обработке",
    applicationNumber: store.id ? `№ ${store.id}` : "Черновик",
    deadline: store.deadline ? dayjs(store.deadline).format('DD.MM.YYYY') : "Не установлен"
  };

  const handleDigitalSign = async () => {
    if (!documentsReady) {
      rootStore.showSnackbar("Документы еще не готовы к подписанию", "warning");
      return;
    }

    setSignatureInProgress(true);
    
    try {
      // Симуляция процесса подписания
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Устанавливаем подпись через rootStore
      rootStore.setDigitalSignature(true);
      
      rootStore.showSnackbar("Документы успешно подписаны", "success");
    } catch (error) {
      rootStore.showSnackbar("Ошибка при подписании документов", "error");
    } finally {
      setSignatureInProgress(false);
    }
  };

  const handleDownloadAll = () => {
    if (!documentsReady) {
      rootStore.showSnackbar("Документы еще не готовы к скачиванию", "warning");
      return;
    }
    
    // Реализация скачивания всех документов
    console.log('Download all documents');
    rootStore.showSnackbar("Скачивание документов начато", "info");
  };

  const handlePreview = () => {
    if (!documentsReady) {
      rootStore.showSnackbar("Документы еще не готовы к просмотру", "warning");
      return;
    }
    
    window.print();
  };

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Application Status Overview */}
        <Alert 
          severity={completionStatus.signatureCompleted ? "success" : completionStatus.readyToSign ? "warning" : "info"}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          <AlertTitle>
            {completionStatus.signatureCompleted 
              ? "✓ Заявка готова к завершению" 
              : completionStatus.readyToSign 
                ? "⚠️ Требуется цифровая подпись" 
                : "⏳ Подготовка заявки..."}
          </AlertTitle>
          <Box mt={1}>
            <Typography variant="body2" gutterBottom>
              {completionStatus.signatureCompleted 
                ? "Все этапы завершены. Заявка готова к отправке."
                : completionStatus.readyToSign 
                  ? "Документы готовы. Необходимо поставить цифровую подпись."
                  : "Идет подготовка документов для подписания..."}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Typography variant="body2" color="text.secondary">
                Готовность заявки:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completionStatus.progress}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
              <Typography variant="body2" fontWeight={600}>
                {completionStatus.progress}%
              </Typography>
            </Box>
          </Box>
        </Alert>

        {/* Application Summary */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <Visibility />
              Сводка по заявлению {applicationData.applicationNumber}
            </SectionTitle>

            <PreviewSection elevation={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {translate("label:ApplicationAddEditView.service_id")}
                  </Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    {applicationData.service}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {translate("label:ApplicationAddEditView.customer_id")}
                  </Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    {applicationData.customer}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Срок исполнения
                  </Typography>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    {applicationData.deadline}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {translate("label:ApplicationAddEditView.Status")}
                  </Typography>
                  <Chip 
                    label={applicationData.status}
                    color="primary"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {translate("label:ApplicationAddEditView.work_description")}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {applicationData.workDescription}
                  </Typography>
                </Grid>
              </Grid>
            </PreviewSection>
          </CardContent>
        </StyledCard>

        {/* Documents for Print/Sign Section */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <PictureAsPdf />
              {translate("label:ApplicationAddEditView.TabName_saved_document")}
            </SectionTitle>

            <Box>
              <Saved_application_documentListView 
                idMain={Number(id)} 
                templateCodeFilter={["statement", "confirm"]} 
              />
            </Box>
          </CardContent>
        </StyledCard>

        {/* Digital Signature Section */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <Security />
              {translate("common:digital_signature")}
            </SectionTitle>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {translate("label:ApplicationAddEditView.only_electronic")}
            </Typography>

            {/* Signature Status */}
            {rootStore.isDigitallySigned && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <CheckCircle />
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      Документы подписаны цифровой подписью
                    </Typography>
                    <Typography variant="body2">
                      Дата подписания: {rootStore.digitalSignatureDate?.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Alert>
            )}

            <Box display="flex" gap={2} flexWrap="wrap">
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={signatureInProgress ? <CircularProgress size={16} /> : <Security />}
                onClick={handleDigitalSign}
                disabled={!documentsReady || signatureInProgress || rootStore.isDigitallySigned}
                size="large"
              >
                {signatureInProgress 
                  ? "Подписание..." 
                  : rootStore.isDigitallySigned 
                    ? "Документы подписаны" 
                    : documentsReady 
                      ? "Подписать документы" 
                      : "Ожидание готовности..."}
              </ActionButton>

              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<GetApp />}
                onClick={handleDownloadAll}
                disabled={!documentsReady}
                size="large"
              >
                Скачать все документы
              </ActionButton>

              <ActionButton
                variant="text"
                color="primary"
                startIcon={<Visibility />}
                onClick={handlePreview}
                disabled={!documentsReady}
                size="large"
              >
                Предварительный просмотр
              </ActionButton>
            </Box>

            {/* Status Messages */}
            {!documentsReady && !completionStatus.readyToSign && (
              <Alert severity="info" sx={{ mt: 3, borderRadius: 1.5 }}>
                <Typography variant="body2">
                  ⏳ Формирование документов... Пожалуйста, подождите.
                </Typography>
              </Alert>
            )}

            {documentsReady && !rootStore.isDigitallySigned && (
              <Alert severity="warning" sx={{ mt: 3, borderRadius: 1.5 }}>
                <Typography variant="body2">
                  ⚠️ Документы готовы к подписанию. Используйте свою электронную подпись для завершения процесса.
                </Typography>
              </Alert>
            )}

            {rootStore.isDigitallySigned && (
              <Alert severity="success" sx={{ mt: 3, borderRadius: 1.5 }}>
                <Typography variant="body2">
                  ✅ Заявка готова к отправке. Нажмите "Завершить" для финализации процесса.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </StyledCard>

        {/* Completion Checklist */}
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h6">
              <Assignment />
              Контрольный список
            </SectionTitle>

            <List>
              <ListItem>
                <ListItemIcon>
                  {completionStatus.dataSaved ? <CheckCircle color="success" /> : <Info color="info" />}
                </ListItemIcon>
                <ListItemText 
                  primary="Данные заявки сохранены"
                  secondary={completionStatus.dataSaved ? "Завершено" : "В процессе"}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  {completionStatus.documentsGenerated ? <CheckCircle color="success" /> : <Info color="info" />}
                </ListItemIcon>
                <ListItemText 
                  primary="Документы сформированы"
                  secondary={completionStatus.documentsGenerated ? "Завершено" : "В процессе"}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  {completionStatus.readyToSign ? <CheckCircle color="success" /> : <Warning color="warning" />}
                </ListItemIcon>
                <ListItemText 
                  primary="Готовность к подписанию"
                  secondary={completionStatus.readyToSign ? "Готово" : "Ожидание"}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  {completionStatus.signatureCompleted ? <CheckCircle color="success" /> : <Warning color="warning" />}
                </ListItemIcon>
                <ListItemText 
                  primary="Цифровая подпись"
                  secondary={completionStatus.signatureCompleted ? "Подписано" : "Требуется подпись"}
                />
              </ListItem>
            </List>
          </CardContent>
        </StyledCard>
      </Box>
    </Fade>
  );
});

export default BaseView;