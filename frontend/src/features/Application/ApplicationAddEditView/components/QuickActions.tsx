// frontend/src/features/Application/ApplicationAddEditView/components/QuickActions.tsx

import React, { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import HistoryIcon from '@mui/icons-material/History';
import { QuickActionsContainer } from '../styles/ApplicationFormStyles';

interface QuickActionsProps {
  onPrint?: () => void;
  onDuplicate?: () => void;
  onShare?: () => void;
  onShowHistory?: () => void;
  disabled?: boolean;
}

const QuickActions: FC<QuickActionsProps> = ({
  onPrint,
  onDuplicate,
  onShare,
  onShowHistory,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <QuickActionsContainer>
      {onShowHistory && (
        <Tooltip title={t('common:history', 'История изменений')}>
          <IconButton
            onClick={onShowHistory}
            disabled={disabled}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      )}
      
      {onDuplicate && (
        <Tooltip title={t('common:duplicate', 'Дублировать')}>
          <IconButton
            onClick={onDuplicate}
            disabled={disabled}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      )}
      
      {onShare && (
        <Tooltip title={t('common:share', 'Поделиться')}>
          <IconButton
            onClick={onShare}
            disabled={disabled}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
      )}
      
      {onPrint && (
        <Tooltip title={t('common:print', 'Печать')}>
          <IconButton
            onClick={onPrint}
            disabled={disabled}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <PrintIcon />
          </IconButton>
        </Tooltip>
      )}
    </QuickActionsContainer>
  );
};

export default QuickActions;