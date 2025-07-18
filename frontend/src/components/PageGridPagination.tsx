import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridRowsProp,
  GridRowParams,
  GridSortModel,
  GridPaginationModel,
  GridLocaleText,
} from '@mui/x-data-grid';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Fade,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  LinearProgress,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  Clear as ClearIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomColumnsButton, CustomFilterButton, CustomDensityButton } from './CustomToolbarComponents';

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Enhanced Custom Toolbar Component
interface CustomToolbarProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  loading?: boolean;
  totalCount?: number;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ 
  onRefresh, 
  onPrint, 
  loading,
  totalCount
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  return (
    <GridToolbarContainer sx={{ 
      padding: '12px 16px',
      borderBottom: '1px solid',
      borderColor: 'divider',
      background: (theme) => alpha(theme.palette.primary.main, 0.02),
      flexWrap: 'wrap',
      gap: 1,
    }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
        <CustomColumnsButton />
        <CustomFilterButton />
        <CustomDensityButton />
        <GridToolbarExport 
          csvOptions={{
            fileName: `export-${new Date().toISOString().split('T')[0]}`,
            utf8WithBom: true,
          }}
          printOptions={{
            hideFooter: true,
            hideToolbar: true,
          }}
        />
        {onRefresh && (
          <Tooltip title={t('refresh')}>
            <span>
              <IconButton 
                onClick={onRefresh} 
                size="small"
                disabled={loading}
                sx={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {onPrint && (
          <Tooltip title={t('print')}>
            <IconButton onClick={onPrint} size="small">
              <PrintIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      
      {totalCount !== undefined && (
        <Chip
          label={`${totalCount} ${t('totalRecords')}`}
          size="small"
          variant="outlined"
          sx={{ ml: 'auto' }}
        />
      )}
    </GridToolbarContainer>
  );
};

// Empty State Component
interface EmptyStateProps {
  message?: string;
  onAdd?: () => void;
  hasSearch?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, onAdd, hasSearch }) => {
  const { t } = useTranslation();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 2,
        p: 3,
      }}
    >
      <InfoIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
      <Typography variant="h6" color="text.secondary" align="center">
        {message || (hasSearch ? t('noSearchResults') : t('noDataAvailable'))}
      </Typography>
      {onAdd && !hasSearch && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ mt: 1 }}
        >
          {t('addFirst')}
        </Button>
      )}
    </Box>
  );
};

// Main PageGridPagination Component Props
export interface PageGridPaginationProps {
  columns: GridColDef[];
  data: GridRowsProp;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showCount?: boolean;
  tableName: string;
  page: number;
  pageSize: number;
  totalCount: number;
  searchText: string;
  changeSort: (sortModel: GridSortModel) => void;
  changePagination: (page: number, pageSize: number) => void;
  onChangeTextField?: (searchText: string) => void;
  onDeleteClicked?: (id: number) => void;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string | null;
  customHeader?: React.ReactNode;
  hideActions?: boolean;
  hideAddButton?: boolean;
  getRowHeight?: any;
  emptyStateMessage?: string;
}

const PageGridPagination: React.FC<PageGridPaginationProps> = observer(({
  columns,
  data,
  title,
  subtitle,
  icon,
  showCount = true,
  tableName,
  page,
  pageSize,
  totalCount,
  searchText: initialSearchText,
  changeSort,
  changePagination,
  onChangeTextField,
  onDeleteClicked,
  onRefresh,
  loading = false,
  error = null,
  customHeader,
  hideActions = false,
  hideAddButton = false,
  getRowHeight,
  emptyStateMessage,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchText, setSearchText] = useState(initialSearchText);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearchText = useDebounce(searchText, 500);

  // Создаем объект локализации
  const localeText: Partial<GridLocaleText> = useMemo(() => ({
    // Основные тексты
    noRowsLabel: t('noRowsLabel'),
    noResultsOverlayLabel: t('noResultsOverlayLabel'),
    
    // Тексты панели инструментов
    toolbarDensity: t('density', 'Плотность'),
    toolbarDensityLabel: t('densityLabel', 'Плотность'),
    toolbarDensityCompact: t('densityCompact', 'Компактная'),
    toolbarDensityStandard: t('densityStandard', 'Стандартная'),
    toolbarDensityComfortable: t('densityComfortable', 'Комфортная'),
    toolbarColumns: t('columns', 'Колонки'),
    toolbarColumnsLabel: t('columnsLabel', 'Выбрать колонки'),
    toolbarFilters: t('filters', 'Фильтры'),
    toolbarFiltersLabel: t('filtersLabel', 'Показать фильтры'),
    toolbarFiltersTooltipHide: t('filtersTooltipHide', 'Скрыть фильтры'),
    toolbarFiltersTooltipShow: t('filtersTooltipShow', 'Показать фильтры'),
    toolbarFiltersTooltipActive: (count) => t('filtersTooltipActive', `${count} активных фильтров`),
    toolbarQuickFilterPlaceholder: t('searchPlaceholder', 'Поиск...'),
    toolbarExport: t('export', 'Экспорт'),
    toolbarExportLabel: t('exportLabel', 'Экспорт'),
    toolbarExportCSV: t('exportCSV', 'Скачать как CSV'),
    toolbarExportPrint: t('print', 'Печать'),
    
    // Тексты меню колонок
    columnMenuLabel: t('columnMenuLabel'),
    columnMenuShowColumns: t('columnMenuShowColumns'),
    columnMenuManageColumns: t('columnMenuManageColumns'),
    columnMenuFilter: t('columnMenuFilter'),
    columnMenuHideColumn: t('columnMenuHideColumn'),
    columnMenuUnsort: t('columnMenuUnsort'),
    columnMenuSortAsc: t('columnMenuSortAsc'),
    columnMenuSortDesc: t('columnMenuSortDesc'),
    
    // Тексты панели колонок
    columnsPanelTextFieldLabel: t('columnsPanelTextFieldLabel', 'Найти колонку'),
    columnsPanelTextFieldPlaceholder: t('columnsPanelTextFieldPlaceholder', 'Название колонки'),
    columnsPanelDragIconLabel: t('columnsPanelDragIconLabel', 'Изменить порядок колонки'),
    columnsPanelShowAllButton: t('columnsPanelShowAllButton', 'Показать все'),
    columnsPanelHideAllButton: t('columnsPanelHideAllButton', 'Скрыть все'),
    
    // Тексты фильтров
    filterPanelAddFilter: t('filterPanelAddFilter', 'Добавить фильтр'),
    filterPanelRemoveAll: t('filterPanelRemoveAll', 'Удалить все'),
    filterPanelDeleteIconLabel: t('filterPanelDeleteIconLabel', 'Удалить'),
    filterPanelLogicOperator: t('filterPanelLogicOperator', 'Логический оператор'),
    filterPanelOperator: t('filterPanelOperator', 'Оператор'),
    filterPanelOperatorAnd: t('filterPanelOperatorAnd', 'И'),
    filterPanelOperatorOr: t('filterPanelOperatorOr', 'Или'),
    filterPanelColumns: t('filterPanelColumns', 'Колонки'),
    filterPanelInputLabel: t('filterPanelInputLabel', 'Значение'),
    filterPanelInputPlaceholder: t('filterPanelInputPlaceholder', 'Значение фильтра'),
    
    // Операторы фильтров
    filterOperatorContains: t('filterOperatorContains', 'содержит'),
    filterOperatorEquals: t('filterOperatorEquals', 'равно'),
    filterOperatorStartsWith: t('filterOperatorStartsWith', 'начинается с'),
    filterOperatorEndsWith: t('filterOperatorEndsWith', 'заканчивается на'),
    filterOperatorIs: t('filterOperatorIs', 'равно'),
    filterOperatorNot: t('filterOperatorNot', 'не равно'),
    filterOperatorAfter: t('filterOperatorAfter', 'после'),
    filterOperatorOnOrAfter: t('filterOperatorOnOrAfter', 'после или равно'),
    filterOperatorBefore: t('filterOperatorBefore', 'до'),
    filterOperatorOnOrBefore: t('filterOperatorOnOrBefore', 'до или равно'),
    filterOperatorIsEmpty: t('filterOperatorIsEmpty', 'пусто'),
    filterOperatorIsNotEmpty: t('filterOperatorIsNotEmpty', 'не пусто'),
    filterOperatorIsAnyOf: t('filterOperatorIsAnyOf', 'любое из'),
    
    // Тексты пагинации
    MuiTablePagination: {
      labelRowsPerPage: t('rowsPerPage'),
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}–${to} ${t('of', 'из')} ${count !== -1 ? count : `${t('moreThan', 'более')} ${to}`}`,
    },
    
    // Тексты футера
    footerRowSelected: (count) => t('footerRowSelected', `${count} строк выбрано`),
    footerTotalRows: t('footerTotalRows', 'Всего строк:'),
    footerTotalVisibleRows: (visibleCount, totalCount) =>
      t('footerTotalVisibleRows', `${visibleCount} из ${totalCount}`),
  }), [t]);

  // Effect for debounced search
  useEffect(() => {
    if (onChangeTextField && debouncedSearchText !== initialSearchText) {
      setIsSearching(true);
      onChangeTextField(debouncedSearchText);
      // Reset searching state after a delay
      const timer = setTimeout(() => setIsSearching(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [debouncedSearchText, onChangeTextField, initialSearchText]);

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteId !== null && onDeleteClicked) {
      onDeleteClicked(deleteId);
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  }, [deleteId, onDeleteClicked]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  }, []);

  // Handle print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Handle search clear
  const handleSearchClear = useCallback(() => {
    setSearchText('');
    if (onChangeTextField) {
      onChangeTextField('');
    }
  }, [onChangeTextField]);

  // Handle pagination change
  const handlePaginationChange = useCallback((model: GridPaginationModel) => {
    changePagination(model.page, model.pageSize);
  }, [changePagination]);

  // Create action columns
  const actionColumns: GridColDef[] = useMemo(() => {
    if (hideActions) return [];
    
    return [{
      field: 'actions',
      type: 'actions',
      headerName: t('actions'),
      width: isMobile ? 100 : 150,
      cellClassName: 'actions',
      getActions: ({ id }: GridRowParams) => {
        const actions = [
          <GridActionsCellItem
            key="edit"
            icon={
              <Tooltip title={t('edit')} placement="top">
                <EditIcon />
              </Tooltip>
            }
            label={t('edit')}
            className="textPrimary"
            data-testid={`${tableName}EditButton`}
            onClick={() => navigate(`/user/${tableName}/addedit?id=${id}`)}
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          />,
        ];

        if (onDeleteClicked) {
          actions.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title={t('delete')} placement="top">
                  <DeleteIcon />
                </Tooltip>
              }
              label={t('delete')}
              data-testid={`${tableName}DeleteButton`}
              onClick={() => handleDeleteClick(id as number)}
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            />
          );
        }

        return actions;
      },
    }];
  }, [hideActions, isMobile, t, tableName, navigate, onDeleteClicked, handleDeleteClick, theme]);

  // Combine columns
  const allColumns = useMemo(() => {
    return [...actionColumns, ...columns];
  }, [actionColumns, columns]);

  const hasSearch = Boolean(onChangeTextField);
  const isDataEmpty = data.length === 0;
  const showEmptyState = isDataEmpty && !loading;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '100%',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          background: theme.palette.background.paper,
          transition: 'box-shadow 0.3s ease-in-out',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          mb: 3,
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        {/* Loading overlay */}
        {isSearching && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              zIndex: 1200 
            }} 
          />
        )}

        {/* Header */}
        {customHeader || (
          <>
            <Box
              sx={{
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                background: (theme) => alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', sm: 'center' }}
                spacing={2}
              >
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {icon}
                    <Box>
                      <Typography 
                        variant="h5" 
                        component="h1"
                        data-testid={`${tableName}HeaderTitle`}
                        sx={{ fontWeight: 600 }}
                      >
                        {title}
                      </Typography>
                      {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                          {subtitle}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                  {showCount && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={`${t('showing')} ${data.length} ${t('of')} ${totalCount}`}
                        size="small"
                        data-testid={`${tableName}itemCount`}
                      />
                      {page > 0 && (
                        <Chip
                          label={`${t('page')} ${page + 1}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  )}
                </Box>
                
                {!hideAddButton && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/user/${tableName}/addedit?id=0`)}
                    data-testid={`${tableName}AddButton`}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      boxShadow: theme.shadows[2],
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {t('add')}
                  </Button>
                )}
              </Stack>
            </Box>
            
            {/* Search Bar */}
            {onChangeTextField && (
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder={t('searchPlaceholder')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onChangeTextField(searchText);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchText && (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small" 
                          onClick={handleSearchClear}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: { xs: '100%', sm: 300 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ m: 2 }}
            action={
              onRefresh && (
                <Button color="inherit" size="small" onClick={onRefresh}>
                  {t('retry')}
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}

        {/* DataGrid or Empty State */}
        <Box sx={{ 
          width: '100%', 
          position: 'relative',
          flex: 1,
          minHeight: 400,
          overflow: 'auto',
        }}>
          {showEmptyState ? (
            <EmptyState 
              message={emptyStateMessage}
              onAdd={!hideAddButton ? (() => navigate(`/user/${tableName}/addedit?id=0`)) : undefined}
              hasSearch={hasSearch && Boolean(searchText)}
            />
          ) : (
            <DataGrid
              rows={data}
              columns={allColumns}
              data-testid={`${tableName}Table`}
              autoHeight
              pageSizeOptions={[10, 25, 50, 100]}
              paginationMode="server"
              sortingMode="server"
              filterMode="server"
              rowCount={totalCount}
              loading={loading}
              paginationModel={{ page, pageSize }}
              onPaginationModelChange={handlePaginationChange}
              onSortModelChange={changeSort}
              checkboxSelection={false}
              disableRowSelectionOnClick
              getRowHeight={getRowHeight || (() => 'auto')}
              localeText={localeText}
              slots={{
                toolbar: CustomToolbar,
                loadingOverlay: () => (
                  <Stack alignItems="center" justifyContent="center" height="100%">
                    <CircularProgress />
                  </Stack>
                ),
              }}
              slotProps={{
                toolbar: {
                  onRefresh,
                  onPrint: handlePrint,
                  loading,
                  totalCount,
                },
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-main': {
                  overflow: 'unset',
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'auto',
                },
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  lineHeight: '1.5',
                  py: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                },
                '& .MuiDataGrid-row': {
                  maxWidth: '100%',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    cursor: 'pointer',
                  },
                  transition: 'background-color 0.2s ease-in-out',
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                  backgroundColor: alpha(theme.palette.grey[500], 0.02),
                },
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                },
                '& .MuiDataGrid-columnHeader': {
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '2px solid',
                  borderColor: 'divider',
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  position: 'sticky',
                  bottom: 0,
                },
                '& .MuiTablePagination-root': {
                  color: theme.palette.text.primary,
                },
                // Стили для позиционирования выпадающих панелей
                '& .MuiDataGrid-toolbarContainer': {
                  position: 'relative',
                },
                '& .MuiDataGrid-panel': {
                  position: 'absolute !important',
                  top: 'calc(100% + 8px) !important',
                  left: 'auto !important',
                  right: '0 !important',
                  maxWidth: 'calc(100vw - 32px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {t('confirmDelete')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('deleteConfirmationMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ borderRadius: 1.5 }}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: 1.5 }}
            autoFocus
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default PageGridPagination;