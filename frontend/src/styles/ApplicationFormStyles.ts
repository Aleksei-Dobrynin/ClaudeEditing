export const ApplicationFormStyles = {
  // Основной контейнер формы
  container: {
    marginTop: 2,
    marginBottom: 4,
  },

  // Заголовок формы
  header: {
    paper: {
      p: 2,
      mb: 3,
      borderRadius: 2,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2,
    },
    mainTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1a1a1a',
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#666',
      mt: 0.5,
    },
    statusChip: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },

  // Секции формы
  section: {
    card: {
      mb: 3,
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
    header: {
      p: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
      background: '#fafafa',
    },
    title: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    content: {
      p: 3,
    },
    description: {
      fontSize: '0.875rem',
      color: '#666',
      mt: 0.5,
    },
  },

  // Группы полей
  fieldGroup: {
    container: {
      mb: 3,
      position: 'relative',
    },
    title: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#555',
      mb: 2,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      '&::after': {
        content: '""',
        flex: 1,
        height: '1px',
        background: '#e0e0e0',
        ml: 2,
      },
    },
    fields: {
      display: 'grid',
      gap: 2,
    },
  },

  // Улучшенные поля ввода
  field: {
    wrapper: {
      position: 'relative',
      '& .MuiOutlinedInput-root': {
        transition: 'all 0.3s ease',
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
      },
      '& .MuiInputLabel-root': {
        fontWeight: 500,
      },
      '& .MuiFormHelperText-root': {
        marginLeft: 2,
      },
    },
    required: {
      '& .MuiInputLabel-root': {
        '& .MuiInputLabel-asterisk': {
          color: '#d32f2f',
        },
      },
    },
  },

  // Индикаторы и статусы
  indicator: {
    progress: {
      container: {
        mb: 3,
        p: 2,
        borderRadius: 2,
        bgcolor: '#f5f5f5',
      },
      label: {
        mb: 1,
        fontSize: '0.875rem',
        fontWeight: 500,
      },
      bar: {
        height: 8,
        borderRadius: 4,
      },
    },
    badge: {
      '& .MuiBadge-badge': {
        right: -3,
        top: 3,
        fontSize: '0.75rem',
        height: 20,
        minWidth: 20,
        borderRadius: 10,
      },
    },
  },

  // Кнопки действий
  actions: {
    container: {
      display: 'flex',
      gap: 2,
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
      p: 3,
      borderTop: '1px solid',
      borderColor: 'divider',
      bgcolor: '#fafafa',
      position: 'sticky',
      bottom: 0,
      zIndex: 10,
    },
    button: {
      minWidth: 120,
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '0.875rem',
      px: 3,
      py: 1.5,
    },
    saveButton: {
      bgcolor: '#4caf50',
      color: 'white',
      '&:hover': {
        bgcolor: '#45a049',
      },
    },
    cancelButton: {
      bgcolor: '#f44336',
      color: 'white',
      '&:hover': {
        bgcolor: '#da190b',
      },
    },
  },

  // Табы
  tabs: {
    container: {
      borderBottom: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    tab: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      minHeight: 48,
      '&.Mui-selected': {
        fontWeight: 600,
      },
    },
    indicator: {
      backgroundColor: '#1976d2',
      height: 3,
    },
  },

  // Адаптивность
  responsive: {
    mobileSection: {
      p: { xs: 2, sm: 3 },
    },
    gridContainer: {
      spacing: { xs: 2, sm: 3 },
    },
    fieldGrid: {
      xs: 12,
      sm: 6,
      md: 4,
    },
  },

  // Анимации
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.2s ease',
    slow: 'all 0.5s ease',
  },

  // Утилиты
  utils: {
    stickyHeader: {
      position: 'sticky',
      top: 0,
      bgcolor: 'background.paper',
      zIndex: 10,
      py: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
    },
    divider: {
      my: 3,
    },
    errorHighlight: {
      '& .MuiOutlinedInput-root': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#d32f2f',
          borderWidth: 2,
        },
      },
    },
  },
};