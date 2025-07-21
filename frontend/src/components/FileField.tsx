import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  alpha,
  Button,
  TextField,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { FormStyles } from '../styles/FormStyles';
import { useTranslation } from 'react-i18next';

type FileFieldProps = {
  value?: string | File | File[] | FileList;
  error?: boolean;
  helperText?: string;
  fieldName?: string;
  inputKey?: string; // Добавляем обратно для совместимости
  onChange: (event: any) => void;
  onClear?: () => void;
  idFile?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // в байтах
  showPreview?: boolean;
  dragAndDrop?: boolean;
};

// Стилизованные компоненты
const FileFieldContainer = styled(Box)({
  position: 'relative',
  width: '100%',
});

const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: FormStyles.sizes.borderRadius,
  textTransform: 'none',
  padding: '8px 16px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#fff',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    backgroundColor: FormStyles.colors.backgroundDisabled,
  },
}));

const DropZone = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'error',
})<{ isDragging?: boolean; error?: boolean }>(({ theme, isDragging, error }) => ({
  border: `2px dashed ${error ? theme.palette.error.main : isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: FormStyles.sizes.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: FormStyles.transitions.default,
  backgroundColor: isDragging ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
}));

const FileListContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: FormStyles.sizes.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

const FileInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  borderRadius: FormStyles.sizes.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

const ImageThumb = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  objectFit: 'cover',
  borderRadius: FormStyles.sizes.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

// Утилиты
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (file: File | string) => {
  if (typeof file === 'string') {
    const ext = file.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <ImageIcon />;
    if (ext === 'pdf') return <PictureAsPdfIcon />;
    if (['doc', 'docx'].includes(ext || '')) return <DescriptionIcon />;
    return <InsertDriveFileIcon />;
  }
  
  const type = file.type.toLowerCase();
  if (type.startsWith('image/')) return <ImageIcon />;
  if (type === 'application/pdf') return <PictureAsPdfIcon />;
  if (type.includes('word') || type.includes('document')) return <DescriptionIcon />;
  return <InsertDriveFileIcon />;
};

// Компонент превью изображения
const ImagePreview: React.FC<{ file: File | string }> = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (typeof file === 'string') {
      setPreviewUrl(file);
      return;
    }
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  if (!previewUrl) return null;

  return <ImageThumb src={previewUrl} alt={typeof file === 'string' ? file : file.name} />;
};

const FileField: React.FC<FileFieldProps> = ({
  value,
  error,
  helperText,
  fieldName,
  inputKey, // Добавляем обратно
  onChange,
  onClear,
  idFile,
  label,
  required,
  disabled,
  multiple = false,
  accept,
  maxSize,
  showPreview = true,
  dragAndDrop = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const uniqueId = React.useMemo(() => 
    idFile || `file-input-${Math.random().toString(36).substr(2, 9)}`, 
    [idFile]
  );

  // Нормализация значения в массив файлов
  const normalizeFiles = useCallback((): (File | string)[] => {
    if (!value) return [];
    
    // FileList
    if (value instanceof FileList) {
      return Array.from(value);
    }
    
    // Массив
    if (Array.isArray(value)) {
      return value;
    }
    
    // Одиночный файл или строка
    return [value];
  }, [value]);

  const files = normalizeFiles();
  const hasFiles = files.length > 0;

  // Обработка выбора файлов
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setFileError(null);
    const filesArray = Array.from(selectedFiles);

    // Проверка размера файлов
    if (maxSize) {
      const oversizedFiles = filesArray.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setFileError(
          t('file.sizeError', `Файлы превышают максимальный размер ${formatFileSize(maxSize)}`)
        );
        return;
      }
    }

    // Создаем событие в формате, совместимом с существующим кодом
    const event = {
      target: {
        files: selectedFiles,
        value: multiple ? filesArray : filesArray[0],
        name: fieldName || '',
      },
      currentTarget: {
        files: selectedFiles,
        value: multiple ? filesArray : filesArray[0],
        name: fieldName || '',
      }
    };

    onChange(event);
  }, [onChange, fieldName, maxSize, t, multiple]);

  // Обработчики drag & drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    
    if (multiple) {
      const event = {
        target: {
          files: null,
          value: newFiles,
          name: fieldName || '',
        },
      };
      onChange(event);
    } else {
      handleClear();
    }
  };

  const handleClear = () => {
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    const event = {
      target: {
        files: null,
        value: multiple ? [] : null,
        name: fieldName || '',
      },
    };
    
    onChange(event);
    
    if (onClear) {
      onClear();
    }
  };

  const handleOpenFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Отображение имени файла
  const getDisplayName = () => {
    if (!hasFiles) return '';
    
    if (files.length === 1) {
      const file = files[0];
      return typeof file === 'string' ? file.split('/').pop() || file : file.name;
    }
    
    return t('file.filesSelected', `Выбрано файлов: ${files.length}`);
  };

  // Режим drag & drop
  if (dragAndDrop) {
    return (
      <FileFieldContainer>
        {label && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {label}
            {required && <span style={{ color: theme.palette.error.main }}> *</span>}
          </Typography>
        )}
        
        <DropZone
          elevation={0}
          isDragging={isDragging}
          error={error || !!fileError}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleOpenFileDialog}
        >
          <CloudUploadIcon 
            sx={{ 
              fontSize: 48, 
              color: isDragging ? 'primary.main' : 'action.disabled',
              mb: 2,
            }} 
          />
          <Typography variant="h6" gutterBottom>
            {t('file.dragDropTitle', 'Перетащите файлы сюда')}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('file.dragDropSubtitle', 'или нажмите для выбора')}
          </Typography>
          {accept && (
            <Typography variant="caption" color="text.secondary">
              {t('file.acceptedFormats', 'Поддерживаемые форматы')}: {accept}
            </Typography>
          )}
          {maxSize && (
            <Typography variant="caption" color="text.secondary" display="block">
              {t('file.maxSize', 'Максимальный размер')}: {formatFileSize(maxSize)}
            </Typography>
          )}
        </DropZone>
        
        <input
          ref={fileInputRef}
          style={{ display: 'none' }}
          id={uniqueId}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          disabled={disabled}
          key={inputKey} // Используем inputKey если передан
        />
        
        {/* Список файлов */}
        {hasFiles && (
          <FileListContainer elevation={0}>
            <List dense>
              {files.map((file, index) => {
                const fileName = typeof file === 'string' ? file.split('/').pop() || file : file.name;
                const fileSize = typeof file === 'string' ? '' : formatFileSize(file.size);
                
                return (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getFileIcon(file)}
                    </ListItemIcon>
                    <ListItemText
                      primary={fileName}
                      secondary={fileSize}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title={t('file.remove', 'Удалить')}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveFile(index)}
                          disabled={disabled}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </FileListContainer>
        )}
        
        {/* Превью изображений */}
        {showPreview && hasFiles && (
          <ImagePreviewContainer>
            {files.filter(file => {
              if (typeof file === 'string') {
                const ext = file.split('.').pop()?.toLowerCase();
                return ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '');
              }
              return file.type.startsWith('image/');
            }).map((file, index) => (
              <ImagePreview key={index} file={file} />
            ))}
          </ImagePreviewContainer>
        )}
        
        {(error || fileError) && (
          <Typography 
            variant="caption" 
            color="error" 
            sx={{ mt: 1, display: 'block' }}
          >
            {fileError || helperText}
          </Typography>
        )}
      </FileFieldContainer>
    );
  }

  // Стандартный режим - простая кнопка
  return (
    <FileFieldContainer>
      {label && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
          {required && <span style={{ color: theme.palette.error.main }}> *</span>}
        </Typography>
      )}
      
      <Box display="flex" alignItems="center" gap={1}>
        <UploadButton
          variant="outlined"
          startIcon={<AttachFileIcon />}
          onClick={handleOpenFileDialog}
          disabled={disabled}
          fullWidth
        >
          {hasFiles ? getDisplayName() : t('file.selectFile', 'Выбрать файл')}
        </UploadButton>
        
        {hasFiles && (
          <Tooltip title={t('file.clearAll', 'Очистить')}>
            <IconButton 
              onClick={handleClear}
              disabled={disabled}
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      <input
        ref={fileInputRef}
        style={{ display: 'none' }}
        id={uniqueId}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInputChange}
        disabled={disabled}
        key={inputKey} // Используем inputKey если передан
      />
      
      {/* Информация о выбранных файлах */}
      {hasFiles && !multiple && (
        <FileInfo>
          <Box display="flex" alignItems="center" gap={1}>
            {getFileIcon(files[0])}
            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
              {getDisplayName()}
            </Typography>
            {typeof files[0] !== 'string' && (
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(files[0].size)}
              </Typography>
            )}
          </Box>
        </FileInfo>
      )}
      
      {/* Список для multiple */}
      {hasFiles && multiple && (
        <FileListContainer elevation={0}>
          <List dense>
            {files.map((file, index) => {
              const fileName = typeof file === 'string' ? file.split('/').pop() || file : file.name;
              const fileSize = typeof file === 'string' ? '' : formatFileSize(file.size);
              
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    {getFileIcon(file)}
                  </ListItemIcon>
                  <ListItemText
                    primary={fileName}
                    secondary={fileSize}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title={t('file.remove', 'Удалить')}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveFile(index)}
                        disabled={disabled}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </FileListContainer>
      )}
      
      {/* Превью для одиночного изображения */}
      {showPreview && hasFiles && !multiple && (() => {
        const file = files[0];
        const isImage = typeof file === 'string' 
          ? ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(file.split('.').pop()?.toLowerCase() || '')
          : file.type.startsWith('image/');
        
        return isImage ? (
          <Box mt={2}>
            <ImagePreview file={file} />
          </Box>
        ) : null;
      })()}
      
      {(error || fileError) && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ mt: 1, display: 'block' }}
        >
          {fileError || helperText}
        </Typography>
      )}
    </FileFieldContainer>
  );
};

export default FileField;