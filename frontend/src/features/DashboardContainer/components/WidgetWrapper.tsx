// components/dashboard-beta/shared/WidgetWrapper.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  AlertTitle,
  Fade,
  Skeleton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { WidgetWrapperProps } from '../types/dashboard';
import { useTranslation } from 'react-i18next';

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  title,
  children,
  loading = false,
  error = null,
  actions,
  className,
  onRefresh,
  onClose,
  sx,
  ...cardProps
}) => {
  const { t } = useTranslation('dashboard');

  if (loading) {
    return (
      <Card className={className} {...cardProps}>
        <CardHeader
          title={
            <Skeleton 
              variant="text" 
              width="60%" 
              height={32}
              sx={{ bgcolor: 'action.hover' }}
            />
          }
          action={
            <Skeleton 
              variant="circular" 
              width={40} 
              height={40}
              sx={{ bgcolor: 'action.hover' }}
            />
          }
        />
        <CardContent>
          <Box>
            <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className} {...cardProps}>
        <CardHeader
          title={title}
          action={
            onRefresh && (
              <IconButton onClick={onRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            )
          }
        />
        <CardContent>
          <Alert 
            severity="error"
            action={
              onRefresh && (
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={onRefresh}
                >
                  <RefreshIcon />
                </IconButton>
              )
            }
          >
            <AlertTitle>{t('error')}</AlertTitle>
            {error.message || t('errors.loadingFailed')}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in timeout={300}>
      <Card 
        className={className} 
        {...cardProps}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          // ...cardProps.sx
        }}
      >
        {title && (
          <CardHeader
            title={
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                {actions}
                {onRefresh && (
                  <IconButton 
                    onClick={onRefresh} 
                    size="small"
                    sx={{ 
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'rotate(180deg)'
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                )}
                {onClose && (
                  <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            }
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              pb: 2,
              '& .MuiCardHeader-action': {
                alignSelf: 'center',
                marginTop: 0,
              }
            }}
          />
        )}
        <CardContent 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2, sm: 3 }
          }}
        >
          {children}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default WidgetWrapper;