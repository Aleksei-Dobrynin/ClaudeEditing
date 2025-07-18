import React, { useState, useCallback, useMemo } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  GetApp as DownloadIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomColumnsButton, CustomFilterButton, CustomDensityButton } from './CustomToolbarComponents';

// Custom Toolbar Component
interface CustomToolbarProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  loading?: boolean;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ onRefresh, onPrint, loading }) => {
  const { t } = useTranslation();
  
  return (
    <GridToolbarContainer sx={{ 
      padding: '8px 16px',
      borderBottom: '1px solid',
      borderColor: 'divider',
      background: (theme) => alpha(theme.palette.primary.main, 0.02),
      gap: 1,
      flexWrap: 'wrap',
    }}>
      <GridToolbarQuickFilter 
        quickFilterParser={(searchInput: string) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
        debounceMs={200}
        sx={{ mr: 2 }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <CustomColumnsButton />
      <CustomFilterButton />
      <CustomDensityButton />
      <GridToolbarExport 
        csvOptions={{
          fileName: `export-${new Date().toISOString().split('T')[0]}`,
          utf8WithBom: true,
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
    </GridToolbarContainer>
  );
};

// Empty State Component
interface EmptyStateProps {
  message?: string;
  onAdd?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, onAdd }) => {
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
      }}
    >
      <InfoIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
      <Typography variant="h5" color="text.secondary">
        {message || t('noDataAvailable')}
      </Typography>
      {onAdd && (
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

// Main PageGrid Component Props
export interface PageGridProps {
  columns: GridColDef[];
  data: GridRowsProp;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showCount?: boolean;
  tableName: string;
  onDeleteClicked?: (id: number) => void;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string | null;
  hideActions?: boolean;
  hideAddButton?: boolean;
  addButtonClick?: () => void;
  customHeader?: React.ReactNode;
  customBottom?: React.ReactNode;
  pageSize?: number;
  getRowHeight?: any;
  emptyStateMessage?: string;
  // Additional props for backward compatibility
  isInLineHeader?: boolean;
  hideTitle?: boolean;
  // hustomHeader?: React.ReactNode; // Note: original typo preserved for compatibility
  hideDeleteButton?: boolean;
  hideEditButton?: boolean;
  customActionButton?: (id: number) => React.ReactNode;
  customEditClick?: (id: number) => void;
}

const PageGrid: React.FC<PageGridProps> = observer(({
  columns,
  data,
  title,
  subtitle,
  icon,
  showCount = true,
  tableName,
  onDeleteClicked,
  onRefresh,
  loading = false,
  error = null,
  hideActions = false,
  hideAddButton = false,
  addButtonClick,
  customHeader,
  customBottom,
  pageSize = 10,
  getRowHeight,
  emptyStateMessage,
  // Backward compatibility props
  isInLineHeader = false,
  hideTitle = false,
  // hustomHeader,
  hideDeleteButton = false,
  hideEditButton = false,
  customActionButton,
  customEditClick,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
        const actions = [];
        
        if (!hideEditButton) {
          actions.push(
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
              onClick={() => customEditClick ? customEditClick(id as number) : navigate(`/user/${tableName}/addedit?id=${id}`)}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            />
          );
        }

        if (!hideDeleteButton && onDeleteClicked) {
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
        
        if (customActionButton) {
          actions.push(customActionButton(id as number));
        }

        return actions;
      },
    }];
  }, [hideActions, isMobile, t, tableName, navigate, onDeleteClicked, handleDeleteClick, theme, hideEditButton, hideDeleteButton, customActionButton, customEditClick]);

  // Combine columns
  const allColumns = useMemo(() => {
    return [...actionColumns, ...columns];
  }, [actionColumns, columns]);

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
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          mb: 3,
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        {/* Header */}
        {customHeader || (
          <>
            {!hideTitle && (
              <Box
                sx={{
                  p: 3,
                  pb: 2,
                  borderBottom: !isInLineHeader ? '1px solid' : 'none',
                  borderColor: 'divider',
                  background: (theme) => alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <Typography 
                  variant="h4" 
                  component="h1"
                  data-testid={`${tableName}HeaderTitle`}
                  sx={{ fontWeight: 800 }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {subtitle}
                  </Typography>
                )}
                {showCount && data.length > 0 && (
                  <Chip
                    label={`${data.length} ${t('records')}`}
                    size="small"
                    sx={{ mt: 1 }}
                    data-testid={`${tableName}itemCount`}
                  />
                )}
              </Box>
            )}
            
            <Box
              sx={isInLineHeader ? {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              } : { p: 2 }}
            >
              {!hideAddButton && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addButtonClick || (() => navigate(`/user/${tableName}/addedit?id=0`))}
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
              {/* {hustomHeader} */}
            </Box>
          </>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ m: 2 }}
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
          {loading ? (
            <Box sx={{ p: 2 }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={52}
                  sx={{ mb: 1, borderRadius: 1 }}
                />
              ))}
            </Box>
          ) : data.length === 0 ? (
            <EmptyState 
              message={emptyStateMessage}
              onAdd={!hideAddButton ? (addButtonClick || (() => navigate(`/user/${tableName}/addedit?id=0`))) : undefined}
            />
          ) : (
            <DataGrid
              rows={data}
              style={forcePageSize ? { height: '100%' } }
              columns={allColumns}
              data-testid={`${tableName}Table`}
              autoHeight
              initialState={{
                pagination: { paginationModel: { pageSize: pageSize } },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              editMode="row"
              checkboxSelection={false}
              disableRowSelectionOnClick
              getRowHeight={getRowHeight || (() => 'auto')}
              loading={loading}
              localeText={localeText}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: {
                  onRefresh,
                  onPrint: handlePrint,
                  loading,
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
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '2px solid',
                  borderColor: 'divider',
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: theme.palette.background.paper,
                },
                '& .MuiDataGrid-columnHeader': {
                  whiteSpace: 'normal',
                  lineHeight: '1.2',
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

        {/* Custom Bottom */}
        {customBottom && (
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            {customBottom}
          </Box>
        )}
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

export default PageGrid;