import React, { useState, useCallback, useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowsProp,
  GridRowParams,
  GridToolbarContainer,
  GridLocaleText,
  GridRenderCellParams,
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
import { 
  CustomColumnsButton, 
  CustomFilterButton, 
  CustomDensityButton,
  CustomExportButton,
  CustomQuickFilter,
} from './CustomToolbarComponents';
import { gridCommonStyles } from './GridStyles';
import { GridCellTooltip } from './GridCellTooltip';

// Custom Toolbar для Popup с правильным позиционированием
interface PopupToolbarProps {
  onRefresh?: () => void;
  loading?: boolean;
  data: any[];
  columns: GridColDef[];
  fileName?: string;
}

const PopupToolbar: React.FC<PopupToolbarProps> = ({ 
  onRefresh, 
  loading,
  data,
  columns,
  fileName,
}) => {
  const { t } = useTranslation();
  
  return (
    <GridToolbarContainer sx={gridCommonStyles.toolbar}>
      <CustomColumnsButton />
      <CustomFilterButton />
      <CustomDensityButton />
      <CustomExportButton 
        data={data}
        columns={columns}
        fileName={fileName}
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
      <Box sx={{ flexGrow: 1 }} />
      <CustomQuickFilter />
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
    <Box sx={{
      ...gridCommonStyles.emptyState,
      minHeight: compact ? 250 : 350,
    }}>
      <InfoIcon sx={{ fontSize: compact ? 48 : 64 }} />
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
    toolbarDensity: t('density'),
    toolbarDensityLabel: t('densityLabel'),
    toolbarDensityCompact: t('densityCompact'),
    toolbarDensityStandard: t('densityStandard'),
    toolbarDensityComfortable: t('densityComfortable'),
    toolbarColumns: t('columns'),
    toolbarColumnsLabel: t('columnsLabel'),
    toolbarFilters: t('filters'),
    toolbarFiltersLabel: t('filtersLabel'),
    toolbarFiltersTooltipHide: t('filtersTooltipHide'),
    toolbarFiltersTooltipShow: t('filtersTooltipShow'),
    toolbarFiltersTooltipActive: (count) => `${count} ${t('filtersTooltipActive')}`,
    
    // Тексты меню колонок
    columnMenuLabel: t('columnMenuLabel', 'Меню'),
    columnMenuShowColumns: t('columnMenuShowColumns', 'Показать колонки'),
    columnMenuManageColumns: t('columnMenuManageColumns', 'Управление колонками'),
    columnMenuFilter: t('columnMenuFilter', 'Фильтр'),
    columnMenuHideColumn: t('columnMenuHideColumn', 'Скрыть колонку'),
    columnMenuUnsort: t('columnMenuUnsort', 'Отменить сортировку'),
    columnMenuSortAsc: t('columnMenuSortAsc', 'Сортировать по возрастанию'),
    columnMenuSortDesc: t('columnMenuSortDesc', 'Сортировать по убыванию'),
    
    // Тексты панели фильтров
    filterPanelAddFilter: t('filterPanelAddFilter'),
    filterPanelRemoveAll: t('filterPanelRemoveAll'),
    filterPanelDeleteIconLabel: t('filterPanelDeleteIconLabel'),
    filterPanelLogicOperator: t('filterPanelLogicOperator'),
    filterPanelOperator: t('filterPanelOperator'),
    filterPanelOperatorAnd: t('filterPanelOperatorAnd'),
    filterPanelOperatorOr: t('filterPanelOperatorOr'),
    filterPanelColumns: t('filterPanelColumns'),
    filterPanelInputLabel: t('filterPanelInputLabel'),
    filterPanelInputPlaceholder: t('filterPanelInputPlaceholder'),
    
    // Операторы фильтров
    filterOperatorContains: t('filterOperatorContains'),
    filterOperatorEquals: t('filterOperatorEquals'),
    filterOperatorStartsWith: t('filterOperatorStartsWith'),
    filterOperatorEndsWith: t('filterOperatorEndsWith'),
    filterOperatorIs: t('filterOperatorIs'),
    filterOperatorNot: t('filterOperatorNot'),
    filterOperatorAfter: t('filterOperatorAfter'),
    filterOperatorOnOrAfter: t('filterOperatorOnOrAfter'),
    filterOperatorBefore: t('filterOperatorBefore'),
    filterOperatorOnOrBefore: t('filterOperatorOnOrBefore'),
    filterOperatorIsEmpty: t('filterOperatorIsEmpty'),
    filterOperatorIsNotEmpty: t('filterOperatorIsNotEmpty'),
    filterOperatorIsAnyOf: t('filterOperatorIsAnyOf'),
    
    // Тексты пагинации
    MuiTablePagination: {
      labelRowsPerPage: t('rowsPerPage'),
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}–${to} ${t('of')} ${count !== -1 ? count : `${t('moreThan')} ${to}`}`,
    },
    
    // Тексты футера
    footerRowSelected: (count) => t('footerRowSelected', { count }),
    footerTotalRows: t('footerTotalRows'),
    footerTotalVisibleRows: (visibleCount, totalCount) =>
      t('footerTotalVisibleRows', { visibleCount, totalCount }),
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

  // Применяем тултипы к колонкам
  const columnsWithTooltips = useMemo(() => {
    return columns.map(col => ({
      ...col,
      renderCell: col.renderCell || ((params: GridRenderCellParams) => (
        <GridCellTooltip value={params.value} />
      )),
    }));
  }, [columns]);

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
        
        if (!hideEditButton && onEditClicked && canEditRow) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label={t('edit')}
              onClick={() => onEditClicked(Number(id))}
              data-testid={`edit-${id}`}
            />
          );
        }
        
        if (!hideDeleteButton && onDeleteClicked && canDeleteRow) {
          actions.push(
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label={t('delete')}
              onClick={() => handleDeleteClick(Number(id))}
              data-testid={`delete-${id}`}
              sx={{ color: 'error.main' }}
            />
          );
        }
        
        if (customActionButton) {
          actions.push(
            <Box key="custom" component="span">
              {customActionButton(Number(id))}
            </Box>
          );
        }
        
        return actions;
      },
    }];
  }, [
    hideActions,
    hideEditButton,
    hideDeleteButton,
    onEditClicked,
    onDeleteClicked,
    customActionButton,
    canEdit,
    canDelete,
    handleDeleteClick,
    t,
    compact,
  ]);

  // Combine columns
  const allColumns = useMemo(() => {
    return [...columnsWithTooltips, ...actionColumns];
  }, [columnsWithTooltips, actionColumns]);

  return (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        {/* Header */}
        {!hideTitle && (title || !hideAddButton) && (
          <Box 
            sx={{ 
              p: compact ? 2 : 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              background: theme => alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center" 
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
                {title && (
                  <Typography 
                    variant={compact ? "h6" : "h5"} 
                    component="h2"
                    sx={{ fontWeight: 600 }}
                    data-testid={`${tableName}Title`}
                  >
                    {title}
                  </Typography>
                )}
                {showCount && data.length > 0 && (
                  <Chip 
                    label={data.length} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
              {!hideAddButton && onEditClicked && (
                <Tooltip title={t('add')}>
                  <IconButton
                    onClick={() => onEditClicked(0)}
                    color="primary"
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
          flexGrow: 1,
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
                  data,
                  columns: columnsWithTooltips,
                  fileName: tableName,
                },
              }}
              sx={{
                ...gridCommonStyles.root,
                ...(compact ? gridCommonStyles.compactMode : {}),
                // Hover effect для строк
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  cursor: onEditClicked ? 'pointer' : 'default',
                },
                // Double-click to edit hint
                '& .MuiDataGrid-row:hover::after': onEditClicked ? {
                  content: '"Двойной клик для редактирования"',
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  backgroundColor: 'background.paper',
                  padding: '2px 8px',
                  borderRadius: 4,
                  boxShadow: theme.shadows[2],
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  opacity: 0,
                  animation: 'fadeIn 0.3s ease-in-out 0.5s forwards',
                  '@keyframes fadeIn': {
                    to: { opacity: 1 },
                  },
                } : {},
              }}
              onRowDoubleClick={(params) => {
                if (onEditClicked) {
                  onEditClicked(Number(params.id));
                }
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

export default PopupGrid;