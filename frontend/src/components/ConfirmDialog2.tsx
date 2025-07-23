import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'error' | 'primary' | 'secondary' | 'success' | 'warning';
  showWarningIcon?: boolean;
  loading?: boolean;
  type?: 'delete' | 'warning' | 'info' | 'confirm';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = 'primary',
  showWarningIcon = false,
  loading = false,
  type = 'confirm',
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const defaultTitle = t('common:dialog.confirmTitle');
  const defaultMessage = t('common:dialog.confirmMessage');
  const defaultConfirmText = t('common:confirm');
  const defaultCancelText = t('common:cancel');

  const getIcon = () => {
    const iconProps = { 
      sx: { 
        fontSize: 48,
        color: getIconColor(),
      } 
    };
    switch (type) {
      case 'delete':
        return <DeleteOutlineIcon {...iconProps} />;
      case 'warning':
        return <WarningAmberIcon {...iconProps} />;
      case 'info':
        return <InfoOutlinedIcon {...iconProps} />;
      default:
        return <CheckCircleOutlineIcon {...iconProps} />;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'delete':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          m: 0, 
          p: 2,
          fontSize: '1rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {title || defaultTitle}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
          disabled={loading}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ px: 2, pb: 2 }}>
        {(showWarningIcon || type) && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 2,
          }}>
            {getIcon()}
          </Box>
        )}
        
        <DialogContentText sx={{
          fontSize: '0.875rem',
          color: theme.palette.text.secondary,
          textAlign: 'center',
        }}>
          {message || defaultMessage}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 2,
        pt: 0,
        gap: 1,
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="text"
          size="small"
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 400,
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {cancelText || defaultCancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={confirmColor}
          variant="contained"
          disabled={loading}
          autoFocus
          size="small"
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 400,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          }}
        >
          {confirmText || defaultConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;