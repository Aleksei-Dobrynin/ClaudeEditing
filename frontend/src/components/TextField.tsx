import React from 'react';
import { TextField, InputAdornment } from "@mui/material";

type TextFieldProps = {
  value: string | number;
  label: string;
  name: string;
  onChange: (e) => void;
  id: string;
  error?: boolean,
  helperText?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  InputProps?: any;
  icon?: any;
  onKeyDown?: (e) => void;
  onBlur?: (e) => void;
  onFocus?: (e) => void;
  noFullWidth?: boolean;
  disabled?: boolean;
}

const CustomTextField = (props: TextFieldProps) => {
  const { onChange, onBlur, type, ...otherProps } = props;

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
      
      // ИСПРАВЛЕННАЯ валидация - разрешаем больше промежуточных значений
      const isValidInput = value === '' || 
                          value === '.' || 
                          value === '-' || 
                          value === '-.' ||
                          value === '0.' ||  // ДОБАВЛЕНО
                          /^-?\d*\.?\d*$/.test(value);
      
      if (isValidInput) {
        onChange(event);
      } else {
        // ВАЖНО: НЕ блокируем onChange полностью, а передаем как есть
        // Это позволит внешнему обработчику решить что делать
        onChange(event);
      }
    } else {
      onChange(event);
    }
  };

  // Обработчик onBlur для нормализации числовых значений
  const handleNumberBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (type === "number") {
      let value = event.target.value;
      
      // Нормализуем значение при потере фокуса
      if (value && value !== '.' && value !== '-' && value !== '-.' && !isNaN(parseFloat(value))) {
        const normalizedValue = parseFloat(value).toString();
        if (normalizedValue !== value) {
          event.target.value = normalizedValue;
          // Создаем новое событие для onChange
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
    
    // Вызываем оригинальный onBlur если он передан
    if (onBlur) {
      onBlur(event);
    }
  };

  var elem = props.icon ? React.cloneElement(
    props.icon,
    { color: "primary" }
  ) : null
  var icon = elem ? <InputAdornment position="start" style={{ color: 'Gray' }}>
    {props.icon}
  </InputAdornment> : null

  return (
    <TextField
      {...otherProps}
      type={type}
      value={type === "number" && props.value == null ? "" : props.value ?? ""}
      variant="outlined"
      fullWidth={!props.noFullWidth}
      onChange={handleNumberChange}
      onBlur={handleNumberBlur}
      onKeyDown={props.onKeyDown}
      data-testid={props.id}
      onFocus={props.onFocus}
      onWheel={(event: any) => {
        event?.currentTarget?.blur();
        event?.target?.blur();
      }}
      rows={props.rows}
      size='small'
      color="primary"
      error={props.error}
      helperText={props.helperText}
      InputProps={{
        ...props.InputProps,
        startAdornment: (icon),
        // Для числовых полей добавляем подсказку для мобильных устройств
        ...(type === "number" && {
          inputProps: {
            inputMode: 'decimal',
            ...props.InputProps?.inputProps
          }
        })
      }}
      multiline={props.multiline}
      maxRows={props.maxRows}
    />
  );
}

export default CustomTextField;