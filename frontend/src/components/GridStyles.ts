import { alpha, Theme } from '@mui/material/styles';

export const gridCommonStyles = {
  root: {
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.04),
      borderBottom: '2px solid',
      borderColor: 'divider',
      '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid',
      borderColor: 'divider',
      fontSize: '0.875rem',
      padding: '12px 16px',
      // Ограничение длины текста с многоточием
      '& > *': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block',
      },
    },
    // Подсветка строки при наведении
    '& .MuiDataGrid-row': {
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.04),
        '& .MuiDataGrid-cell': {
          borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
        },
      },
      '&.Mui-selected': {
        backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
        '&:hover': {
          backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.12),
        },
      },
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: '2px solid',
      borderColor: 'divider',
      backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.02),
    },
    // Стили для actions колонки
    '& .MuiDataGrid-actionsCell': {
      gap: 1,
    },
    // Улучшенные стили для фильтров и сортировки
    '& .MuiDataGrid-menuIcon, & .MuiDataGrid-sortIcon': {
      color: (theme: Theme) => theme.palette.text.secondary,
    },
    '& .MuiDataGrid-filterIcon': {
      color: (theme: Theme) => theme.palette.primary.main,
    },
    // Overlay стили
    '& .MuiDataGrid-overlay': {
      backgroundColor: (theme: Theme) => alpha(theme.palette.background.default, 0.9),
    },
    // Стили для виртуального скроллера
    '& .MuiDataGrid-virtualScroller': {
      overflowX: 'hidden',
    },
    '& .MuiDataGrid-virtualScrollerContent': {
      minHeight: '100px',
    },
    // Responsive для мобильных устройств
    '@media (max-width: 600px)': {
      '& .MuiDataGrid-columnHeader': {
        padding: '8px',
      },
      '& .MuiDataGrid-cell': {
        padding: '8px',
        fontSize: '0.75rem',
      },
    },
  },
  toolbar: {
    padding: '8px 16px',
    borderBottom: '1px solid',
    borderColor: 'divider',
    background: (theme: Theme) => alpha(theme.palette.primary.main, 0.02),
    gap: 1,
    flexWrap: 'wrap',
    '& .MuiButton-root': {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  compactMode: {
    '& .MuiDataGrid-columnHeader': {
      minHeight: '40px !important',
      maxHeight: '40px !important',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontSize: '0.75rem',
    },
    '& .MuiDataGrid-cell': {
      minHeight: '36px !important',
      maxHeight: '36px !important',
      fontSize: '0.75rem',
      padding: '6px 12px',
    },
    '& .MuiDataGrid-footerContainer': {
      minHeight: '40px',
    },
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: (theme: Theme) => alpha(theme.palette.background.default, 0.7),
    zIndex: 10,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: 3,
    '& .MuiSvgIcon-root': {
      color: 'text.secondary',
      opacity: 0.5,
    },
  },
  cellTooltip: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    display: 'block',
  },
};

// Функция для объединения стилей
export const mergeGridStyles = (customStyles: any = {}) => {
  return {
    ...gridCommonStyles,
    ...customStyles,
  };
};

// Экспорт отдельных частей для переиспользования
export const gridHeaderStyles = gridCommonStyles.root['& .MuiDataGrid-columnHeaders'];
export const gridCellStyles = gridCommonStyles.root['& .MuiDataGrid-cell'];
export const gridRowStyles = gridCommonStyles.root['& .MuiDataGrid-row'];
export const gridToolbarStyles = gridCommonStyles.toolbar;