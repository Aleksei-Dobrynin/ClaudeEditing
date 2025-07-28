import * as React from 'react';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Chip,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClearIcon from '@mui/icons-material/Clear';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { observer } from 'mobx-react';
import { FormStyles } from '../styles/FormStyles';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/ru';

type DateFieldProps = {
  id: string;
  value: Dayjs | null;
  label: string;
  name: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  onChange: (e: any) => void;
  required?: boolean;
  showQuickSelect?: boolean;
  clearable?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
};

// Стилизованный контейнер
const DateFieldContainer = styled(Box)({
  position: 'relative',
  width: '100%',
});

// Стилизованный DatePicker
const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-root': {
    borderRadius: FormStyles.sizes.borderRadius,
    backgroundColor: '#fff',
    transition: FormStyles.transitions.default,
    fontSize: FormStyles.sizes.fontSize,
    '&:hover': {
      backgroundColor: FormStyles.colors.backgroundHover,
    },
    '&.Mui-focused': {
      backgroundColor: FormStyles.colors.backgroundFocus,
      boxShadow: FormStyles.shadows.focus,
    },
    '&.Mui-error': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: FormStyles.colors.borderError,
      },
      '&.Mui-focused': {
        boxShadow: FormStyles.shadows.error,
      },
    },
    '&.Mui-disabled': {
      backgroundColor: FormStyles.colors.backgroundDisabled,
    },
  },
  '& .MuiInputBase-input': {
    padding: FormStyles.sizes.inputPadding,
    fontSize: FormStyles.sizes.fontSize,
  },
  '& .MuiInputLabel-root': {
    fontSize: FormStyles.sizes.labelFontSize,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: '14px',
    marginRight: '14px',
    fontSize: FormStyles.sizes.helperTextFontSize,
  },
}));

// Компонент быстрого выбора даты
const QuickDateSelect = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
  flexWrap: 'wrap',
}));

const QuickDateChip = styled(Chip)(({ theme }) => ({
  height: '24px',
  fontSize: '12px',
  cursor: 'pointer',
  transition: FormStyles.transitions.fast,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

// Опции быстрого выбора
const quickDateOptions = [
  { label: 'date.today', key: 'today', getValue: () => dayjs() },
  { label: 'date.yesterday', key: 'yesterday', getValue: () => dayjs().subtract(1, 'day') },
  { label: 'date.weekAgo', key: 'weekAgo', getValue: () => dayjs().subtract(1, 'week') },
  { label: 'date.monthAgo', key: 'monthAgo', getValue: () => dayjs().subtract(1, 'month') },
  { label: 'date.startOfMonth', key: 'startOfMonth', getValue: () => dayjs().startOf('month') },
  { label: 'date.endOfMonth', key: 'endOfMonth', getValue: () => dayjs().endOf('month') },
];

const DateField: React.FC<DateFieldProps> = observer((props) => {
  const {
    value,
    onChange,
    label,
    required,
    error,
    helperText,
    disabled,
    minDate,
    maxDate,
    showQuickSelect = false,
    clearable = true,
    placeholder,
    size = 'small',
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleQuickSelect = (getValue: () => Dayjs) => {
    const newDate = getValue();
    
    // Проверка на минимальную и максимальную даты
    if (minDate && newDate.isBefore(minDate)) return;
    if (maxDate && newDate.isAfter(maxDate)) return;
    
    onChange({ target: { value: newDate, name: props.name } });
    setAnchorEl(null);
  };

  const handleClear = () => {
    onChange({ target: { value: null, name: props.name } });
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue instanceof dayjs || newValue === null) {
      onChange({ target: { value: newValue, name: props.name } });
    }
  };

  const handleQuickSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleQuickSelectClose = () => {
    setAnchorEl(null);
  };

  // Форматирование значения для отображения
  const formattedValue = value ? value.format('DD.MM.YYYY') : '';

  // Определение доступности быстрых опций
  const isOptionDisabled = (getValue: () => Dayjs) => {
    const date = getValue();
    return (minDate && date.isBefore(minDate)) || (maxDate && date.isAfter(maxDate));
  };

  return (
    <DateFieldContainer id={props.id} data-testid={props.id}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <StyledDatePicker
          format="DD.MM.YYYY"
          value={value}
          onChange={handleDateChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          open={isPickerOpen}
          onOpen={() => setIsPickerOpen(true)}
          onClose={() => setIsPickerOpen(false)}
          slotProps={{
            textField: {
              size: size,
              error: error,
              helperText: helperText,
              placeholder: placeholder || t('date.selectDate', 'Выберите дату'),
              label: (
                <span>
                  {label}
                  {required && <span style={{ color: theme.palette.error.main }}> *</span>}
                </span>
              ),
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Box display="flex" alignItems="center">
                      {showQuickSelect && !disabled && (
                        <Tooltip title={t('date.quickSelect', 'Быстрый выбор')}>
                          <IconButton
                            size="small"
                            onClick={handleQuickSelectClick}
                            edge="end"
                          >
                            <ScheduleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {clearable && value && !disabled && (
                        <Tooltip title={t('date.clear', 'Очистить')}>
                          <IconButton
                            size="small"
                            onClick={handleClear}
                            edge="end"
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => setIsPickerOpen(!isPickerOpen)}
                        disabled={disabled}
                      >
                        <CalendarTodayIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
              },
            },
            day: {
              sx: {
                borderRadius: FormStyles.sizes.borderRadius,
                transition: FormStyles.transitions.fast,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              },
            },
            layout: {
              sx: {
                '& .MuiPickersCalendarHeader-root': {
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  marginBottom: '16px',
                },
                '& .MuiDayCalendar-header': {
                  gap: '2px',
                },
                '& .MuiDayCalendar-weekContainer': {
                  gap: '2px',
                },
              },
            },
          }}
          dayOfWeekFormatter={(day) => dayjs(day).format('dd')}
        />
      </LocalizationProvider>

      {/* Меню быстрого выбора */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleQuickSelectClose}
        PaperProps={{
          sx: {
            borderRadius: FormStyles.sizes.borderRadius,
            minWidth: '200px',
            mt: 1,
          },
        }}
      >
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            {t('date.quickSelectTitle', 'Быстрый выбор даты')}
          </Typography>
        </MenuItem>
        <Divider />
        
        <Box px={1} py={1}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            {t('date.relative', 'Относительные даты')}
          </Typography>
          {quickDateOptions.slice(0, 4).map((option) => (
            <MenuItem
              key={option.key}
              onClick={() => handleQuickSelect(option.getValue)}
              disabled={isOptionDisabled(option.getValue)}
              sx={{ borderRadius: 1, my: 0.5 }}
            >
              <TodayIcon fontSize="small" sx={{ mr: 1 }} />
              {t(option.label, option.label)}
            </MenuItem>
          ))}
        </Box>
        
        <Divider />
        
        <Box px={1} py={1}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            {t('date.monthBoundaries', 'Границы месяца')}
          </Typography>
          {quickDateOptions.slice(4).map((option) => (
            <MenuItem
              key={option.key}
              onClick={() => handleQuickSelect(option.getValue)}
              disabled={isOptionDisabled(option.getValue)}
              sx={{ borderRadius: 1, my: 0.5 }}
            >
              <EventIcon fontSize="small" sx={{ mr: 1 }} />
              {t(option.label, option.label)}
            </MenuItem>
          ))}
        </Box>
      </Menu>

      {/* Inline быстрый выбор (опционально) */}
      {showQuickSelect && !disabled && (
        <QuickDateSelect>
          {quickDateOptions.slice(0, 3).map((option) => (
            <QuickDateChip
              key={option.key}
              label={t(option.label, option.label)}
              size="small"
              onClick={() => handleQuickSelect(option.getValue)}
              disabled={isOptionDisabled(option.getValue)}
              variant={value && value.isSame(option.getValue(), 'day') ? 'filled' : 'outlined'}
              color={value && value.isSame(option.getValue(), 'day') ? 'primary' : 'default'}
            />
          ))}
        </QuickDateSelect>
      )}
    </DateFieldContainer>
  );
});

export default DateField;