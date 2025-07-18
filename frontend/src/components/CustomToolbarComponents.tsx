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
} from '@mui/icons-material';
import { 
  useGridApiContext,
  GridDensity,
  GridLogicOperator,
  gridColumnVisibilityModelSelector,
  gridFilterModelSelector,
  gridDensitySelector
} from '@mui/x-data-grid';
import { useGridSelector } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

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
      [field]: columnVisibilityModel[field] === false ? true : false
    };
    apiRef.current.setColumnVisibilityModel(newModel);
  };

  const handleShowAll = () => {
    const newModel: Record<string, boolean> = {};
    columns.forEach((column) => {
      if (column.field !== '__check__' && column.field !== 'actions') {
        newModel[column.field] = true;
      }
    });
    apiRef.current.setColumnVisibilityModel(newModel);
  };

  const handleHideAll = () => {
    const newModel: Record<string, boolean> = {};
    columns.forEach((column) => {
      if (column.field !== '__check__' && column.field !== 'actions') {
        newModel[column.field] = false;
      }
    });
    apiRef.current.setColumnVisibilityModel(newModel);
  };

  const filteredColumns = columns.filter(column => 
    column.field !== '__check__' &&
    (searchText === '' || 
     column.headerName?.toLowerCase().includes(searchText.toLowerCase()) ||
     column.field.toLowerCase().includes(searchText.toLowerCase()))
  );

  const visibleCount = columns.filter(col => 
    col.field !== '__check__' && columnVisibilityModel[col.field] !== false
  ).length;

  return (
    <>
      <Tooltip title={t('columnsLabel', 'Выбрать колонки')}>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-label={t('columnsLabel', 'Выбрать колонки')}
          sx={{
            color: open ? 'primary.main' : 'action.active',
            bgcolor: open ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <ViewColumnIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
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
          sx: { 
            width: 320, 
            maxHeight: 480,
            mt: 1,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
        // Предотвращаем закрытие при клике внутри
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleClose();
          }
          e.stopPropagation();
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {t('columns', 'Колонки')}
          </Typography>
          <TextField
            inputRef={searchInputRef}
            size="small"
            placeholder={t('columnsPanelTextFieldPlaceholder', 'Поиск колонки...')}
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchText('')}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Chip 
              label={`${visibleCount} / ${columns.length - 1} ${t('visible', 'видимых')}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Stack direction="row" spacing={1}>
              <Button 
                size="small" 
                onClick={handleShowAll}
                sx={{ minWidth: 'auto' }}
              >
                {t('all', 'Все')}
              </Button>
              <Button 
                size="small" 
                onClick={handleHideAll}
                sx={{ minWidth: 'auto' }}
              >
                {t('none', 'Скрыть')}
              </Button>
            </Stack>
          </Stack>
        </Box>
        
        <Divider />
        
        <List 
          sx={{ 
            py: 0,
            maxHeight: 320,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: alpha(theme.palette.action.hover, 0.1),
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha(theme.palette.action.active, 0.3),
              borderRadius: 4,
              '&:hover': {
                bgcolor: alpha(theme.palette.action.active, 0.5),
              },
            },
          }}
        >
          {filteredColumns.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary={t('noResults', 'Ничего не найдено')}
                primaryTypographyProps={{
                  color: 'text.secondary',
                  align: 'center'
                }}
              />
            </ListItem>
          ) : (
            filteredColumns.map((column) => {
              const isVisible = columnVisibilityModel[column.field] !== false;
              return (
                <ListItem
                  key={column.field}
                  dense
                  button
                  onClick={() => handleColumnToggle(column.field)}
                  sx={{
                    py: 1,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={isVisible}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                      sx={{
                        color: theme.palette.action.active,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={column.headerName || column.field}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isVisible ? 500 : 400,
                    }}
                  />
                  <ListItemIcon sx={{ minWidth: 'auto', opacity: isVisible ? 1 : 0.3 }}>
                    {isVisible ? (
                      <VisibilityIcon fontSize="small" color="action" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" color="action" />
                    )}
                  </ListItemIcon>
                </ListItem>
              );
            })
          )}
        </List>
      </Menu>
    </>
  );
};

// Кастомная кнопка фильтров с улучшенным дизайном
export const CustomFilterButton: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [filters, setFilters] = useState<any[]>([]);

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // Получаем текущие фильтры с уникальными ID
    const currentFilters = filterModel?.items || [];
    setFilters(currentFilters.map((f, idx) => ({ ...f, id: f.id || `filter-${idx}` })));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = apiRef.current.getAllColumns().filter(col => col.filterable !== false);

  const handleAddFilter = () => {
    const newFilter = {
      id: `filter-${Date.now()}`,
      field: columns[0]?.field || '',
      operator: 'contains',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const handleFilterChange = (id: string, field: string, value: any) => {
    setFilters(filters.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleApply = () => {
    const validFilters = filters.filter(f => 
      f.field && (f.operator === 'isEmpty' || f.operator === 'isNotEmpty' || f.value)
    );
    apiRef.current.setFilterModel({
      items: validFilters,
      logicOperator: GridLogicOperator.And,
    });
    handleClose();
  };

  const handleClear = () => {
    setFilters([]);
    apiRef.current.setFilterModel({ items: [] });
  };

  const activeFiltersCount = filterModel?.items?.length || 0;

  return (
    <>
      <Tooltip title={t('filtersLabel', 'Фильтры')}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-label={t('filtersLabel', 'Фильтры')}
            sx={{
              color: activeFiltersCount > 0 ? 'primary.main' : 'action.active',
              bgcolor: activeFiltersCount > 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
          {activeFiltersCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                minWidth: 20,
                height: 20,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '10px',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 0.5,
                boxShadow: theme.shadows[2],
              }}
            >
              {activeFiltersCount}
            </Box>
          )}
        </Box>
      </Tooltip>
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
          sx: {
            mt: 1,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <Paper sx={{ width: 420, maxHeight: 600, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                {t('filters', 'Фильтры')}
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddFilter}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                {t('addFilter', 'Добавить')}
              </Button>
            </Stack>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            bgcolor: alpha(theme.palette.action.hover, 0.04),
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: alpha(theme.palette.action.hover, 0.1),
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha(theme.palette.action.active, 0.3),
              borderRadius: 4,
              '&:hover': {
                bgcolor: alpha(theme.palette.action.active, 0.5),
              },
            },
          }}>
            {filters.length === 0 ? (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: `2px dashed ${theme.palette.divider}`,
                }}
              >
                <FilterListIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {t('noFilters', 'Нет активных фильтров')}
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddFilter}
                  sx={{ mt: 2 }}
                >
                  {t('addFirstFilter', 'Добавить первый фильтр')}
                </Button>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {filters.map((filter) => (
                  <Paper 
                    key={filter.id} 
                    sx={{ 
                      p: 2,
                      bgcolor: 'background.paper',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: theme.shadows[2],
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Stack spacing={2}>
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
                        
                        {filter.operator !== 'isEmpty' && filter.operator !== 'isNotEmpty' && (
                          <TextField
                            size="small"
                            sx={{ flex: 1 }}
                            placeholder={t('value', 'Значение')}
                            value={filter.value || ''}
                            onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (e.key === 'Enter') {
                                handleApply();
                              }
                            }}
                            InputProps={{
                              sx: { borderRadius: 1.5 }
                            }}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
          
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button 
                onClick={handleClear} 
                disabled={filters.length === 0}
                sx={{ borderRadius: 1.5 }}
              >
                {t('clearAll', 'Очистить')}
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApply}
                sx={{ borderRadius: 1.5 }}
                startIcon={<CheckIcon />}
              >
                {t('apply', 'Применить')}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

// Кастомная кнопка плотности с улучшенным дизайном
export const CustomDensityButton: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentDensity = useGridSelector(apiRef, gridDensitySelector);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDensityChange = (density: GridDensity) => {
    apiRef.current.setDensity(density);
    handleClose();
  };

  const densityOptions = [
    { value: 'compact', label: t('densityCompact', 'Компактная'), icon: '═' },
    { value: 'standard', label: t('densityStandard', 'Стандартная'), icon: '≡' },
    { value: 'comfortable', label: t('densityComfortable', 'Комфортная'), icon: '☰' },
  ];

  return (
    <>
      <Tooltip title={t('densityLabel', 'Плотность')}>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-label={t('densityLabel', 'Плотность')}
          sx={{
            color: open ? 'primary.main' : 'action.active',
            bgcolor: open ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <DensityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
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
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        {densityOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={currentDensity === option.value}
            onClick={() => handleDensityChange(option.value as GridDensity)}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.18),
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, fontSize: 20 }}>
              {option.icon}
            </ListItemIcon>
            <ListItemText 
              primary={option.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: currentDensity === option.value ? 600 : 400,
              }}
            />
            {currentDensity === option.value && (
              <CheckIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};