import React, { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Divider,
  Fade,
  Alert,
  Snackbar,
  CircularProgress,
  Breadcrumbs,
  Link,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { FormStyles } from '../styles/FormStyles';
import { useTranslation } from 'react-i18next';

interface BaseFormLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  onSaveAndContinue?: () => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
  isDirty?: boolean;
  isValid?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  showUnsavedWarning?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | false;
  actions?: ReactNode;
  infoMessage?: string;
}

// Стилизованные компоненты
const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: FormStyles.sizes.borderRadius,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  backgroundColor: '#fff',
  position: 'relative',
  overflow: 'visible',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FormHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const FormContent = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FormActions = styled(Box)(({ theme }) => {
  // Define our base styles that will always be applied
  const baseStyles = {
    marginLeft: -theme.spacing(3),
    marginRight: -theme.spacing(3),
    marginBottom: -theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginLeft: -theme.spacing(2),
      marginRight: -theme.spacing(2),
      marginBottom: -theme.spacing(2),
      padding: theme.spacing(2),
      flexDirection: 'column',
      '& > *': {
        width: '100%',
      },
    },
  };

  // Get form styles if they exist
  const formStyles = FormStyles?.form?.actions || {};

  // Return combined styles
  return {
    ...formStyles,
    ...baseStyles,
  };
});

const UnsavedChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.dark,
  fontWeight: 500,
  '& .MuiChip-icon': {
    color: theme.palette.warning.dark,
  },
}));

const InfoAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: FormStyles.sizes.borderRadius,
  '& .MuiAlert-icon': {
    fontSize: '20px',
  },
}));

const BaseFormLayout: React.FC<BaseFormLayoutProps> = ({
  title,
  subtitle,
  children,
  onSave,
  onCancel,
  onSaveAndContinue,
  loading = false,
  error = null,
  success = false,
  isDirty = false,
  isValid = true,
  breadcrumbs = [],
  showUnsavedWarning = true,
  maxWidth = 'lg',
  actions,
  infoMessage,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Показать уведомление об успехе
  useEffect(() => {
    if (success) {
      setShowSuccessSnackbar(true);
    }
  }, [success]);

  // Показать уведомление об ошибке
  useEffect(() => {
    if (error) {
      setShowErrorSnackbar(true);
    }
  }, [error]);

  // Предупреждение при закрытии страницы с несохраненными изменениями
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && showUnsavedWarning) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, showUnsavedWarning]);

  const handleSave = async () => {
    if (!isValid || loading || isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!isValid || loading || isSaving || !onSaveAndContinue) return;
    
    setIsSaving(true);
    try {
      await onSaveAndContinue();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && showUnsavedWarning) {
      if (window.confirm(t('form.unsavedChangesWarning', 'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?'))) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <FormContainer>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={index} color="text.primary" fontSize="14px">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                color="inherit"
                href={crumb.href}
                fontSize="14px"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      <FormPaper elevation={0}>
        {/* Заголовок формы */}
        <FormHeader>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={handleCancel} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <FormTitle>
                {title}
                {isDirty && showUnsavedWarning && (
                  <UnsavedChip
                    size="small"
                    icon={<WarningAmberIcon />}
                    label={t('form.unsaved', 'Не сохранено')}
                  />
                )}
              </FormTitle>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        </FormHeader>

        <Divider sx={{ mx: -3, mb: 3 }} />

        {/* Информационное сообщение */}
        {infoMessage && (
          <InfoAlert severity="info" icon={<InfoOutlinedIcon />}>
            {infoMessage}
          </InfoAlert>
        )}

        {/* Контент формы */}
        <FormContent>
          {children}
        </FormContent>

        {/* Действия формы */}
        <FormActions>
          {actions || (
            <>
              <Box display="flex" gap={2} flex={1}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                  disabled={loading || isSaving}
                  fullWidth={isMobile}
                >
                  {t('button.cancel', 'Отмена')}
                </Button>
              </Box>
              
              <Box display="flex" gap={2}>
                {onSaveAndContinue && (
                  <Tooltip 
                    title={!isValid ? t('form.fixErrors', 'Исправьте ошибки в форме') : ''}
                  >
                    <span>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSaveAndContinue}
                        disabled={!isValid || loading || isSaving}
                        fullWidth={isMobile}
                      >
                        {t('button.saveAndContinue', 'Сохранить и продолжить')}
                      </Button>
                    </span>
                  </Tooltip>
                )}
                
                <Tooltip 
                  title={!isValid ? t('form.fixErrors', 'Исправьте ошибки в форме') : ''}
                >
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={!isValid || loading || isSaving}
                      fullWidth={isMobile}
                    >
                      {t('button.save', 'Сохранить')}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </>
          )}
        </FormActions>
      </FormPaper>

      {/* Уведомления */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)} 
          severity="success"
          variant="filled"
        >
          {t('form.saveSuccess', 'Данные успешно сохранены')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowErrorSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowErrorSnackbar(false)} 
          severity="error"
          variant="filled"
        >
          {error || t('form.saveError', 'Произошла ошибка при сохранении')}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default BaseFormLayout;