// components/dashboard-beta/shared/EmptyState.tsx

import React from 'react';
import {
  Box,
  Typography,
  Button,
  SvgIcon,
  useTheme
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Description as DescriptionIcon,
  EventBusy as EventBusyIcon,
  SearchOff as SearchOffIcon
} from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconType?: 'inbox' | 'document' | 'calendar' | 'search' | 'custom';
  action?: {
    label: string;
    onClick: () => void;
  };
  height?: string | number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  iconType = 'inbox',
  action,
  height = 300
}) => {
  const theme = useTheme();

  const getIcon = () => {
    if (icon) return icon;

    const iconProps = {
      sx: { 
        fontSize: 64, 
        color: theme.palette.action.disabled,
        mb: 2
      }
    };

    switch (iconType) {
      case 'document':
        return <DescriptionIcon {...iconProps} />;
      case 'calendar':
        return <EventBusyIcon {...iconProps} />;
      case 'search':
        return <SearchOffIcon {...iconProps} />;
      case 'inbox':
      default:
        return <InboxIcon {...iconProps} />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        p: 3,
        textAlign: 'center'
      }}
    >
      {getIcon()}
      
      <Typography 
        variant="h6" 
        color="text.secondary"
        gutterBottom
        sx={{ mb: 1 }}
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 400 }}
        >
          {description}
        </Typography>
      )}
      
      {action && (
        <Button
          variant="contained"
          color="primary"
          onClick={action.onClick}
          sx={{ mt: 2 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;