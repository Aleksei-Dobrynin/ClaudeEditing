import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowsProp,
  GridRowParams,
  GridLocaleText,
  GridSortModel,
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
  TextField,
  InputAdornment,
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
  Search as SearchIcon,
  Clear as ClearIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { 
  CustomColumnsButton, 
  CustomFilterButton, 
  CustomDensityButton,
  CustomExportButton,
} from './CustomToolbarComponents';
import { gridCommonStyles } from './GridStyles';
import { GridCellTooltip } from './GridCellTooltip';

// Custom Toolbar Component
interface CustomToolbarProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  loading?: boolean;
  totalCount?: number;
  data: any[];
  columns: GridColDef[];
  fileName?: string;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ 
  onRefresh, 
  onPrint, 
  loading,
  totalCount,
  data,
  columns,
  fileName,
}) => {
  const { t } = useTranslation();
  
  return (
    <GridToolbarContainer sx={gridCommonStyles.toolbar}>
      <Stack direction="row" spacing={1} alignItems="center">
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
    <Box sx={{
      ...gridCommonStyles.emptyState,
      minHeight: 400,
    }}>
      <InfoIcon sx={{ fontSize: 64 }} />
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
  customAddUrl?: string;
  customEditUrl?: (id: number) => string;
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
  customAddUrl,
  customEditUrl,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchText, setSearchText] = useState(initialSearchText);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [debouncedSearchText] = useDebounce(searchText, 500);

  // Эффект для обработки изменения поиска
  useEffect(() => {
    if (debouncedSearchText !== initialSearchText) {
      setIsSearching(true);
      onChangeTextField?.(debouncedSearchText);
      setTimeout(() => setIsSearching(false), 300);
    }
  }, [debouncedSearchText, initialSearchText, onChangeTextField]);

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
    if (customAddUrl) {
      navigate(customAddUrl);
    } else {
      navigate(`/user/${tableName}/addedit?id=0`);
    }
  }, [navigate, tableName, customAddUrl]);

  // Handle edit
  const handleEdit = useCallback((id: number) => {
    if (customEditUrl) {
      navigate(customEditUrl(id));
    } else {
      navigate(`/user/${tableName}/addedit?id=${id}`);
    }
  }, [navigate, tableName, customEditUrl]);

  // Handle search
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchText('');
    onChangeTextField?.('');
  }, [onChangeTextField]);

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
      getActions: ({ id }: GridRowParams) => {
        const actions = [];
        
        actions.push(
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label={t('edit')}
            onClick={() => handleEdit(Number(id))}
            data-testid={`edit-${id}`}
          />
        );
        
        if (onDeleteClicked) {
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
        
        return actions;
      },
    }];
  }, [hideActions, onDeleteClicked, handleEdit, handleDeleteClick, t, isMobile]);

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
        ) : (
          <Box 
            sx={{ 
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              background: theme => alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Stack spacing={3}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
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
                    {showCount && totalCount > 0 && (
                      <Chip 
                        label={totalCount} 
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
                <Stack direction="row" spacing={2} alignItems="center">
                  {onChangeTextField && (
                    <TextField
                      size="small"
                      placeholder={t('searchPlaceholder')}
                      value={searchText}
                      onChange={handleSearchChange}
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
                              onClick={handleClearSearch}
                              edge="end"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        width: { xs: '100%', sm: 250 },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  )}
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
              </Stack>
            </Stack>
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
          {loading || isSearching ? (
            <Box sx={{ p: 2 }}>
              {[...Array(pageSize)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={52}
                  sx={{ mb: 1, borderRadius: 1 }}
                  animation="wave"
                />
              ))}
            </Box>
          ) : data.length === 0 ? (
            <EmptyState 
              message={emptyStateMessage}
              onAdd={!hideAddButton ? handleAdd : undefined}
              hasSearch={!!searchText}
            />
          ) : (
            <DataGrid
              rows={data}
              columns={allColumns}
              data-testid={`${tableName}Table`}
              autoHeight
              paginationMode="server"
              sortingMode="server"
              rowCount={totalCount}
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={{ page, pageSize }}
              onPaginationModelChange={(model) => {
                changePagination(model.page, model.pageSize);
              }}
              onSortModelChange={changeSort}
              disableRowSelectionOnClick
              loading={loading || isSearching}
              getRowHeight={getRowHeight || (() => 'auto')}
              localeText={localeText}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: {
                  onRefresh,
                  onPrint: handlePrint,
                  loading: loading || isSearching,
                  totalCount,
                  data,
                  columns: columnsWithTooltips,
                  fileName: tableName,
                },
              }}
              sx={{
                ...gridCommonStyles.root,
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