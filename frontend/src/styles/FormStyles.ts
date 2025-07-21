import { alpha } from '@mui/material/styles';

// Общие стили для всех форм и input компонентов
export const FormStyles = {
  // Основные цвета
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
    borderDefault: '#e0e0e0',
    borderHover: '#1976d2',
    borderFocus: '#1976d2',
    borderError: '#f44336',
    backgroundHover: '#f5f5f5',
    backgroundFocus: '#fff',
    backgroundDisabled: '#f5f5f5',
    textPrimary: 'rgba(0, 0, 0, 0.87)',
    textSecondary: 'rgba(0, 0, 0, 0.6)',
    textDisabled: 'rgba(0, 0, 0, 0.38)',
  },

  // Размеры
  sizes: {
    inputHeight: '40px',
    inputPadding: '12px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    labelFontSize: '14px',
    helperTextFontSize: '12px',
    iconSize: '20px',
  },

  // Анимации
  transitions: {
    default: 'all 0.2s ease-in-out',
    fast: 'all 0.1s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },

  // Тени
  shadows: {
    focus: `0 0 0 2px ${alpha('#1976d2', 0.2)}`,
    error: `0 0 0 2px ${alpha('#f44336', 0.2)}`,
    hover: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },

  // Общие стили для input
  input: {
    base: {
      width: '100%',
      fontSize: '14px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      lineHeight: '1.1876em',
      letterSpacing: '0.00938em',
      color: 'rgba(0, 0, 0, 0.87)',
      boxSizing: 'border-box',
      cursor: 'text',
      display: 'inline-flex',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: '#fff',
      borderRadius: '8px',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#fafafa',
      },
    },
    outlined: {
      border: '1px solid #e0e0e0',
      '&:hover': {
        borderColor: '#1976d2',
        backgroundColor: '#fafafa',
      },
      '&:focus-within': {
        borderColor: '#1976d2',
        boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.2)}`,
      },
    },
    error: {
      borderColor: '#f44336',
      '&:focus-within': {
        boxShadow: `0 0 0 2px ${alpha('#f44336', 0.2)}`,
      },
    },
    disabled: {
      backgroundColor: '#f5f5f5',
      color: 'rgba(0, 0, 0, 0.38)',
      cursor: 'default',
      '&:hover': {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
      },
    },
  },

  // Стили для лейблов
  label: {
    base: {
      color: 'rgba(0, 0, 0, 0.6)',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: 1,
      letterSpacing: '0.00938em',
      marginBottom: '8px',
      display: 'block',
      transformOrigin: 'top left',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      position: 'relative',
    },
    required: {
      '&::after': {
        content: '" *"',
        color: '#f44336',
        marginLeft: '2px',
      },
    },
    focused: {
      color: '#1976d2',
    },
    error: {
      color: '#f44336',
    },
    disabled: {
      color: 'rgba(0, 0, 0, 0.38)',
    },
  },

  // Стили для helper text
  helperText: {
    base: {
      color: 'rgba(0, 0, 0, 0.6)',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
      textAlign: 'left',
      marginTop: '3px',
      marginRight: '14px',
      marginBottom: 0,
      marginLeft: '14px',
    },
    error: {
      color: '#f44336',
    },
  },

  // Стили для форм
  form: {
    container: {
      width: '100%',
      boxSizing: 'border-box',
    },
    section: {
      marginBottom: '24px',
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.87)',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e0e0e0',
    },
    fieldGroup: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
      flexWrap: 'wrap',
    },
    field: {
      marginBottom: '16px',
      minWidth: '250px',
      flex: 1,
    },
    actions: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e0e0e0',
      position: 'sticky',
      bottom: 0,
      backgroundColor: '#fff',
      padding: '16px 24px',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '0 0 12px 12px',
      justifyContent: 'flex-end',
    },
  },

  // Утилиты для применения стилей
  utils: {
    applyInputStyles: (theme: any) => ({
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#fafafa',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        },
        '&.Mui-focused': {
          backgroundColor: '#fff',
          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
          },
        },
        '&.Mui-error': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main,
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.2)}`,
          },
        },
        '&.Mui-disabled': {
          backgroundColor: '#f5f5f5',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
          },
        },
      },
      '& .MuiInputLabel-root': {
        fontSize: '14px',
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
        fontSize: '12px',
      },
    }),

    applySelectStyles: (theme: any) => ({
      '& .MuiSelect-select': {
        borderRadius: '8px',
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#fafafa',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        },
        '&.Mui-focused': {
          backgroundColor: '#fff',
          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
      },
    }),

    applyDatePickerStyles: (theme: any) => ({
      '& .MuiInputBase-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#fafafa',
        },
        '&.Mui-focused': {
          backgroundColor: '#fff',
          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
      },
    }),
  },
};

// Экспорт дополнительных утилит
export const formUtils = {
  // Функция для создания консистентных form group
  createFormGroup: (fields: any[]) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
    gap: '16px',
    marginBottom: '24px',
  }),

  // Функция для создания секции формы
  createFormSection: (title?: string) => ({
    marginBottom: '32px',
    ...(title && {
      '&::before': {
        content: `"${title}"`,
        display: 'block',
        fontSize: '18px',
        fontWeight: 500,
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e0e0e0',
      },
    }),
  }),
};

export default FormStyles;