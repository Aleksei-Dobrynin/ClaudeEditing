import { FC, useEffect, useState } from "react";
import { 
  Dialog, 
  DialogActions, 
  DialogContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  FormControlLabel
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import dayjs from "dayjs";
import DownloadIcon from '@mui/icons-material/Download';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import store from "./store";
import { observer } from "mobx-react-lite";

type SendDocumentPopupFormProps = {
  openPanel: boolean;
  applicationId: number;
  onBtnCancelClick: () => void;
  onBtnOkClick: (selectedDocumentIds: number[]) => void;
};

const SendDocumentPopupForm: FC<SendDocumentPopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  
  const [selectAll, setSelectAll] = useState(false);

  // Загрузка документов при открытии диалога
  useEffect(() => {
    if (props.openPanel && props.applicationId) {
      loadDocuments();
    }
  }, [props.openPanel, props.applicationId]);

  // Очистка выбранных документов при закрытии
  useEffect(() => {
    if (!props.openPanel) {
      clearSelectedDocuments();
      setSelectAll(false);
    }
  }, [props.openPanel]);

  const loadDocuments = async () => {
    try {
      await store.loadIncomingDocuments(props.applicationId);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const clearSelectedDocuments = () => {
    store.selectedOutgoingDocuments = [];
  };

  // Мок функции для действий с файлами
  const mockDownloadFile = (fileId: number, fileName: string) => {
    console.log(`Скачивание файла: ${fileName} (ID: ${fileId})`);
  };

  const mockOpenFile = (fileId: number, fileName: string) => {
    console.log(`Открытие файла: ${fileName} (ID: ${fileId})`);
  };

  const mockCheckFile = (fileName: string) => {
    // Проверяем расширение файла для определения возможности просмотра
    const viewableExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.txt', '.docx'];
    return viewableExtensions.some(ext => fileName?.toLowerCase().includes(ext));
  };

  const handleDocumentSelect = (uploadId: number, checked: boolean) => {
    if (checked) {
      store.selectedOutgoingDocuments = [...store.selectedOutgoingDocuments, uploadId];
    } else {
      store.selectedOutgoingDocuments = store.selectedOutgoingDocuments.filter(id => id !== uploadId);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    
    const uploadIds = store.outgoingDocuments
      .filter(doc => doc.file_id && doc.upload_id)
      .map(doc => doc.upload_id);

    if (checked) {
      store.selectedOutgoingDocuments = uploadIds;
    } else {
      store.selectedOutgoingDocuments = [];
    }
  };

  const isDocumentSelected = (uploadId: number) => {
    return store.selectedOutgoingDocuments.includes(uploadId);
  };

  const handleSend = () => {
    props.onBtnOkClick(store.selectedOutgoingDocuments);
  };

  const getStatusChip = (row: any) => {
    return (
      <Chip
        label={row.upload_id ? (row.file_id ? 'Загружен' : "Принят") : "Не загружен"}
        size="small"
        color={row.upload_id ? (row.file_id ? 'success' : "info") : "error"}
      />
    );
  };

  const selectedCount = store.selectedOutgoingDocuments.length;

  return (
    <Dialog maxWidth="lg" fullWidth open={props.openPanel} onClose={props.onBtnCancelClick}>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          {translate("Выбор исходящих документов для отправки")}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            }
            label={translate("Выбрать все")}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">{translate("Выбрать")}</TableCell>
                <TableCell>{translate("label:uploaded_application_documentListView.doc_name")}</TableCell>
                <TableCell>{translate("label:uploaded_application_documentListView.status")}</TableCell>
                <TableCell>{translate("label:uploaded_application_documentListView.file_name")}</TableCell>
                <TableCell>{translate("label:uploaded_application_documentListView.created_at")}</TableCell>
                <TableCell>{translate("Действия")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {store.outgoingDocuments?.map((row) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        disabled={!row.file_id || !row.upload_id}
                        checked={isDocumentSelected(row.upload_id)}
                        onChange={(e) => handleDocumentSelect(row.upload_id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>{row.doc_name}</TableCell>
                    <TableCell>{getStatusChip(row)}</TableCell>
                    <TableCell>{row.file_name}</TableCell>
                    <TableCell>
                      {row.created_at ? dayjs(row.created_at).format('DD.MM.YYYY HH:mm') : ""}
                    </TableCell>
                    <TableCell>
                      {row.file_id && (
                        <>
                          <Tooltip title="Скачать">
                            <IconButton 
                              size="small" 
                              onClick={() => mockDownloadFile(row.file_id, row.file_name)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          {mockCheckFile(row.file_name) && (
                            <Tooltip title="Просмотр">
                              <IconButton 
                                size="small" 
                                onClick={() => mockOpenFile(row.file_id, row.file_name)}
                              >
                                <RemoveRedEyeIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Информация о выбранных документах */}
        {selectedCount > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {translate("Выбрано документов")}: {selectedCount}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {store.selectedOutgoingDocuments.map((uploadId) => {
                const doc = store.outgoingDocuments.find(d => d.upload_id === uploadId);
                return doc ? (
                  <Chip
                    key={uploadId}
                    label={doc.doc_name || doc.file_name}
                    size="small"
                    onDelete={() => handleDocumentSelect(uploadId, false)}
                    color="secondary"
                  />
                ) : null;
              })}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <CustomButton
          variant="contained"
          onClick={handleSend}
          disabled={selectedCount === 0}
        >
          {translate("Отправить")} ({selectedCount})
        </CustomButton>
        <CustomButton
          variant="outlined"
          onClick={props.onBtnCancelClick}
        >
          {translate("common:cancel")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
});

export default SendDocumentPopupForm;