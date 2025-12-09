import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
  Grow,
  Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { statisticsStore } from '../../stores/dashboard/StatisticsStore';
import { StatisticsWidgetProps, DashboardStats } from '../../types/dashboard';
import WidgetWrapper from '../../components/WidgetWrapper';
import SkeletonLoader from '../../components/SkeletonLoader';
import { useWidget } from '../../hooks/useWidget';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import storeApplication from 'features/Application/ApplicationListView/store'

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  url?: string;
  onClick?: () => void;
  delay?: number;
}> = ({ title, value, icon, color, trend, onClick, delay = 0 }) => {
  const theme = useTheme();

  return (
    <Grow in timeout={300 + delay}>
      <Card
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          } : {},
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ mb: 0.5, fontWeight: 600 }}>
                <CountUp
                  start={0}
                  end={value}
                  duration={1.5}
                  separator=" "
                  delay={delay / 1000}
                />
              </Typography>

            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(color, 0.1),
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>

        </CardContent>
      </Card>
    </Grow>
  );
};

const StatisticsWidget: React.FC<StatisticsWidgetProps> = observer(({
  size = 'normal',
  onCardClick,
  refreshInterval = 30000
}) => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const { refresh } = useWidget({
    widgetId: 'widget-statistics',
    refreshInterval
  });

  const buildFilterAndOpen = (ids: number[]) => {
    const json = `{"pin": "", "number": "", "tag_id": 0, "address": "", "sort_by": null, "date_end": null, "pageSize": 100, "isExpired": false, "sort_type": null, "useCommon": true, "date_start": null, "pageNumber": 0, "status_ids": [], "district_id": 0, "employee_id": 0, "service_ids": [], "customerName": "", "deadline_day": 0, "common_filter": "", "structure_ids": [], "isMyOrgApplication": false, "withoutAssignedEmployee": false}`
    let filterData = JSON.parse(json);
    let filter = storeApplication.filter;
    filterData.app_ids = ids;
    storeApplication.filter = filterData;
    storeApplication.setFilterToLocalStorage();
    window.open('/user/Application', '_blank');
  };

  useEffect(() => {
    if (!statisticsStore.lastUpdated) {
      statisticsStore.fetchStatistics();
    }
  }, []);

  const stats: Array<{
    key: keyof DashboardStats;
    title: string;
    icon: React.ReactNode;
    color: string;
    trend?: number;
    url?: string;
    onClick?: () => void;
  }> = [
      {
        key: 'assigned_to_me',
        title: t('label:dashboard.statistics.assigned_to_me'),
        icon: <AssignmentIndIcon />,
        color: theme.palette.primary.main,
        trend: -5,
        onClick: () => buildFilterAndOpen(statisticsStore.assigned_to_me_list.map(x => x.id))
      },
      {
        key: 'completed_applications',
        title: t('label:dashboard.statistics.completed_applications'),
        icon: <CheckCircleIcon />,
        color: theme.palette.success.main,
        trend: -5,
        onClick: () => buildFilterAndOpen(statisticsStore.completed_applications_list.map(x => x.id))
      },
      {
        key: 'overdue_applications',
        title: t('label:dashboard.statistics.overdue_applications'),
        icon: <WatchLaterIcon />,
        color: theme.palette.error.main,
        trend: 8,
        onClick: () => buildFilterAndOpen(statisticsStore.overdue_applications_list.map(x => x.id))
      },
      {
        key: 'unsigned_documents',
        title: t('label:dashboard.statistics.unsigned_documents'),
        icon: <PendingActionsIcon />,
        color: theme.palette.info.main,
        trend: 15,
        onClick: () => buildFilterAndOpen(statisticsStore.unsigned_documents_list.map(x => x.id))
      }
    ];

  const navigate = useNavigate()
  const handleCardClick = (statType: keyof DashboardStats) => {
    if (onCardClick) {
      onCardClick(statType);
    }
  };

  const handleRefresh = async () => {
    await statisticsStore.refreshStatistics();
    refresh();
  };

  if (statisticsStore.isLoading && !statisticsStore.lastUpdated) {
    return <SkeletonLoader type="statistics" />;
  }

  return (
    <WidgetWrapper
      title={t('label:dashboard.statistics.title')}
      loading={statisticsStore.isLoading}
      error={statisticsStore.error}
      onRefresh={handleRefresh}
    >
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={size === 'compact' ? 6 : 3}
            key={stat.key}
          >
            <StatCard
              title={stat.title}
              value={statisticsStore.stats[stat.key]}
              icon={stat.icon}
              color={stat.color}
              url={stat.url}
              trend={stat.trend}
              onClick={() => {
                if (stat.onClick) stat.onClick();
                else if (stat.url) navigate(stat.url);
              }}
              delay={index * 100}
            />
          </Grid>
        ))}
      </Grid>

      {size !== 'compact' && (
        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {statisticsStore.lastUpdated &&
              `Обновлено: ${new Date(statisticsStore.lastUpdated).toLocaleTimeString()}`
            }
          </Typography>
        </Box>
      )}
    </WidgetWrapper>
  );
});

export default StatisticsWidget;