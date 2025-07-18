import React, { useState, useCallback, useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowsProp,
  GridRowParams,
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
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
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
import { exportToExcel } from './ExcelExportUtils';

// Custom Toolbar Component
interface CustomToolbarProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  loading?: boolean;
  data: any[];
  columns: GridColDef[];
  fileName?: string;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ 
  onRefresh, 
  onPrint, 
  loading,
  data,
  columns,
  fileName,
}) => {
  const { t } = useTranslation();
  
  return (
    <GridToolbarContainer sx={gridCommonStyles.toolbar}>
      <CustomQuickFilter />
      <Box sx={{ flexGrow: 1 }} />
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
    <Box sx={gridCommonStyles.emptyState}>
      <InfoIcon sx={{ fontSize: 64 }} />
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
  hideDeleteButton?: boolean;
  hideEditButton?: boolean;
  customActionButton?: (id: number) => React.ReactNode;
  customEditClick?: (id: number) => void;
  onPrint?: () => void;
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
  hideDeleteButton = false,
  hideEditButton = false,
  customActionButton,
  customEditClick,
  onPrint,
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

  // Handle print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Handle add button
  const handleAdd = useCallback(() => {
    if (addButtonClick) {
      addButtonClick();
    } else {
      navigate(`/${tableName}/add`);
    }
  }, [addButtonClick, navigate, tableName]);

  // Handle edit
  const handleEdit = useCallback((id: number) => {
    if (customEditClick) {
      customEditClick(id);
    } else {
      navigate(`/${tableName}/edit/${id}`);
    }
  }, [customEditClick, navigate, tableName]);

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
      width: isMobile ? 100 : 150,
      cellClassName: 'actions',
      getActions: ({ id, row }: GridRowParams) => {
        const actions = [];
        
        if (!hideEditButton) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label={t('edit')}
              onClick={() => handleEdit(Number(id))}
              data-testid={`edit-${id}`}
            />
          );
        }
        
        if (!hideDeleteButton && onDeleteClicked) {
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
    onDeleteClicked, 
    customActionButton,
    handleEdit,
    handleDeleteClick,
    t,
    isMobile,
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
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        {/* Header */}
        {customHeader ? (
          customHeader
        ) : !hideTitle && (title || !hideAddButton) ? (
          <Box 
            sx={{ 
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              background: theme => alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Stack 
              direction={isInLineHeader ? "row" : { xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={isInLineHeader ? "center" : { xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
                  {title && (
                    <Typography 
                      variant="h5" 
                      component="h1"
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
                {subtitle && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {!hideAddButton && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  data-testid={`${tableName}AddButton`}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  {t('add')}
                </Button>
              )}
            </Stack>
          </Box>
        ) : null}

        {/* Custom Bottom */}
        {customBottom && (
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
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

        {/* DataGrid */}
        <Box sx={{ width: '100%', position: 'relative' }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={52}
                  sx={{ mb: 1, borderRadius: 1 }}
                  animation="wave"
                />
              ))}
            </Box>
          ) : data.length === 0 && !loading ? (
            <EmptyState 
              message={emptyStateMessage}
              onAdd={!hideAddButton ? handleAdd : undefined}
            />
          ) : (
            <DataGrid
              rows={data}
              columns={allColumns}
              data-testid={`${tableName}Table`}
              autoHeight
              initialState={{
                pagination: { paginationModel: { pageSize: pageSize } },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              disableRowSelectionOnClick
              loading={loading}
              getRowHeight={getRowHeight || (() => 'auto')}
              localeText={localeText}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: {
                  onRefresh,
                  onPrint: onPrint || handlePrint,
                  loading,
                  data,
                  columns: columnsWithTooltips,
                  fileName: tableName,
                },
              }}
              sx={gridCommonStyles.root}
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

export default PageGrid;