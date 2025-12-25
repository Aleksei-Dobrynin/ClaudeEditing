// Путь: frontend/src/features/UploadedApplicationDocument/uploaded_application_documentListView/cards.tsx

import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import store from './store';
import {
  Alert,
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton,
  Tooltip
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import i18n from "i18next";
import TextField from "@mui/material/TextField";

import { groupApprovalsByOrder } from '../utils/approvalHelpers';
import ApprovalGroupCard from './ApprovalGroupCard';

type DocumentCardProps = {
  document: any, t: any,
  documentApprovers?: any,
  onSigned: () => void,
  step_id: number,
  onUploadFile: () => void;
  step?: any,
  onDocumentPreview: () => void;
  onOpenSigners: () => void;
  onOpenFileHistory: () => void;
  onAddSigner: () => void,
  hasAccess: boolean,
  onDeleteFile: (reason: string) => void;
}

export const DocumentCard: FC<DocumentCardProps> = ({ 
  document, 
  t, 
  onDocumentPreview, 
  onOpenSigners, 
  onOpenFileHistory, 
  onSigned, 
  onUploadFile, 
  step_id, 
  step, 
  onAddSigner, 
  hasAccess, 
  onDeleteFile 
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  
  const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('DD.MM.YYYY');
  };

  const getFileInfo = () => {
    const extension = document.document_type_name || '';

    if (!document.upl) return <><span style={{ color: "red" }}>Файл не загружен</span></>;

    return <><span style={{ color: "green" }}>Файл загружен</span> • {document.upl?.file_name}</>;
  };

  const shouldShowUploadTooltip = !hasAccess && document.upl?.file_id;
  const uploadTooltipTitle = shouldShowUploadTooltip 
    ? "только начальник и админ могут заменить документ" 
    : document.upl?.id ? "Заменить файл" : "Загрузить файл";

  // КРИТИЧЕСКАЯ ОТЛАДКА
  console.log('=== DocumentCard DEBUG ===');
  console.log('Document:', document.document_type_name);
  console.log('document.approvals RAW:', document.approvals);
  console.log('Has approvals?', document.approvals && document.approvals.length > 0);
  
  if (document.approvals && document.approvals.length > 0) {
    console.log('First approval:', document.approvals[0]);
    console.log('First approval assigned_approvers:', document.approvals[0].assigned_approvers);
    
    const grouped = groupApprovalsByOrder(document.approvals);
    console.log('Grouped approvals:', grouped);
    grouped.forEach((group, idx) => {
      console.log(`Group ${idx + 1}:`, {
        displayNumber: group.displayNumber,
        order_number: group.order_number,
        approvals_count: group.approvals.length
      });
      group.approvals.forEach((approval, aIdx) => {
        console.log(`  Approval ${aIdx}:`, {
          id: approval.id,
          department: approval.department_name,
          assigned_approvers: approval.assigned_approvers,
          assigned_count: approval.assigned_approvers?.length || 0
        });
      });
    });
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            {document.is_required && (
              <Tooltip title={t("mandatory_documents")}>
                <WarningAmberIcon color="error" fontSize="small" />
              </Tooltip>)}
            <DocumentTitle>{document.document_type_name}</DocumentTitle>
          </Box>
          <FileInfo>{getFileInfo()}</FileInfo>

          {document.upl?.created_at && <InfoRow>
            <Label>Загружен:</Label>
            <Value />
            <DateValue>{formatDate(document.upl?.created_at)}</DateValue>
          </InfoRow>}

          {/* СЕКЦИЯ СОГЛАСОВАНИЙ */}
          {document.approvals && document.approvals.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <Label style={{ 
                marginBottom: '12px', 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600,
                color: '#333'
              }}>
                Очередь согласования:
              </Label>
              
              {groupApprovalsByOrder(document.approvals).map((group) => {
                console.log('Rendering group:', group.displayNumber, group);
                return (
                  <ApprovalGroupCard
                    key={`group-${group.order_number}`}
                    displayNumber={group.displayNumber}
                    approvals={group.approvals}
                    t={t}
                  />
                );
              })}
            </div>
          )}

        </div>
      </div>

      <ActionsRow>
        <ActionsLeft>

          <MoreActionsWrapper>

            {(document.upl?.file_id && store.checkFile(document.upl?.file_name)) && <Tooltip title={"Просмотр"}>
              <IconButton size="small" onClick={() => {
                onDocumentPreview()
                setShowMoreMenu(false);
              }}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>}

            <Tooltip title={uploadTooltipTitle}>
              <span>
                <IconButton 
                  disabled={!hasAccess || step?.status !== "in_progress"} 
                  size="small" 
                  onClick={() => {
                    onUploadFile()
                    setShowMoreMenu(false);
                  }}
                >
                  <FileUploadIcon />
                </IconButton>
              </span>
            </Tooltip>
            {document.upl?.file_id && (
              <Tooltip title="Удалить файл">
                <span>
                  <IconButton
                    size="small"
                    disabled={!hasAccess || step?.status !== "in_progress"}
                    onClick={() => {
                      setDeleteOpen(true);
                      setDeleteReason('');
                      setShowMoreMenu(false);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {document.upl?.file_id && <Tooltip title="Скачать файл">
              <IconButton size="small" onClick={() => {
                store.downloadFile(document.upl?.file_id, document.upl?.file_name);
                setShowMoreMenu(false);
              }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>}

            <Tooltip title="Добавить подписанта">
              <IconButton disabled={!hasAccess || step?.status !== "in_progress"} size="small" onClick={() => {
                onAddSigner();
                setShowMoreMenu(false);
              }}>
                <AddIcon />
              </IconButton>
            </Tooltip>

            {document.upl?.file_id && <Tooltip title="Список подписавших">
              <IconButton size="small" onClick={() => {
                onOpenSigners()
              }}>
                <FormatListBulletedIcon />
              </IconButton>
            </Tooltip>}

            {document.upl?.file_id && <Tooltip title={i18n.t("label:UploadedApplicationDocumentListView.document_download_history")}>
              <IconButton size="small" onClick={() => {
                onOpenFileHistory()
              }}>
                <HistoryIcon />
              </IconButton>
            </Tooltip>}

          </MoreActionsWrapper>
        </ActionsLeft>

        <PrimaryButton
          onClick={() => store.signApplicationPayment(document.upl?.file_id, document.upl?.id, () => {
            onSigned()
          })}
        >
          Подписать ЭЦП
        </PrimaryButton>
      </ActionsRow>
      
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Удаление файла</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Alert severity="error" sx={{ fontWeight: "bold" }}>
            ⚠ ВНИМАНИЕ! <br />
            Все подписи по данному файлу будут удалены. <br />
            Документ потребуется загрузить и подписать заново.
          </Alert>

          <TextField
            label="Причина удаления"
            multiline
            minRows={3}
            required
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>
            Отмена
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={!deleteReason.trim()}
            onClick={() => {
              onDeleteFile(deleteReason);
              setDeleteOpen(false);
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};


const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DocumentTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const FileInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const Label = styled.span`
  min-width: 120px;
  color: #999;
`;

const Value = styled.span`
  flex: 1;
  color: #333;
`;

const DateValue = styled.span`
  text-align: right;
  color: #999;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const ActionsLeft = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const PrimaryButton = styled.button`
  background-color: #0066cc;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0052a3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const MoreActionsWrapper = styled.div`
  position: relative;
`;