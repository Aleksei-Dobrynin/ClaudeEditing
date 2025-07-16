import { FC, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import store from './store'
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import HistoryIcon from "@mui/icons-material/History";

type DocumentCardProps = {
  document: any;
  t: any;
  step_id: number;
  step?: any;
  hasAccess: boolean;
  onOpenFileHistory: (step: number) => void;
}

export const WorkDocumentCard: FC<DocumentCardProps> = observer(({
  document,
  step_id,
  step,
  hasAccess,
  onOpenFileHistory
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const formatDate = (date: any) => {
    if (!date) return '';
    return dayjs(date).format('DD.MM.YYYY');
  };

  const hasFile = !!document.file_id;
  const canEdit = hasAccess && step?.status === "in_progress";

  const getFileExtension = (fileName: string) => {
    if (!fileName) return '';
    const parts = fileName.split('.');
    return parts[parts.length - 1].toUpperCase();
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      hasFile={hasFile}
    >
      <MainContent>
        <LeftSection>
          <IconWrapper hasFile={hasFile}>
            {hasFile ? <InsertDriveFileIcon /> : <ErrorOutlineIcon />}
          </IconWrapper>

          <ContentInfo>
            <TopRow>
              <DocumentTitle>{document.id_type_name || 'Документ'}</DocumentTitle>
              <StatusChip
                label={hasFile ? "Загружен" : "Не загружен"}
                size="small"
                color={hasFile ? "success" : "info"}
                variant={hasFile ? "filled" : "outlined"}
              />
            </TopRow>

            <BottomRow>
              {hasFile ? (
                <>
                  <FileName>{document.file_name}</FileName>
                  {document.created_at && (
                    <DateText>• {formatDate(document.created_at)}</DateText>
                  )}
                </>
              ) : document.is_required && (
                <NoFileText>
                  <Tooltip title={"Обязательный документ"}>
                    <WarningAmberIcon color="error" fontSize="small" />
                  </Tooltip>
                  Требуется загрузка файла
                </NoFileText>
              )}
            </BottomRow>
          </ContentInfo>
        </LeftSection>

        <ActionsSection show={isHovered || !hasFile}>
          {!hasFile ? (
            <UploadButton
              disabled={!canEdit}
              onClick={() => store.onEditClicked(document.id)}
            >
              <FileUploadIcon />
              Загрузить
            </UploadButton>
          ) : (
            <>
              <Tooltip title="Просмотреть">
                <IconButton
                  size="small"
                  disabled={!store.checkFile(document.file_name)}
                  onClick={() => store.OpenFileFile(document.file_id, document.file_name)}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Скачать">
                <IconButton
                  size="small"
                  onClick={() => store.downloadFile(document.file_id, document.file_name)}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Заменить">
                <IconButton
                  size="small"
                  disabled={!canEdit}
                  onClick={() => store.onEditClicked(document.id)}
                >
                  <SwapHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {hasFile && <Tooltip title={i18n.t("label:UploadedApplicationDocumentListView.document_download_history")}>
                <IconButton size="small" onClick={() => {
                  onOpenFileHistory(document.app_step_id)
                }}>
                  <HistoryIcon />
                </IconButton>
              </Tooltip>}
              <Divider />

            </>
          )}
        </ActionsSection>
      </MainContent>


    </Card>
  );
});

const Card = styled.div<{ hasFile: boolean }>`
  background: ${props => props.hasFile ? '#ffffff' : '#fffbf7'};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 1px solid ${props => props.hasFile ? '#e5e7eb' : '#fed7aa'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: ${props => props.hasFile ? '#d1d5db' : '#fdba74'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.hasFile ? '#10b981' : '#f97316'};
    border-radius: 12px 0 0 12px;
  }
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const IconWrapper = styled.div<{ hasFile: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.hasFile ? '#f0fdf4' : '#fff7ed'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.hasFile ? '#10b981' : '#f97316'};
  flex-shrink: 0;

  svg {
    font-size: 20px;
  }
`;

const ContentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const DocumentTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusChip = styled(Chip)`
  && {
    height: 20px;
    font-size: 11px;
    font-weight: 500;
    
    .MuiChip-label {
      padding: 0 8px;
    }
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`;

const FileName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
`;

const DateText = styled.span`
  color: #9ca3af;
  white-space: nowrap;
`;

const NoFileText = styled.div`
  color: #ef4444;
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const ActionsSection = styled.div<{ show: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s ease;

  .MuiIconButton-root {
    padding: 6px;
    background: rgba(0, 0, 0, 0.04);
    
    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    &:disabled {
      opacity: 0.4;
    }
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 16px;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 4px;
`;

export default WorkDocumentCard;