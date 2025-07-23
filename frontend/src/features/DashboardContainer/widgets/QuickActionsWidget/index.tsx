// components/dashboard-beta/widgets/QuickActionsWidget/index.tsx

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  useTheme,
  alpha,
  Zoom
} from '@mui/material';
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Payment as PaymentIcon,
  Support as SupportIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { QuickActionsWidgetProps, QuickAction } from '../../types/dashboard';
import WidgetWrapper from '../../components/WidgetWrapper';

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    add: <AddIcon />,
    description: <DescriptionIcon />,
    payment: <PaymentIcon />,
    support: <SupportIcon />
  };
  return icons[iconName] || <AddIcon />;
};

const ActionCard: React.FC<{
  action: QuickAction;
  size: 'sm' | 'md' | 'lg';
  delay: number;
}> = ({ action, size, delay }) => {
  const theme = useTheme();
  const iconSize = size === 'sm' ? 32 : size === 'md' ? 40 : 48;
  const cardPadding = size === 'sm' ? 2 : size === 'md' ? 2.5 : 3;

  const handleClick = () => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      window.location.href = action.href;
    }
  };

  return (
    <Zoom in timeout={300 + delay}>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
            '& .action-arrow': {
              opacity: 1,
              transform: 'translateX(0)',
            },
            '& .action-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            }
          }
        }}
        onClick={handleClick}
      >
        <CardContent sx={{ p: cardPadding }}>
          <Box
            sx={{
              width: iconSize + 16,
              height: iconSize + 16,
              borderRadius: 2,
              backgroundColor: alpha(action.color || theme.palette.primary.main, 0.1),
              color: action.color || theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              transition: 'transform 0.3s ease',
            }}
            className="action-icon"
          >
            <Box sx={{ fontSize: iconSize }}>
              {getIcon(action.icon)}
            </Box>
          </Box>
          
          <Typography 
            variant={size === 'sm' ? 'body2' : 'body1'} 
            sx={{ 
              fontWeight: 500,
              color: 'text.primary',
              mb: 0.5
            }}
          >
            {action.title}
          </Typography>
          
          {action.description && size !== 'sm' && (
            <Typography variant="caption" color="text.secondary">
              {action.description}
            </Typography>
          )}
          
          <Box
            className="action-arrow"
            sx={{
              position: 'absolute',
              bottom: cardPadding * 8,
              right: cardPadding * 8,
              opacity: 0,
              transform: 'translateX(-10px)',
              transition: 'all 0.3s ease',
              color: action.color || theme.palette.primary.main,
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  actions,
  columns = 4,
  size = 'md'
}) => {
  const { t } = useTranslation('dashboard');
  
  const defaultActions: QuickAction[] = [
    {
      id: '1',
      title: t('label:dashboard.quickActions.submitApplication'),
      icon: 'add',
      color: '#1976d2',
      href: '/applications/new'
    },
    {
      id: '2',
      title: t('label:dashboard.quickActions.templates'),
      icon: 'description',
      color: '#9c27b0',
      href: '/templates'
    },
    {
      id: '3',
      title: t('label:dashboard.quickActions.payment'),
      icon: 'payment',
      color: '#4caf50',
      href: '/payment'
    },
    {
      id: '4',
      title: t('label:dashboard.quickActions.support'),
      icon: 'support',
      color: '#ff9800',
      href: '/support'
    }
  ];

  const displayActions = actions?.length > 0 ? actions : defaultActions;
  const gridColumns = Math.min(columns, displayActions?.length);

  return (
    <WidgetWrapper title={t('label:dashboard.quickActions.title')}>
      <Grid container spacing={2}>
        {displayActions.map((action, index) => (
          <Grid 
            item 
            xs={6} 
            sm={6} 
            md={6} 
            key={action.id}
          >
            <ActionCard
              action={action}
              size={size}
              delay={index * 50}
            />
          </Grid>
        ))}
      </Grid>
    </WidgetWrapper>
  );
};

export default QuickActionsWidget;