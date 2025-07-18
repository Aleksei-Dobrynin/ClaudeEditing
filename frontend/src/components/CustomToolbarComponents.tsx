import React, { useState, useRef, useEffect } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Checkbox,
  TextField,
  Box,
  Typography,
  Divider,
  Button,
  Stack,
  Select,
  InputLabel,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  InputAdornment,
  Chip,
  alpha,
  useTheme,
  ClickAwayListener,
  Grow,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  DensityMedium as DensityIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { 
  useGridApiContext,
  GridDensity,
  GridLogicOperator,
  gridColumnVisibilityModelSelector,
  gridFilterModelSelector,
  gridDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useGridSelector } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { exportToExcel } from './ExcelExportUtils';

// Кастомная кнопка выбора колонок с улучшенным дизайном
export const CustomColumnsButton: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);

  const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchText('');
  };

  // Фокус на поле поиска при открытии
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const columns = apiRef.current.getAllColumns();
  
  const handleColumnToggle = (field: string) => {
    const newModel = {
      ...columnVisibilityModel,
      [field]: columnVisibilityModel[field] === false ? true : false,
    };
    apiRef.current.setColumnVisibilityModel(newModel);
  };

  const handleToggleAll = (show: boolean) => {
    const newModel: any = {};
    columns.forEach((col) => {
      if (col.field !== 'actions' && col.field !== '__check__') {
        newModel[col.field] = show;
      }
    });
    apiRef.current.setColumnVisibilityModel(newModel);
  };

  const filteredColumns = columns.filter((col) => 
    col.field !== 'actions' && 
    col.field !== '__check__' &&
    (searchText === '' || 
     col.headerName?.toLowerCase().includes(searchText.toLowerCase()) ||
     col.field.toLowerCase().includes(searchText.toLowerCase()))
  );

  const visibleCount = columns.filter(
    (col) => columnVisibilityModel[col.field] !== false && col.field !== 'actions'
  ).length;

  return (
    <>
      <Button
        size="small"
        variant="text"
        startIcon={<ViewColumnIcon fontSize="small" />}
        onClick={handleClick}
        sx={{
          color: 'text.secondary',
          textTransform: 'none',
          fontSize: '0.875rem',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
          },
        }}
      >
        {t('columns', 'Колонки')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 280,
            maxHeight: 400,
            borderRadius: 2,
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {t('manageColumns', 'Управление колонками')}
          </Typography>
          <TextField
            ref={searchInputRef}
            size="small"
            fullWidth
            placeholder={t('searchColumns', 'Поиск колонок...')}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchText('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 1.5 },
            }}
          />
        </Box>
        <Box sx={{ px: 2, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {t('visibleColumns', 'Видимых колонок')}: {visibleCount}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <Button
                size="small"
                variant="text"
                onClick={() => handleToggleAll(true)}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                {t('showAll', 'Показать все')}
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={() => handleToggleAll(false)}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                {t('hideAll', 'Скрыть все')}
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Divider />
        <List sx={{ py: 0.5, maxHeight: 250, overflow: 'auto' }}>
          {filteredColumns.map((column) => {
            const isVisible = columnVisibilityModel[column.field] !== false;
            return (
              <ListItem
                key={column.field}
                dense
                button
                onClick={() => handleColumnToggle(column.field)}
                sx={{
                  py: 0.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Checkbox
                    edge="start"
                    checked={isVisible}
                    tabIndex={-1}
                    disableRipple
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={column.headerName || column.field}
                  primaryTypographyProps={{
                    variant: 'body2',
                    noWrap: true,
                  }}
                />
                <IconButton size="small" sx={{ ml: 1 }}>
                  {isVisible ? (
                    <VisibilityIcon fontSize="small" />
                  ) : (
                    <VisibilityOffIcon fontSize="small" />
                  )}
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </Menu>
    </>
  );
};

// Кастомная кнопка фильтров с расширенным функционалом
export const CustomFilterButton: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const activeFiltersCount = filterModel?.items?.length || 0;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = apiRef.current.getAllColumns().filter(
    (col) => col.filterable !== false && col.field !== 'actions'
  );

  const handleAddFilter = () => {
    const newFilter = {
      id: Date.now(),
      field: columns[0]?.field || '',
      operator: 'contains',
      value: '',
    };
    
    apiRef.current.setFilterModel({
      ...filterModel,
      items: [...(filterModel?.items || []), newFilter],
    });
  };

  const handleRemoveFilter = (id: number) => {
    apiRef.current.setFilterModel({
      ...filterModel,
      items: filterModel?.items?.filter((item: any) => item.id !== id) || [],
    });
  };

  const handleFilterChange = (id: number, property: string, value: any) => {
    const newItems = (filterModel?.items || []).map((item: any) =>
      item.id === id ? { ...item, [property]: value } : item
    );
    
    apiRef.current.setFilterModel({
      ...filterModel,
      items: newItems,
    });
  };

  const handleClearFilters = () => {
    apiRef.current.setFilterModel({ items: [] });
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Button
          size="small"
          variant="text"
          startIcon={<FilterListIcon fontSize="small" />}
          onClick={handleClick}
          sx={{
            color: activeFiltersCount > 0 ? 'primary.main' : 'text.secondary',
            textTransform: 'none',
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            },
          }}
        >
          {t('filters', 'Фильтры')}
        </Button>
        {activeFiltersCount > 0 && (
          <Chip
            size="small"
            label={activeFiltersCount}
            color="primary"
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              height: 18,
              minWidth: 18,
              fontSize: '0.625rem',
            }}
          />
        )}
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 360,
            maxWidth: 420,
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('filterData', 'Фильтрация данных')}
            </Typography>
            {activeFiltersCount > 0 && (
              <Button
                size="small"
                color="error"
                onClick={handleClearFilters}
                startIcon={<ClearIcon fontSize="small" />}
              >
                {t('clearAll', 'Очистить')}
              </Button>
            )}
          </Stack>

          {filterModel?.items?.length === 0 && (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <FilterListIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2">
                {t('noActiveFilters', 'Нет активных фильтров')}
              </Typography>
            </Box>
          )}

          <Stack spacing={2}>
            {filterModel?.items?.map((filter: any, index: number) => (
              <Paper
                key={filter.id}
                variant="outlined"
                sx={{ p: 2, borderRadius: 1.5 }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <InputLabel>{t('column', 'Колонка')}</InputLabel>
                      <Select
                        value={filter.field}
                        label={t('column', 'Колонка')}
                        onChange={(e) => handleFilterChange(filter.id, 'field', e.target.value)}
                        sx={{ borderRadius: 1.5 }}
                      >
                        {columns.map((col) => (
                          <MenuItem key={col.field} value={col.field}>
                            {col.headerName || col.field}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFilter(filter.id)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  
                  <Stack direction="row" spacing={1}>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <InputLabel>{t('operator', 'Условие')}</InputLabel>
                      <Select
                        value={filter.operator}
                        label={t('operator', 'Условие')}
                        onChange={(e) => handleFilterChange(filter.id, 'operator', e.target.value)}
                        sx={{ borderRadius: 1.5 }}
                      >
                        <MenuItem value="contains">{t('contains', 'содержит')}</MenuItem>
                        <MenuItem value="equals">{t('equals', 'равно')}</MenuItem>
                        <MenuItem value="startsWith">{t('startsWith', 'начинается с')}</MenuItem>
                        <MenuItem value="endsWith">{t('endsWith', 'заканчивается на')}</MenuItem>
                        <MenuItem value="isEmpty">{t('isEmpty', 'пусто')}</MenuItem>
                        <MenuItem value="isNotEmpty">{t('isNotEmpty', 'не пусто')}</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      placeholder={t('value', 'Значение')}
                      value={filter.value || ''}
                      onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
                      sx={{ flex: 1 }}
                      InputProps={{
                        sx: { borderRadius: 1.5 },
                      }}
                      disabled={filter.operator === 'isEmpty' || filter.operator === 'isNotEmpty'}
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddFilter}
              sx={{
                borderStyle: 'dashed',
                borderRadius: 1.5,
                '&:hover': {
                  borderStyle: 'dashed',
                },
              }}
            >
              {t('addFilter', 'Добавить фильтр')}
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

// Кастомная кнопка плотности с визуальным отображением
export const CustomDensityButton: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const density = useGridSelector(apiRef, gridDensitySelector);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDensityChange = (newDensity: GridDensity) => {
    apiRef.current.setDensity(newDensity);
    handleClose();
  };

  const densities: { value: GridDensity; label: string; icon: React.ReactNode }[] = [
    {
      value: 'compact',
      label: t('compact', 'Компактный'),
      icon: <Box sx={{ '& > div': { height: 2, bgcolor: 'currentColor', my: 0.5 } }}><div/><div/><div/></Box>,
    },
    {
      value: 'standard',
      label: t('standard', 'Стандартный'),
      icon: <Box sx={{ '& > div': { height: 3, bgcolor: 'currentColor', my: 0.5 } }}><div/><div/><div/></Box>,
    },
    {
      value: 'comfortable',
      label: t('comfortable', 'Комфортный'),
      icon: <Box sx={{ '& > div': { height: 4, bgcolor: 'currentColor', my: 0.5 } }}><div/><div/><div/></Box>,
    },
  ];

  return (
    <>
      <Button
        size="small"
        variant="text"
        startIcon={<DensityIcon fontSize="small" />}
        onClick={handleClick}
        sx={{
          color: 'text.secondary',
          textTransform: 'none',
          fontSize: '0.875rem',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
          },
        }}
      >
        {t('density', 'Плотность')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            borderRadius: 2,
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, px: 1, py: 0.5 }}>
            {t('selectDensity', 'Выберите плотность')}
          </Typography>
        </Box>
        <Divider />
        {densities.map((option) => (
          <MenuItem
            key={option.value}
            selected={density === option.value}
            onClick={() => handleDensityChange(option.value)}
            sx={{
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Box sx={{ width: 20, color: density === option.value ? 'primary.main' : 'text.secondary' }}>
                {option.icon}
              </Box>
            </ListItemIcon>
            <ListItemText primary={option.label} />
            {density === option.value && (
              <CheckIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// Кастомная кнопка экспорта в Excel
interface CustomExportButtonProps {
  data: any[];
  columns: any[];
  fileName?: string;
}

export const CustomExportButton: React.FC<CustomExportButtonProps> = ({ 
  data, 
  columns, 
  fileName 
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleExcelExport = () => {
    exportToExcel({
      data,
      columns,
      fileName: fileName || `export_${new Date().toISOString().split('T')[0]}`,
    });
  };

  return (
    <Button
      size="small"
      variant="text"
      startIcon={<DownloadIcon fontSize="small" />}
      onClick={handleExcelExport}
      sx={{
        color: 'text.secondary',
        textTransform: 'none',
        fontSize: '0.875rem',
        '&:hover': {
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: 'success.main',
        },
      }}
    >
      {t('exportToExcel', 'Экспорт в Excel')}
    </Button>
  );
};

// Компонент для быстрого поиска с локализацией и улучшенным дизайном
export const CustomQuickFilter: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  return (
    <GridToolbarQuickFilter 
      quickFilterParser={(searchInput: string) =>
        searchInput
          .split(',')
          .map((value) => value.trim())
          .filter((value) => value !== '')
      }
      debounceMs={200}
      placeholder={t('searchPlaceholder', 'Поиск...')}
      sx={{
        width: { xs: '100%', sm: 300 },
        '& .MuiInputBase-root': {
          fontSize: '0.875rem',
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 2,
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.background.paper,
          },
          '&.Mui-focused': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        },
        '& .MuiInputBase-input': {
          padding: '8px 12px',
          '&::placeholder': {
            opacity: 0.7,
          },
        },
        '& .MuiSvgIcon-root': {
          color: theme.palette.primary.main,
        },
      }}
    />
  );
};