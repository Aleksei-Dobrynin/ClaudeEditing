import React, { useState, useMemo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Box,
  Typography,
  Checkbox,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  ListSubheader,
  Tooltip,
  CircularProgress,
  SelectChangeEvent,
  OutlinedInput,
  alpha,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FormStyles } from '../styles/FormStyles';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
  description?: string;
  color?: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | number | string[] | number[];
  onChange: (e: any) => void;
  options: SelectOption[];
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  placeholder?: string;
  groupBy?: boolean;
  showDescription?: boolean;
  maxHeight?: number;
  chipDisplay?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  onSearch?: (searchTerm: string) => void;
}

// Стилизованные компоненты
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  ...FormStyles.utils.applySelectStyles(theme),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    paddingTop: '9px',
    paddingBottom: '9px',
    minHeight: 'auto',
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
  '& .MuiInputBase-root': {
    borderRadius: FormStyles.sizes.borderRadius,
  },
}));

const MenuItemContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

const OptionIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.action.active,
}));

const OptionText = styled(Box)({
  flexGrow: 1,
  overflow: 'hidden',
});

const OptionLabel = styled(Typography)({
  lineHeight: 1.2,
});

const OptionDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  lineHeight: 1.2,
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
}));

const GroupHeader = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,
  fontWeight: 500,
  position: 'sticky',
  top: 0,
  zIndex: 2,
}));

const NoOptionsMessage = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error = false,
  helperText,
  required = false,
  disabled = false,
  multiple = false,
  searchable = false,
  clearable = false,
  loading = false,
  placeholder,
  groupBy = false,
  showDescription = false,
  maxHeight = 300,
  chipDisplay = true,
  fullWidth = true,
  size = 'small',
  onSearch,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Фильтрация опций по поисковому запросу
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(lowerSearchTerm) ||
      (option.description && option.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [options, searchTerm]);

  // Группировка опций
  const groupedOptions = useMemo(() => {
    if (!groupBy) return { '': filteredOptions };

    return filteredOptions.reduce((groups, option) => {
      const group = option.group || '';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    }, {} as Record<string, SelectOption[]>);
  }, [filteredOptions, groupBy]);

  // Обработчики
  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    // Создаем синтетическое событие для совместимости с обычными обработчиками
    const syntheticEvent = {
      target: {
        name,
        value: event.target.value,
      },
      currentTarget: {
        name,
        value: event.target.value,
      },
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    onChange(syntheticEvent);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const syntheticEvent = {
      target: {
        name,
        value: multiple ? [] : null,
      },
      currentTarget: {
        name,
        value: multiple ? [] : null,
      },
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    onChange(syntheticEvent);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearch) {
      onSearch(newSearchTerm);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  // Получение отображаемого значения
  const getDisplayValue = () => {
    if (multiple && Array.isArray(value)) {
      if (chipDisplay) {
        return value;
      }
      const count = value.length;
      if (count === 0) return '';
      if (count === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option ? option.label : '';
      }
      return t('select.itemsSelected', `${count} выбрано`);
    }
    // Для single select возвращаем значение как есть
    // MUI Select сам найдет соответствующий MenuItem по value
    return value || '';
  };

  // Проверка, выбрана ли опция
  const isOptionSelected = (optionValue: string | number) => {
    if (multiple && Array.isArray(value)) {
      return (value as Array<string | number>).includes(optionValue);
    }
    return value === optionValue;
  };

  // Рендер значения для multiple select с chips
  const renderValue = (selected: typeof value) => {
    if (!multiple || !chipDisplay || !Array.isArray(selected)) {
      return null;
    }

    return (
      <ChipContainer>
        {(selected as Array<string | number>).map((val) => {
          const option = options.find(opt => opt.value === val);
          return (
            <Chip
              key={val}
              label={option?.label || val}
              size="small"
              onDelete={disabled ? undefined : () => {
                const newValue = (selected as Array<string | number>).filter(v => v !== val);
                const syntheticEvent = {
                  target: { name, value: newValue },
                  currentTarget: { name, value: newValue },
                  preventDefault: () => {},
                  stopPropagation: () => {},
                };
                onChange(syntheticEvent);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            />
          );
        })}
      </ChipContainer>
    );
  };

  // Рендер элемента меню
  const renderMenuItem = (option: SelectOption) => {
    const selected = isOptionSelected(option.value);

    return (
      <MenuItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        sx={{
          backgroundColor: selected ? alpha(theme.palette.primary.main, 0.08) : undefined,
        }}
      >
        {multiple && (
          <Checkbox
            checked={selected}
            size="small"
            sx={{ mr: 1, p: 0 }}
          />
        )}
        <MenuItemContent>
          {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
          <OptionText>
            <OptionLabel variant="body2">{option.label}</OptionLabel>
            {showDescription && option.description && (
              <OptionDescription variant="caption">
                {option.description}
              </OptionDescription>
            )}
          </OptionText>
          {selected && !multiple && (
            <CheckCircleIcon 
              fontSize="small" 
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </MenuItemContent>
      </MenuItem>
    );
  };

  // Рендер меню
  const renderMenuItems = () => {
    const hasOptions = Object.values(groupedOptions).some(group => group.length > 0);

    if (!hasOptions) {
      return [
        <MenuItem key="no-options" disabled>
          <NoOptionsMessage variant="body2">
            {t('select.noOptions', 'Нет доступных опций')}
          </NoOptionsMessage>
        </MenuItem>
      ];
    }

    const items: React.ReactElement[] = [];
    
    Object.entries(groupedOptions).forEach(([group, groupOptions]) => {
      if (group) {
        items.push(<GroupHeader key={`group-${group}`}>{group}</GroupHeader>);
      }
      groupOptions.forEach(option => {
        items.push(renderMenuItem(option));
      });
    });
    
    return items;
  };

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      error={error}
      size={size}
      disabled={disabled}
    >
      <InputLabel id={`${id}-label`}>
        {label}
        {required && <span style={{ color: theme.palette.error.main }}> *</span>}
      </InputLabel>
      
      <StyledSelect
        labelId={`${id}-label`}
        id={id}
        data-testid={id}
        value={value === null || value === undefined ? '' : value}
        onChange={handleChange}
        multiple={multiple}
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        input={<OutlinedInput label={label + (required ? ' *' : '')} />}
        renderValue={multiple && chipDisplay ? renderValue : undefined}
        displayEmpty
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: maxHeight,
              borderRadius: FormStyles.sizes.borderRadius,
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
        endAdornment={
          <>
            {loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            )}
            {clearable && value !== null && value !== undefined && value !== '' && value !== 0 && (!Array.isArray(value) || value.length > 0) && !disabled && (
              <InputAdornment position="end">
                <Tooltip title={t('select.clear', 'Очистить')}>
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )}
          </>
        }
      >
        {searchable && (
          <React.Fragment key="search-section">
            <SearchField
              size="small"
              placeholder={t('select.search', 'Поиск...')}
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Divider />
          </React.Fragment>
        )}
        
        {placeholder && (!value || (Array.isArray(value) && value.length === 0)) && (
          <MenuItem key="placeholder" value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        
        {renderMenuItems()}
      </StyledSelect>
      
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  );
};

// Дополнительный экспорт для Autocomplete-подобного поведения
export const SelectFieldAutocomplete = SelectField;

export default SelectField;