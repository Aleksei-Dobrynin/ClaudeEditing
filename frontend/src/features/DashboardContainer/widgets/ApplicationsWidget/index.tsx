// components/dashboard-beta/widgets/ApplicationsWidget/index.tsx

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ApplicationsWidgetProps, Application, ActionType } from '../../types/dashboard';
import { ACTION_TYPE_COLORS, URGENCY_COLORS } from '../../constants/dashboard';
import { useApplications } from '../../hooks/useApplications';
import WidgetWrapper from '../../components/WidgetWrapper';
import EmptyState from '../../components/EmptyState';
import SkeletonLoader from '../../components/SkeletonLoader';
import { useNavigate } from 'react-router-dom';

const getActionIcon = (actionType?: ActionType) => {
  switch (actionType) {
    case 'return_with_error':
      return <UploadIcon />;
    case 'documents_ready':
      return <EditIcon />;
    case 'payment_required':
      return <PaymentIcon />;
    case 'signature_required':
      return <CheckCircleIcon />;
    default:
      return null;
  }
};

const ApplicationCard: React.FC<{
  application: Application;
  layout: 'grid' | 'list';
  onClick?: (id: string) => void;
}> = ({ application, layout, onClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const cardContent = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary">
            {t('label:dashboard.applications.application')} #{application.number}
          </Typography>
          {/* {application.urgency === 'high' && (
            <Chip
              label={t('label:dashboard.actions.urgent')}
              size="small"
              color="error"
              sx={{ height: 20 }}
            />
          )} */}
        </Box>
        {/* <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton> */}
      </Box>

      <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
        {application.service_name}
      </Typography>

      {application.status_code && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            p: 1.5,
            borderRadius: 1,
            backgroundColor: alpha(ACTION_TYPE_COLORS[application.status_code], 0.1),
            color: ACTION_TYPE_COLORS[application.status_code]
          }}
        >
          {getActionIcon(application.status_code)}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {application.status_name}
            {/* {t(`label:dashboard.actions.${application.status_code === 'documents' ? 'uploadDocuments' : 
              application.actionType === 'contract' ? 'signContract' : 
              application.actionType === 'payment' ? 'payService' : 'getResult'}`)} */}
          </Typography>
        </Box>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {application.status_description}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {application.address}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {new Date(application.registration_date).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* {application.progress !== undefined && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {t('label:dashboard.applications.progress')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {application.progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={application.progress} 
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )} */}

      {/* {application.daysRemaining !== undefined && (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: alpha(
              application.daysRemaining <= 3 ? theme.palette.error.main :
              application.daysRemaining <= 7 ? theme.palette.warning.main :
              theme.palette.success.main,
              0.1
            ),
            color: 
              application.daysRemaining <= 3 ? theme.palette.error.main :
              application.daysRemaining <= 7 ? theme.palette.warning.main :
              theme.palette.success.main
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {application.daysRemaining} {t('label:dashboard.applications.days')}
          </Typography>
        </Box>
      )} */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Просмотреть детали</MenuItem>
        <MenuItem onClick={handleMenuClose}>Редактировать</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>Архивировать</MenuItem>
      </Menu>
    </>
  );

  if (layout === 'list') {
    return (
      <Card 
        sx={{ 
          mb: 2, 
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: theme.shadows[4]
          }
        }}
        onClick={() => onClick?.(application.id)}
      >
        <CardContent sx={{ p: 2 }}>
          {cardContent}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
      onClick={() => onClick?.(application.id)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {cardContent}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Button 
          size="small" 
          endIcon={<ArrowForwardIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/ApplicationEdit?id=${application.id}`)
            // onClick?.(application.id);
          }}
        >
          {t('label:dashboard.applications.goTo')}
        </Button>
      </CardActions>
    </Card>
  );
};

const ApplicationsWidget: React.FC<ApplicationsWidgetProps> = observer(({
  maxItems = 4,
  showFilters = true,
  onApplicationClick,
  layout: initialLayout = 'grid'
}) => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const [layout, setLayout] = useState<'grid' | 'list'>(initialLayout);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [selectedFilters, setSelectedFilters] = useState<ActionType[]>([]);
  const navigate = useNavigate();

  const {
    applications,
    isLoading,
    error,
    refresh,
  } = useApplications({
    limit: maxItems,
    filters: selectedFilters
  });

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleSortClose = () => {
    setSortAnchor(null);
  };

  // const handleFilterChange = (filter: ActionType) => {
  //   const newFilters = selectedFilters.includes(filter)
  //     ? selectedFilters.filter(f => f !== filter)
  //     : [...selectedFilters, filter];
  //   setSelectedFilters(newFilters);
  //   setFilter(newFilters);
  // };

  const actions = (
    <>
      {showFilters && (
        <>
          {/* <IconButton size="small" onClick={handleFilterClick}>
            <FilterListIcon />
          </IconButton>
          <IconButton size="small" onClick={handleSortClick}>
            <SortIcon />
          </IconButton> */}
          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={(_, value) => value && setLayout(value)}
            size="small"
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </>
      )}
    </>
  );

  if (isLoading && applications.length === 0) {
    return (
      <WidgetWrapper
        title={t('label:dashboard.applications.title')}
        actions={actions}
      >
        <SkeletonLoader type={layout} count={maxItems} />
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper
      title={t('label:dashboard.applications.title')}
      loading={isLoading}
      error={error}
      actions={actions}
      onRefresh={refresh}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('label:dashboard.applications.description')}
      </Typography>

      {applications.length === 0 ? (
        <EmptyState
          title="Нет заявок требующих внимания"
          description="Все ваши заявки обработаны"
          iconType="inbox"
        />
      ) : (
        <>
          {layout === 'grid' ? (
            <Grid container spacing={2}>
              {applications.map((app, index) => (
                <Fade in key={app.id} timeout={300 + index * 100}>
                  <Grid item xs={12} sm={6}>
                    <ApplicationCard
                      application={app}
                      layout={layout}
                      onClick={onApplicationClick}
                    />
                  </Grid>
                </Fade>
              ))}
            </Grid>
          ) : (
            <Box>
              {applications.map((app, index) => (
                <Fade in key={app.id} timeout={300 + index * 100}>
                  <Box>
                    <ApplicationCard
                      application={app}
                      layout={layout}
                      onClick={onApplicationClick}
                    />
                  </Box>
                </Fade>
              ))}
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                navigate("/user/ApplicationNeedAction")
              }}
              endIcon={<ArrowForwardIcon />}
            >
              {t('label:dashboard.applications.showAll')}
            </Button>
          </Box>
        </>
      )}

      {/* <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handleFilterChange('documents')}>
          <Chip
            size="small"
            label="Документы"
            color={selectedFilters.includes('documents') ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          />
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange('contract')}>
          <Chip
            size="small"
            label="Контракт"
            color={selectedFilters.includes('contract') ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          />
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange('payment')}>
          <Chip
            size="small"
            label="Оплата"
            color={selectedFilters.includes('payment') ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          />
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange('review')}>
          <Chip
            size="small"
            label="Результат"
            color={selectedFilters.includes('review') ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          />
        </MenuItem>
      </Menu> */}

      {/* <Menu
        anchorEl={sortAnchor}
        open={Boolean(sortAnchor)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => { setSortBy('urgency'); handleSortClose(); }}>
          По срочности
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('date'); handleSortClose(); }}>
          По дате
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('progress'); handleSortClose(); }}>
          По прогрессу
        </MenuItem>
      </Menu> */}
    </WidgetWrapper>
  );
});

export default ApplicationsWidget;