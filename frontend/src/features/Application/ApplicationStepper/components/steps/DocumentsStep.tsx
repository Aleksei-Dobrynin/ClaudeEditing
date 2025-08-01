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
  Divider,
  alpha,
  styled,
  Fade,
  Chip,
  Alert,
  useTheme,
  CircularProgress,
  IconButton,
  Tooltip,
  LinearProgress
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "features/Application/ApplicationAddEditView/store";
import { observer } from "mobx-react";
import mainStore from "../../../../../MainStore";
import Uploaded_application_documentListView from "../../../../UploadedApplicationDocument/uploaded_application_documentListView";
import Outgoing_Uploaded_application_documentListGridView from "../../../../UploadedApplicationDocument/uploaded_application_documentListView/index_outgoing_grid";
import ApplicationWorkDocumentListView from "../../../../ApplicationWorkDocument/ApplicationWorkDocumentListView";
import { rootStore } from "../../stores/RootStore";
import {
  CloudUpload,
  FileUpload,
  Description,
  Assignment,
  Folder,
  AttachFile,
  CheckCircle,
  Warning,
  InsertDriveFile
} from "@mui/icons-material";

// Styled components matching the first file's style
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

const DocumentSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
    background: theme.palette.primary.main,
  }
}));

const InfoAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
  backgroundColor: alpha(theme.palette.info.main, 0.04),
}));

const StatusAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  fontWeight: 500,
}));

const UploadZone = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const DocumentCounter = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.75rem",
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
  const [isLoading, setIsLoading] = useState(true);
  const [documentStats, setDocumentStats] = useState({
    incoming: 0,
    outgoing: 0,
    work: 0,
    total: 0,
    progress: 0
  });

  useEffect(() => {
    if (store.customer_id) {
      store.loadCustomerContacts(store.customer_id);
    }
    
    // Simulate loading state and document counting
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock document statistics - в реальном приложении эти данные должны браться из API
      const stats = {
        incoming: 3,
        outgoing: 2,
        work: 1,
        total: 6,
        progress: 75 // Процент завершенности работы с документами
      };
      setDocumentStats(stats);
      
      // Обновляем прогресс шага
      rootStore.updateStepProgress(2, stats.progress);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [store.customer_id]);

  // Определяем статус документооборота
  const getDocumentStatus = () => {
    if (documentStats.total === 0) {
      return {
        severity: "info" as const,
        message: "Документы не загружены",
        icon: <Warning />
      };
    } else if (documentStats.progress >= 100) {
      return {
        severity: "success" as const,
        message: "Все документы обработаны",
        icon: <CheckCircle />
      };
    } else if (documentStats.progress >= 50) {
      return {
        severity: "warning" as const,
        message: "Документы в процессе обработки",
        icon: <Warning />
      };
    } else {
      return {
        severity: "info" as const,
        message: "Требуется загрузка документов",
        icon: <InsertDriveFile />
      };
    }
  };

  const documentStatus = getDocumentStatus();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Main Title */}
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          {translate("label:ApplicationAddEditView.TabName_documents")}
        </Typography>

        {/* Status Alert with Progress */}
        <StatusAlert severity={documentStatus.severity} icon={documentStatus.icon}>
          <Box>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {documentStatus.message}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
              <Typography variant="body2" color="text.secondary">
                Прогресс обработки:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={documentStats.progress}
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
                {documentStats.progress}%
              </Typography>
            </Box>
          </Box>
        </StatusAlert>

        {/* Document Statistics */}
        <InfoAlert>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <Typography variant="body2" fontWeight={600}>
              Статистика документов:
            </Typography>
            <DocumentCounter
              label={`Входящие: ${documentStats.incoming}`}
              size="small"
              color="primary"
              icon={<FileUpload />}
            />
            <DocumentCounter
              label={`Исходящие: ${documentStats.outgoing}`}
              size="small"
              color="secondary"
              icon={<Assignment />}
            />
            <DocumentCounter
              label={`Рабочие: ${documentStats.work}`}
              size="small"
              color="success"
              icon={<Folder />}
            />
            <DocumentCounter
              label={`Всего: ${documentStats.total}`}
              size="small"
              color="default"
              icon={<InsertDriveFile />}
            />
          </Box>
        </InfoAlert>

        {/* Incoming Documents Section */}
        <StyledCard>
          <CardContent>
            <SectionHeader>
              <FileUpload />
              <SectionTitle variant="h6">
                Входящие документы
              </SectionTitle>
              <DocumentCounter
                label={`${documentStats.incoming} файлов`}
                size="small"
                color="primary"
                icon={<InsertDriveFile />}
              />
            </SectionHeader>
            <Divider sx={{ mb: 2 }} />

            <DocumentSection elevation={0}>
              <Uploaded_application_documentListView idMain={Number(id)} />
            </DocumentSection>
          </CardContent>
        </StyledCard>

        {/* Outgoing Documents Section */}
        <StyledCard>
          <CardContent>
            <SectionHeader>
              <Assignment />
              <SectionTitle variant="h6">
                Исходящие документы
              </SectionTitle>
              <DocumentCounter
                label={`${documentStats.outgoing} файлов`}
                size="small"
                color="secondary"
                icon={<Assignment />}
              />
            </SectionHeader>
            <Divider sx={{ mb: 2 }} />

            <DocumentSection elevation={0}>
              <Outgoing_Uploaded_application_documentListGridView idMain={Number(id)} />
            </DocumentSection>
          </CardContent>
        </StyledCard>

        {/* Work Documents Section */}
        <StyledCard>
          <CardContent>
            <SectionHeader>
              <Folder />
              <SectionTitle variant="h6">
                Рабочие документы
              </SectionTitle>
              <DocumentCounter
                label={`${documentStats.work} файлов`}
                size="small"
                color="success"
                icon={<Folder />}
              />
            </SectionHeader>
            <Divider sx={{ mb: 2 }} />

            <DocumentSection elevation={0}>
              <ApplicationWorkDocumentListView idApplication={Number(id)} />
            </DocumentSection>
          </CardContent>
        </StyledCard>

        {/* Upload Zone - показываем только если мало документов */}
        {documentStats.total < 3 && (
          <UploadZone>
            <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
              Перетащите файлы для загрузки
            </Typography>
            <Typography variant="body2" color="text.secondary">
              или нажмите для выбора файлов
            </Typography>
          </UploadZone>
        )}

        {/* Summary Card */}
        <StyledCard>
          <CardContent>
            <SectionHeader>
              {documentStats.progress >= 100 ? <CheckCircle color="success" /> : <Warning color="warning" />}
              <SectionTitle variant="h6">
                Сводка по документам
              </SectionTitle>
            </SectionHeader>
            <Divider sx={{ mb: 2 }} />
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                {documentStats.progress >= 100 ? (
                  <>
                    <CheckCircle color="success" />
                    <Typography color="success.main" fontWeight={600}>
                      Все необходимые документы загружены и обработаны
                    </Typography>
                  </>
                ) : documentStats.total > 0 ? (
                  <>
                    <Warning color="warning" />
                    <Typography color="warning.main" fontWeight={600}>
                      Документы загружены, но требуется дополнительная обработка
                    </Typography>
                  </>
                ) : (
                  <>
                    <Warning color="info" />
                    <Typography color="info.main" fontWeight={600}>
                      Рекомендуется загрузить необходимые документы
                    </Typography>
                  </>
                )}
              </Box>

              {documentStats.total > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Детализация:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    <Chip size="small" label={`Входящие: ${documentStats.incoming}`} />
                    <Chip size="small" label={`Исходящие: ${documentStats.outgoing}`} />
                    <Chip size="small" label={`Рабочие: ${documentStats.work}`} />
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>
        </StyledCard>
      </Box>
    </Fade>
  );
});

export default BaseView;