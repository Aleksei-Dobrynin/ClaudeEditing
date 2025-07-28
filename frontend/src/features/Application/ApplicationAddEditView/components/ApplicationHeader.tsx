// frontend/src/features/Application/ApplicationAddEditView/components/ApplicationHeader.tsx

import React, { FC } from 'react';
import { Box, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import {
  ApplicationHeaderContainer,
  ApplicationHeaderInfo,
  ApplicationNumber,
  ApplicationDate,
  StatusChip,
  getStatusColor,
} from '../styles/ApplicationFormStyles';
import dayjs from 'dayjs';

interface ApplicationHeaderProps {
  number?: string;
  registrationDate?: string;
  status?: {
    id: number;
    name: string;
    code: string;
  };
  createdBy?: string;
  loading?: boolean;
}

const ApplicationHeader: FC<ApplicationHeaderProps> = observer(({
  number,
  registrationDate,
  status,
  createdBy,
  loading,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <ApplicationHeaderContainer>
        <ApplicationHeaderInfo>
          <Skeleton variant="text" width={150} height={32} />
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="rounded" width={100} height={28} />
        </ApplicationHeaderInfo>
      </ApplicationHeaderContainer>
    );
  }

  const isNewApplication = !number || number === '0';

  return (
    <ApplicationHeaderContainer>
      <ApplicationHeaderInfo>
        <ApplicationNumber>
          {isNewApplication
            ? t('label:ApplicationAddEditView.newApplication', 'Новая заявка')
            : `${t('label:ApplicationAddEditView.applicationNumber', 'Заявка')} №${number}`}
        </ApplicationNumber>
        
        {registrationDate && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <ApplicationDate>
              {dayjs(registrationDate).format('DD.MM.YYYY HH:mm')}
            </ApplicationDate>
          </Box>
        )}
        
        {createdBy && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <ApplicationDate>{createdBy}</ApplicationDate>
          </Box>
        )}
        
        {status && (
          <StatusChip
            label={status.name}
            statusColor={getStatusColor(status.code)}
          />
        )}
      </ApplicationHeaderInfo>
    </ApplicationHeaderContainer>
  );
});

export default ApplicationHeader;