import React, { useState, useEffect } from 'react';
import { 
  TextField as MuiTextField, 
  InputAdornment, 
  Box,
  Typography,
  Fade,
  CircularProgress
} from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import { FormStyles } from '../styles/FormStyles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

type TextFieldProps = {
  value: string | number;
  label: string;
  name: string;
  onChange: (e: any) => void;
  id: string;
  error?: boolean;
  helperText?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  InputProps?: any;
  icon?: any;
  onKeyDown?: (e: any) => void;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  noFullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  loading?: boolean;
  success?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

// Стилизованный TextField с применением общих стилей
const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  ...FormStyles.utils.applyInputStyles(theme),
  '& .MuiInputBase-input': {
    fontSize: FormStyles.sizes.fontSize,
    padding: FormStyles.sizes.inputPadding,
    height: 'auto',
  },
  '& .MuiInputAdornment-root': {
    marginLeft: '8px',
    marginRight: '8px',
  },
}));

// Компонент для отображения счетчика символов
const CharacterCount = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
  textAlign: 'right',
  marginTop: '4px',
  marginRight: '14px',
  transition: 'color 0.2s ease-in-out',
}));

// Контейнер для поля
const FieldContainer = styled(Box)({
  position: 'relative',
  width: '100%',
});

const CustomTextField: React.FC<TextFieldProps> = (props) => {
  const { 
    onChange, 
    onBlur, 
    type, 
    value,
    maxLength,
    showCharacterCount,
    loading,
    success,
    error,
    icon,
    required,
    label,
    ...otherProps 
  } = props;
  
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Обновление счетчика символов
  useEffect(() => {
    const strValue = String(value || '');
    setCharCount(strValue.length);
  }, [value]);

  // Обработчик для замены запятой на точку в числовых полях
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      let value = event.target.value;
      
      // Заменяем запятую на точку
      if (value.includes(',')) {
        value = value.replace(/,/g, '.');
        event.target.value = value;
      }
      
      // Разрешаем только одну точку в числе
      const dotCount = (value.match(/\./g) || []).length;
      if (dotCount > 1) {
        const parts = value.split('.');
        value = parts[0] + '.' + parts.slice(1).join('');
        event.target.value = value;
      }
      
      // Валидация числового ввода
      const isValidInput = value === '' || 
                          value === '.' || 
                          value === '-' || 
                          value === '-.' ||
                          value === '0.' ||
                          /^-?\d*\.?\d*$/.test(value);
      
      if (isValidInput) {
        onChange(event);
      }
    } else {
      // Для текстовых полей проверяем maxLength
      if (maxLength && event.target.value.length > maxLength) {
        return;
      }
      onChange(event);
    }
  };

  // Обработчик onBlur для нормализации числовых значений
  const handleNumberBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    if (type === "number") {
      let value = event.target.value;
      
      // Нормализуем значение при потере фокуса
      if (value && value !== '.' && value !== '-' && value !== '-.' && !isNaN(parseFloat(value))) {
        const normalizedValue = parseFloat(value).toString();
        if (normalizedValue !== value) {
          event.target.value = normalizedValue;
          const changeEvent = {
            ...event,
            target: {
              ...event.target,
              value: normalizedValue
            }
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(changeEvent);
        }
      }
    }
    
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  // Определение иконки для endAdornment
  let endAdornmentIcon = null;
  if (loading) {
    endAdornmentIcon = <CircularProgress size={20} />;
  } else if (success && !error) {
    endAdornmentIcon = <CheckCircleIcon color="success" fontSize="small" />;
  } else if (error) {
    endAdornmentIcon = <ErrorIcon color="error" fontSize="small" />;
  }

  // Подготовка startAdornment с иконкой
  const startAdornment = icon ? (
    <InputAdornment position="start">
      {React.cloneElement(icon, { 
        color: error ? 'error' : (isFocused ? 'primary' : 'action'),
        fontSize: 'small'
      })}
    </InputAdornment>
  ) : null;

  // Подготовка endAdornment
  const endAdornment = endAdornmentIcon ? (
    <Fade in={true}>
      <InputAdornment position="end">
        {endAdornmentIcon}
      </InputAdornment>
    </Fade>
  ) : null;

  // Определение цвета счетчика символов
  const getCharCountColor = () => {
    if (!maxLength) return theme.palette.text.secondary;
    const percentage = (charCount / maxLength) * 100;
    if (percentage >= 100) return theme.palette.error.main;
    if (percentage >= 90) return theme.palette.warning.main;
    return theme.palette.text.secondary;
  };

  return (
    <FieldContainer>
      <StyledTextField
        {...otherProps}
        type={type}
        value={type === "number" && props.value == null ? "" : props.value ?? ""}
        variant="outlined"
        fullWidth={!props.noFullWidth}
        onChange={handleNumberChange}
        onBlur={handleNumberBlur}
        onFocus={handleFocus}
        data-testid={props.id}
        onWheel={(event: any) => {
          if (type === "number") {
            event?.currentTarget?.blur();
            event?.target?.blur();
          }
        }}
        size='small'
        color={error ? "error" : (success ? "success" : "primary")}
        error={error}
        helperText={props.helperText}
        label={
          <span>
            {label}
            {required && <span style={{ color: theme.palette.error.main }}> *</span>}
          </span>
        }
        InputProps={{
          ...props.InputProps,
          startAdornment: startAdornment,
          endAdornment: endAdornment || props.InputProps?.endAdornment,
          ...(type === "number" && {
            inputProps: {
              inputMode: 'decimal',
              ...props.InputProps?.inputProps
            }
          })
        }}
        inputProps={{
          maxLength: maxLength,
          ...props.InputProps?.inputProps
        }}
      />
      
      {showCharacterCount && maxLength && (
        <CharacterCount 
          style={{ color: getCharCountColor() }}
        >
          {charCount}/{maxLength}
        </CharacterCount>
      )}
    </FieldContainer>
  );
}

export default CustomTextField;