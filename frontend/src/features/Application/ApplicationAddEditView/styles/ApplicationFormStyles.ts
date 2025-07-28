// frontend/src/features/Application/ApplicationAddEditView/styles/ApplicationFormStyles.ts

import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { FormStyles } from '../../../../styles/FormStyles';

// Стилизованные компоненты для заголовка формы
export const ApplicationHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export const ApplicationHeaderInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

export const ApplicationNumber = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ApplicationDate = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
}));

// Стилизованные компоненты для секций формы
export const FormSectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: FormStyles.sizes.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  transition: FormStyles.transitions.default,
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const SectionIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: 18,
  },
}));

// Стилизованный компонент для статуса
export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme, statusColor }) => ({
  height: 28,
  fontSize: '13px',
  fontWeight: 500,
  borderRadius: '6px',
  backgroundColor: statusColor || theme.palette.grey[200],
  color: theme.palette.getContrastText(statusColor || theme.palette.grey[200]),
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

// Компонент для отображения статуса (опционально можно вынести в отдельный файл)
export const StatusBadge = StatusChip;

// Стилизованные компоненты для вкладок
export const StyledTabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

export const TabLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const TabBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '12px',
  padding: '2px 8px',
  fontSize: '11px',
  fontWeight: 600,
  minWidth: '20px',
  textAlign: 'center',
}));

// Стилизованные компоненты для автокомплита
export const AutocompleteOption = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1, 0),
}));

export const AutocompleteOptionTitle = styled(Typography)({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
});

export const AutocompleteOptionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
}));

export const AutocompleteHighlight = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  fontWeight: 600,
  padding: '0 2px',
  borderRadius: '2px',
}));

// Стилизованные компоненты для быстрых действий
export const QuickActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

// Утилиты для статусов
export const getStatusColor = (statusCode: string): string => {
  const statusColors: Record<string, string> = {
    draft: '#9E9E9E',
    new: '#2196F3',
    in_progress: '#FF9800',
    completed: '#4CAF50',
    rejected: '#F44336',
    canceled: '#757575',
    on_hold: '#9C27B0',
    approved: '#00BCD4',
  };
  
  return statusColors[statusCode] || '#9E9E9E';
};

// Анимации
export const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 },
};