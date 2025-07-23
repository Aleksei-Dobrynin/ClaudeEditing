import React, { useState, useCallback } from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertTitle, 
  Slide, 
  SlideProps,
  IconButton,
  useTheme,
  alpha,
  Box,
  Paper,
} from '@mui/material';
import { NotificationContext, NotificationOptions, NotificationSeverity } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

interface NotificationState {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
  duration: number;
  action?: React.ReactNode;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

interface NotificationProviderProps {
  children: React.ReactNode;
  defaultDuration?: number;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  defaultDuration = 6000 
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
    duration: defaultDuration,
  });

  const showNotification = useCallback((options: NotificationOptions | string) => {
    if (typeof options === 'string') {
      setNotification({
        open: true,
        message: options,
        severity: 'success',
        duration: defaultDuration,
      });
    } else {
      setNotification({
        open: true,
        message: options.message,
        severity: options.severity || 'success',
        duration: options.duration || defaultDuration,
        action: options.action,
      });
    }
  }, [defaultDuration]);

  const showSuccess = useCallback((message: string) => {
    showNotification({ message, severity: 'success' });
  }, [showNotification]);

  const showError = useCallback((message: string) => {
    showNotification({ message, severity: 'error' });
  }, [showNotification]);

  const showWarning = useCallback((message: string) => {
    showNotification({ message, severity: 'warning' });
  }, [showNotification]);

  const showInfo = useCallback((message: string) => {
    showNotification({ message, severity: 'info' });
  }, [showNotification]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const getIcon = (severity: NotificationSeverity) => {
    const iconProps = { sx: { fontSize: 20 } };
    switch (severity) {
      case 'success':
        return <CheckCircleOutlineIcon {...iconProps} />;
      case 'error':
        return <ErrorOutlineIcon {...iconProps} />;
      case 'warning':
        return <WarningAmberOutlinedIcon {...iconProps} />;
      case 'info':
        return <InfoOutlinedIcon {...iconProps} />;
    }
  };

  const getSeverityTitle = (severity: NotificationSeverity): string => {
    const titles = {
      success: t('common:notification.success'),
      error: t('common:notification.error'),
      warning: t('common:notification.warning'),
      info: t('common:notification.info'),
    };
    return titles[severity];
  };

  const getSeverityColors = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'success':
        return {
          background: alpha(theme.palette.success.main, 0.12),
          color: theme.palette.success.dark,
          border: theme.palette.success.main,
        };
      case 'error':
        return {
          background: alpha(theme.palette.error.main, 0.12),
          color: theme.palette.error.dark,
          border: theme.palette.error.main,
        };
      case 'warning':
        return {
          background: alpha(theme.palette.warning.main, 0.12),
          color: theme.palette.warning.dark,
          border: theme.palette.warning.main,
        };
      case 'info':
        return {
          background: alpha(theme.palette.info.main, 0.12),
          color: theme.palette.info.dark,
          border: theme.palette.info.main,
        };
    }
  };

  const colors = getSeverityColors(notification.severity);

  return (
    <NotificationContext.Provider 
      value={{ 
        showNotification, 
        showSuccess, 
        showError, 
        showWarning, 
        showInfo 
      }}
    >
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.duration}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            p: 2,
            minWidth: 300,
            maxWidth: 500,
            borderRadius: 2,
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            color: colors.color,
          }}
        >
          <Box sx={{ mr: 1.5, mt: 0.25 }}>
            {getIcon(notification.severity)}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 500,
              mb: 0.5,
            }}>
              {getSeverityTitle(notification.severity)}
            </Box>
            <Box sx={{ 
              fontSize: '0.875rem',
              color: alpha(colors.color, 0.9),
            }}>
              {notification.message}
            </Box>
          </Box>
          
          {notification.action || (
            <IconButton
              size="small"
              aria-label="close"
              onClick={handleClose}
              sx={{
                ml: 1,
                mt: -0.5,
                mr: -0.5,
                color: colors.color,
                '&:hover': {
                  backgroundColor: alpha(colors.color, 0.08),
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Paper>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;