import React, { useState, useCallback, useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowsProp,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridLocaleText,
} from '@mui/x-data-grid';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
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
  Zoom,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { CustomColumnsButton, CustomFilterButton, CustomDensityButton } from './CustomToolbarComponents';

// Custom Toolbar для Popup с правильным позиционированием
interface PopupToolbarProps {
  onRefresh?: () => void;
  loading?: boolean;
}

const PopupToolbar: React.FC<PopupToolbarProps> = ({ onRefresh, loading }) => {
  const { t } = useTranslation();
  
  return (
    <GridToolbarContainer sx={{ 
      padding: '8px 16px',
      borderBottom: '1px solid',
      borderColor: 'divider',
      background: (theme) => alpha(theme.palette.primary.main, 0.02),
    }}>
      <CustomColumnsButton />
      <CustomFilterButton />
      <CustomDensityButton />
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
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter 
        quickFilterParser={(searchInput: string) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
        debounceMs={200}
      />
    </GridToolbarContainer>
  );
};

// Empty State Component
interface EmptyStateProps {
  message?: string;
  onAdd?: () => void;
  compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, onAdd, compact = false }) => {
  const { t } = useTranslation();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: compact ? 250 : 350,
        gap: 2,
        p: 3,
      }}
    >
      <InfoIcon sx={{ fontSize: compact ? 48 : 64, color: 'text.secondary', opacity: 0.5 }} />
      <Typography variant={compact ? "body1" : "h6"} color="text.secondary" align="center">
        {message || t('noDataAvailable')}
      </Typography>
      {onAdd && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          size={compact ? "small" : "medium"}
          sx={{ mt: 1 }}
        >
          {t('addFirst')}
        </Button>
      )}
    </Box>
  );
};

// Main PopupGrid Component Props
export interface PopupGridProps {
  columns: GridColDef[];
  data: GridRowsProp;
  title?: string;
  icon?: React.ReactNode;
  showCount?: boolean;
  tableName: string;
  onDeleteClicked?: (id: number) => void;
  onEditClicked?: (id: number) => void;
  onAddClicked?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string | null;
  hideActions?: boolean;
  hideAddButton?: boolean;
  pageSize?: number;
  height?: number | string;
  compact?: boolean;
  emptyStateMessage?: string;
  // Additional props for backward compatibility
  hideEditButton?: boolean;
  hideDeleteButton?: boolean;
  customActionButton?: (id: number) => React.ReactNode;
  customBottom?: React.ReactNode;
  hideTitle?: boolean;
  canEdit?: (row: any) => boolean;
  canDelete?: (row: any) => boolean;
  checkbox?: React.ReactNode;
}

const PopupGrid: React.FC<PopupGridProps> = observer(({
  columns,
  data,
  title,
  icon,
  showCount = true,
  tableName,
  onDeleteClicked,
  onEditClicked,
  onAddClicked,
  onRefresh,
  loading = false,
  error = null,
  hideActions = false,
  hideAddButton = false,
  pageSize = 5,
  height = 400,
  compact = false,
  emptyStateMessage,
  // Backward compatibility props
  hideEditButton = false,
  hideDeleteButton = false,
  customActionButton,
  customBottom,
  hideTitle = false,
  canEdit,
  canDelete,
  checkbox,
}) => {
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

  // Create action columns
  const actionColumns: GridColDef[] = useMemo(() => {
    if (hideActions) return [];
    
    return [{
      field: 'actions',
      type: 'actions',
      headerName: t('actions'),
      width: compact ? 80 : 120,
      cellClassName: 'actions',
      getActions: ({ id, row }: GridRowParams) => {
        const canEditRow = canEdit ? canEdit(row) : true;
        const canDeleteRow = canDelete ? canDelete(row) : true;
        const actions = [];

        if (canEditRow && !hideEditButton && onEditClicked) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title={t('edit')} placement="top">
                  <EditIcon fontSize={compact ? "small" : "medium"} />
                </Tooltip>
              }
              label={t('edit')}
              className="textPrimary"
              data-testid={`${tableName}EditButton`}
              onClick={() => onEditClicked(id as number)}
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

        if (canDeleteRow && !hideDeleteButton && onDeleteClicked) {
          actions.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title={t('delete')} placement="top">
                  <DeleteIcon fontSize={compact ? "small" : "medium"} />
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
  }, [hideActions, compact, t, tableName, onEditClicked, onDeleteClicked, handleDeleteClick, theme, canEdit, canDelete, hideEditButton, hideDeleteButton, customActionButton]);

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
          borderRadius: compact ? 1 : 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          background: theme.palette.background.paper,
          transition: 'all 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: theme.shadows[2],
          },
        }}
      >
        {/* Header */}
        {!hideTitle && (
          <Box
            sx={{
              p: compact ? 2 : 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              background: (theme) => alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                {icon}
                <Typography 
                  variant={compact ? "h6" : "h5"} 
                  component="h2"
                  data-testid={`${tableName}HeaderTitle`}
                  sx={{ fontWeight: 600 }}
                  noWrap
                >
                  {title}
                </Typography>
                {showCount && data.length > 0 && (
                  <Chip
                    label={data.length}
                    size="small"
                    sx={{ ml: 1 }}
                    data-testid={`${tableName}itemCount`}
                  />
                )}
              </Stack>
              
              {checkbox && (
                <Box sx={{ ml: 'auto' }}>
                  {checkbox}
                </Box>
              )}
              
              {!hideAddButton && onEditClicked && (
                <Tooltip title={t('add')}>
                  <IconButton
                    color="primary"
                    onClick={() => onEditClicked(0)}
                    data-testid={`${tableName}AddButton`}
                    size={compact ? "small" : "medium"}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <AddIcon fontSize={compact ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>
        )}
        
        {/* Custom Bottom - placed after header, before grid */}
        {customBottom && (
          <Box sx={{ p: 2 }}>
            {customBottom}
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ m: 2, borderRadius: 1 }}
          >
            {error}
          </Alert>
        )}

        {/* DataGrid or Empty State */}
        <Box sx={{ 
          width: '100%', 
          height, 
          position: 'relative',
          overflow: 'auto',
        }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              {[...Array(compact ? 3 : 5)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={compact ? 40 : 52}
                  sx={{ mb: 1, borderRadius: 1 }}
                  animation="wave"
                />
              ))}
            </Box>
          ) : data.length === 0 ? (
            <EmptyState 
              message={emptyStateMessage}
              onAdd={!hideAddButton && onEditClicked ? () => onEditClicked(0) : undefined}
              compact={compact}
            />
          ) : (
            <DataGrid
              rows={data}
              columns={allColumns}
              data-testid={`${tableName}Table`}
              autoHeight={false}
              initialState={{
                pagination: { paginationModel: { pageSize: pageSize } },
              }}
              pageSizeOptions={compact ? [5, 10] : [5, 10, 25]}
              editMode="row"
              checkboxSelection={false}
              disableRowSelectionOnClick
              loading={loading}
              density={compact ? "compact" : "standard"}
              getRowHeight={() => 'auto'}
              localeText={localeText}
              slots={{
                toolbar: compact ? undefined : PopupToolbar,
              }}
              slotProps={{
                toolbar: {
                  onRefresh,
                  loading,
                },
              }}
              sx={{
                border: 'none',
                height: '100%',
                '& .MuiDataGrid-main': {
                  overflow: 'unset',
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'auto',
                },
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  lineHeight: compact ? '1.2' : '1.5',
                  py: compact ? 0.5 : 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: compact ? 2 : 3,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  '&:focus': {
                    outline: 'none',
                  },
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
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  fontSize: compact ? '0.875rem' : '1rem',
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
                  minHeight: compact ? 40 : 52,
                  position: 'sticky',
                  bottom: 0,
                },
                '& .MuiTablePagination-root': {
                  color: theme.palette.text.primary,
                },
                // Стили для панелей - выравнивание по правому краю
                '& .MuiDataGrid-panel': {
                  '& .MuiDataGrid-panelWrapper': {
                    right: 0,
                    left: 'auto',
                  },
                },
                '& .MuiPopper-root': {
                  '& .MuiPaper-root': {
                    right: 0,
                    left: 'auto',
                  },
                },
                // Double-click to edit hint
                '& .MuiDataGrid-row:hover::after': onEditClicked ? {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: 1,
                } : undefined,
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        TransitionComponent={Zoom}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            minWidth: 320,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ErrorIcon color="error" />
            <span>{t('confirmDelete')}</span>
          </Stack>
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
            size="small"
            sx={{ borderRadius: 1 }}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            size="small"
            sx={{ borderRadius: 1 }}
            autoFocus
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default PopupGrid;