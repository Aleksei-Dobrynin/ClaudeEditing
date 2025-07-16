import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Badge,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Paper,
  Popover,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';

// Иконки из MUI
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FilterListIcon from '@mui/icons-material/FilterList';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';

// Store
import store from './store';
import { IApplication, IDocumentFilters } from './store';

interface DocumentNotificationsViewProps {
  // Можно добавить дополнительные пропсы при необходимости
}

const DocumentNotificationsView: FC<DocumentNotificationsViewProps> = observer(() => {
  const { t } = useTranslation();

  // Состояние Popover для фильтров
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const openFilters = Boolean(anchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Обработчик применения фильтров
  const handleApplyFilters = () => {
    store.applyFilters();
    handleFilterClose();
  };

  // Обработчик поиска с задержкой ввода
  const [searchValue, setSearchValue] = React.useState('');
  const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Отменяем предыдущий таймаут, если он есть
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Устанавливаем новый таймаут для отправки поискового запроса
    const timeoutId = setTimeout(() => {
      store.setSearchTerm(value);
    }, 500); // Задержка 500 мс

    setSearchTimeout(timeoutId);
  };

  // Форматирование даты
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  useEffect(() => {
    store.getCountDocuments()
    const timer = setInterval(() => {
      store.getCountDocuments()
    }, 10000)
    return () => {
      clearInterval(timer)
    }
  }, [])


  // Рендер статуса документа
  const renderDocumentStatus = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'approved') {
      return (
        <Chip
          icon={<CheckCircleIcon fontSize="small" />}
          label={t('label:DocumentNotificationsView.statusApproved')}
          color="success"
          size="small"
          variant="outlined"
        />
      );
    } else if (status === 'rejected') {
      return (
        <Chip
          icon={<CancelIcon fontSize="small" />}
          label={t('label:DocumentNotificationsView.statusRejected')}
          color="error"
          size="small"
          variant="outlined"
        />
      );
    } else {
      return (
        <Chip
          label={t('label:DocumentNotificationsView.statusPending')}
          color="primary"
          variant="outlined"
          size="small"
        />
      );
    }
  };

  // Рендер чипа статуса заявки
  const renderApplicationStatus = (application: IApplication) => {
    const status = store.getApplicationStatus(application);

    if (status === 'approved') {
      return (
        <Chip
          icon={<CheckCircleIcon fontSize="small" />}
          label={t('label:DocumentNotificationsView.statusApproved')}
          color="success"
          size="small"
        />
      );
    } else if (status === 'rejected') {
      return (
        <Chip
          icon={<CancelIcon fontSize="small" />}
          label={t('label:DocumentNotificationsView.statusRejected')}
          color="error"
          size="small"
        />
      );
    } else if (store.isOverdue(application.deadline)) {
      return (
        <Chip
          icon={<WarningAmberIcon fontSize="small" />}
          label={t('label:DocumentNotificationsView.statusOverdue')}
          color="warning"
          size="small"
        />
      );
    } else {
      return <span></span>
      // return (
      //   <Chip
      //     label={t('label:DocumentNotificationsView.statusPending')}
      //     color="primary"
      //     variant="outlined"
      //     size="small"
      //   />
      // );
    }
  };

  // Рендер карточки заявки с документами
  const renderApplicationCard = (application: IApplication) => (
    <ListItem
      key={application.app_id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        py: 2,
        borderBottom: '2px solid #e0e0e0',
        bgcolor: 'background.paper',
        mb: 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
        borderRadius: 1
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {t('label:DocumentNotificationsView.applicationNumber', { id: application.app_number })}
        </Typography>
        <Typography
          variant="body2"
          color={store.isOverdue(application.deadline) ? "error" : "text.secondary"}
          fontWeight={store.isOverdue(application.deadline) ? "bold" : "regular"}
        >
          {t('label:DocumentNotificationsView.deadline')}: {formatDate(application.deadline)}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, mt: 1 }}>
        {application.service_name} ({application.service_days})
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        {t('label:DocumentNotificationsView.customer')}: {application.full_name}
      </Typography>

      {/* Список документов */}
      <Paper variant="outlined" sx={{ mt: 1, mb: 2, overflow: 'hidden', borderRadius: 1 }}>
        <List dense disablePadding>
          {application.documents.map((doc, index) => (
            <Box key={doc.uploaded_document_id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  py: 1,
                  backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <DescriptionIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={doc.document_name}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
                <Box ml={1}>
                  {renderDocumentStatus(doc.document_status)}
                </Box>
              </ListItem>
            </Box>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {renderApplicationStatus(application)}

        <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => store.navigateToApplication(application.task_id, application.app_step_id)}
        >
          {t('label:DocumentNotificationsView.navigate')}
        </Button>
      </Box>
    </ListItem>
  );

  // Рендер индикатора загрузки
  const renderLoader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, bgcolor: 'white', borderRadius: 1, m: 1 }}>
      <CircularProgress size={40} />
    </Box>
  );

  // Рендер пустого состояния
  const renderEmptyState = () => (
    <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', bgcolor: 'white', borderRadius: 1, m: 1 }}>
      <Typography>{t('label:DocumentNotificationsView.noDocuments')}</Typography>
    </Box>
  );

  return (
    <>
      {/* Кнопка для открытия панели уведомлений */}
      {/* <Box sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1000 }}> */}
      <Badge badgeContent={store.countDocuments} color="secondary">
        <Button
          variant="contained"
          color="primary"
          onClick={store.toggleDrawer}
          size='small'
          startIcon={
            <Badge badgeContent={store.notificationCount} color="error">
              <NotificationsIcon />
            </Badge>
          }
        >
          {t('label:DocumentNotificationsView.documentsForApproval')}
        </Button>
      </Badge>
      {/* </Box> */}

      {/* Боковая панель с уведомлениями */}
      <Drawer
        anchor="right"
        open={store.drawerOpen}
        onClose={store.toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Заголовок панели */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            bgcolor: 'white'
          }}>
            <Typography variant="h6">{t('label:DocumentNotificationsView.documentsForApproval')}</Typography>
            <IconButton onClick={store.toggleDrawer} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Строка поиска и фильтров */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder={t('label:DocumentNotificationsView.search')}
                value={searchValue}
                onChange={handleSearchChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>

              {/* Popover с фильтрами */}
              <Popover
                open={openFilters}
                anchorEl={anchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{ mt: 1 }}
              >
                <Paper sx={{ p: 2, width: 250 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('label:DocumentNotificationsView.documentStatus')}</Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={store.tempFilters.showPending}
                          onChange={() => store.updateTempFilter('showPending', !store.tempFilters.showPending)}
                          size="small"
                        />
                      }
                      label={t('label:DocumentNotificationsView.showPending')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={store.tempFilters.showApproved}
                          onChange={() => store.updateTempFilter('showApproved', !store.tempFilters.showApproved)}
                          size="small"
                        />
                      }
                      label={t('label:DocumentNotificationsView.showApproved')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={store.tempFilters.showRejected}
                          onChange={() => store.updateTempFilter('showRejected', !store.tempFilters.showRejected)}
                          size="small"
                        />
                      }
                      label={t('label:DocumentNotificationsView.showRejected')}
                    />
                  </FormGroup>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('label:DocumentNotificationsView.deadline')}</Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={store.tempFilters.showOverdue}
                          onChange={() => store.updateTempFilter('showOverdue', !store.tempFilters.showOverdue)}
                          size="small"
                        />
                      }
                      label={t('label:DocumentNotificationsView.showOverdueOnly')}
                    />
                  </FormGroup>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" size="small" onClick={store.resetFilters}>
                      {t('label:DocumentNotificationsView.reset')}
                    </Button>
                    <Button variant="contained" size="small" onClick={handleApplyFilters}>
                      {t('label:DocumentNotificationsView.apply')}
                    </Button>
                  </Box>
                </Paper>
              </Popover>
            </Box>
          </Box>

          {/* Список заявок */}
          <List sx={{ flex: 1, overflowY: 'auto', p: 1, bgcolor: '#f5f5f5' }}>
            {store.isLoading ? (
              renderLoader()
            ) : store.applications.length > 0 ? (
              store.applications.map((app) => renderApplicationCard(app))
            ) : (
              renderEmptyState()
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
});

export default DocumentNotificationsView;