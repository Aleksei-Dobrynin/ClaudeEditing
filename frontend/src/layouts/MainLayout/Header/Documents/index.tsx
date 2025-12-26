import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { Badge, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Иконки
import NotificationsIcon from '@mui/icons-material/Notifications';

// Store
import store from './store';

interface DocumentNotificationsViewProps {
  // Можно добавить дополнительные пропсы при необходимости
}

const DocumentNotificationsView: FC<DocumentNotificationsViewProps> = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    store.getCountDocuments();
    const timer = setInterval(() => {
      store.getCountDocuments();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Обработчик клика - переход на страницу документов
  const handleClick = () => {
    navigate('/user/UnsignedDocuments');
  };

  return (
    <Badge badgeContent={store.countDocuments} color="secondary">
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        size="small"
        startIcon={
          <Badge badgeContent={store.notificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        }
      >
        {t('label:DocumentNotificationsView.documentsForApproval')}
      </Button>
    </Badge>
  );
});

export default DocumentNotificationsView;