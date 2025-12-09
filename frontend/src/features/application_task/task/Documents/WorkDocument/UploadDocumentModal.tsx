import React, { FC, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import store from './store';

interface UploadDocumentModalProps {
  onUpload: () => void;
}

export const UploadDocumentModal: FC<UploadDocumentModalProps> = observer(({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (!isLoading) {
      store.closePanel();
      setFile(null);
      setComment('');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      store.onSaveTemplateClick(() => {
        handleClose();
        onUpload();
      }, file, file.name, comment);

    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <StyledDialog
      open={store.openPanel}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography variant="h6" component="div">
          Загрузка документа
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          disabled={isLoading}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <StyledDialogContent>
        <UploadArea
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          isDragActive={dragActive}
          hasFile={!!file}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            // accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          />

          {file ? (
            <FilePreview>
              <FileIcon>
                <InsertDriveFileIcon />
              </FileIcon>
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileSize>{formatFileSize(file.size)}</FileSize>
              </FileInfo>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                disabled={isLoading}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </FilePreview>
          ) : (
            <UploadPlaceholder>
              <CloudUploadIcon />
              <UploadText>
                Перетащите файл сюда или нажмите для выбора
              </UploadText>
              {/* <UploadHint>
                Поддерживаются: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, JPEG
              </UploadHint> */}
            </UploadPlaceholder>
          )}
        </UploadArea>

        <CommentField
          multiline
          rows={4}
          fullWidth
          label="Комментарий"
          placeholder="Добавьте комментарий к документу (необязательно)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isLoading}
        />
      </StyledDialogContent>

      <StyledDialogActions>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          color="inherit"
        >
          Отмена
        </Button>
        <SaveButton
          onClick={handleSubmit}
          disabled={!file || isLoading}
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Загрузка...' : 'Сохранить'}
        </SaveButton>
      </StyledDialogActions>
    </StyledDialog>
  );
});

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  
  .MuiTypography-root {
    font-weight: 600;
    color: #1f2937;
  }
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UploadArea = styled.div<{ isDragActive: boolean; hasFile: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? '#3b82f6' : props.hasFile ? '#10b981' : '#d1d5db'};
  border-radius: 12px;
  padding: ${props => props.hasFile ? '16px' : '32px'};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isDragActive ? '#eff6ff' : props.hasFile ? '#f0fdf4' : '#f9fafb'};
  
  &:hover {
    border-color: ${props => props.hasFile ? '#10b981' : '#3b82f6'};
    background: ${props => props.hasFile ? '#f0fdf4' : '#eff6ff'};
  }
`;

const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  svg {
    font-size: 48px;
    color: #9ca3af;
  }
`;

const UploadText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #374151;
`;

const UploadHint = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
`;

const FileIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #e0f2fe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0284c7;
  
  svg {
    font-size: 24px;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
`;

const CommentField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;
    
    &:hover fieldset {
      border-color: #3b82f6;
    }
    
    &.Mui-focused fieldset {
      border-color: #3b82f6;
    }
  }
  
  .MuiInputLabel-root {
    &.Mui-focused {
      color: #3b82f6;
    }
  }
`;

const StyledDialogActions = styled(DialogActions)`
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  gap: 12px;
`;

const SaveButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    text-transform: none;
    font-weight: 500;
    padding: 8px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
    
    &:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.25);
    }
    
    &:disabled {
      background: #e5e7eb;
      color: #9ca3af;
      box-shadow: none;
    }
  }
`;

export default UploadDocumentModal;