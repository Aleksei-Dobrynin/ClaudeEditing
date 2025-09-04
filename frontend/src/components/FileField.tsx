import React from 'react';
import {
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

type FileFieldType = {
  value?: string;
  error?: boolean;
  helperText?: string;
  fieldName?: string;
  inputKey?: string;
  onClear: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  idFile?: string;
};

const FileField: React.FC<FileFieldType> = ({
  value,
  error,
  helperText,
  fieldName,
  inputKey,
  onClear,
  onChange,
  idFile,
}) => {
  // Генерация уникального ID, если `idFile` не передан
  const uniqueId = React.useMemo(() => idFile || `file-input-${Math.random().toString(36).substr(2, 9)}`, [idFile]);

  return (
    <TextField
      error={error}
      size="small"
      variant="outlined"
      fullWidth
      value={value || ''}
      InputProps={{
        readOnly: true, // Поле только для чтения, так как файлы загружаются через кнопку
        endAdornment: (
          <Box display="flex" alignItems="center">
            <IconButton
              component="label"
              htmlFor={uniqueId} // Используем уникальный ID
              style={{ padding: 0 }}
            >
              <CloudUploadIcon style={{ cursor: 'pointer' }} />
              <input
                style={{ display: 'none' }}
                id={uniqueId} // Уникальный ID для каждого компонента
                type="file"
                multiple
                key={inputKey} // Убедитесь, что `inputKey` уникален
                onChange={(ev) => {
                  if (fieldName != null) {
                    ev.target.name = fieldName;
                  }
                  onChange(ev);
                }}
              />
            </IconButton>
            <IconButton onClick={onClear} style={{ padding: 0 }}>
              <ClearIcon style={{ cursor: 'pointer' }} />
            </IconButton>
          </Box>
        ),
      }}
      helperText={error ? helperText : null}
    />
  );
};

export default FileField;