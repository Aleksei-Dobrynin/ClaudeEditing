import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import store from './store';
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import i18n from "i18next";

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
  userId?: number
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
  userId
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('DD.MM.YYYY');
  };

  const getFileInfo = () => {
    const extension = document.document_type_name || '';

    if (!document.upl) return <><span style={{ color: "red" }}>Файл не загружен</span></>;

    return <><span style={{ color: "green" }}>Файл загружен</span> • {document.upl?.file_name}</>;
  };

  // Проверяем, подписал ли текущий пользователь этот документ
  const hasUserSigned = () => {
    if (!userId || !document.approvals) return false;

    return document.approvals.some(approval =>
      approval.signInfo?.user_id === userId
    );
  };

  const shouldShowRevokeButton = hasUserSigned();

  // Определяем, нужно ли показывать tooltip для кнопки замены файла
  const shouldShowUploadTooltip = !hasAccess && document.upl?.file_id;
  const uploadTooltipTitle = shouldShowUploadTooltip
    ? "только начальник и админ могут заменить документ"
    : document.upl?.id ? "Заменить файл" : "Загрузить файл";

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

          {/* Согласования */}
          {document.approvals && document.approvals.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <Label style={{ marginBottom: '8px', display: 'block' }}>Согласования:</Label>
              {document.approvals.map((signer) => (
                <InfoRow
                  key={signer.id}
                  style={{
                    marginLeft: '20px',
                    marginBottom: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: signer.status === 'signed' ? '#e6f4ea' : '#fffde7',
                    border: '1px solid',
                    borderColor: signer.status === 'signed' ? '#a5d6a7' : '#ffe082',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconButton size="small" sx={{ padding: '2px', color: signer.status === "signed" ? '#4caf50' : '#9e9e9e' }}>
                    {signer.status === 'signed' ? <CheckCircleIcon fontSize="small" /> : <AccessTimeIcon fontSize="small" />}
                  </IconButton>
                  {signer.is_required && (
                    <Tooltip title={t("mandatory_sign")}>
                      <WarningAmberIcon color="error" fontSize="small" />
                    </Tooltip>)}
                  <span style={{ flex: 1, marginLeft: "8px", fontSize: "13px" }}>
                    {signer.department_name} <br />
                    <strong>{signer.signInfo?.employee_fullname}</strong> {" "} ({signer.position_name}) {" "}
                    {signer.status === "signed" ? ` - ${t("signed")}` : ` - ${t("waiting")}`}
                  </span>
                </InfoRow>
              ))}
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
        <ActionsRight>
          {shouldShowRevokeButton ? (
            <PrimaryButton
              onClick={() => store.openRoleSelectionForRevoke(document.upl?.file_id, () => {
                onSigned()
              })}
            // disabled={step?.status !== "in_progress"} //TODO
            >
              Отозвать подпись
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={() => store.openRoleSelectionForSigning(document.upl?.file_id, document.upl?.id, () => {
                onSigned()
              })}
            // disabled={step?.status !== "in_progress"} //TODO
            >
              Подписать ЭЦП
            </PrimaryButton>
          )}
        </ActionsRight>
      </ActionsRow>
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

const ActionsRight = styled.div`
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