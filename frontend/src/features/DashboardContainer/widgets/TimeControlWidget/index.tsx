import {
  Box,
  Typography,
  Paper,
  Stack
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import { statisticsStore } from '../../stores/dashboard/StatisticsStore';
import storeApplication from 'features/Application/ApplicationListView/store'
import { useTranslation } from "react-i18next";

const TimeControlWidget = () => {
  const { t } = useTranslation();
  const counts = mapTimeControlData(statisticsStore.time_control);

  const items = [
    {
      key: 'overdue',
      label: t('label:time_control.overdue'),
      icon: <ErrorOutlineIcon />,
      color: '#f44336',
      bgColor: '#fdecea',
    },
    {
      key: 'due_soon_2',
      label: t('label:time_control.due_soon_2'),
      icon: <WarningAmberIcon />,
      color: '#f57c00',
      bgColor: '#fff4e5',
    },
    {
      key: 'due_soon_5',
      label: t('label:time_control.due_soon_5'),
      icon: <AccessTimeIcon />,
      color: '#f9a825',
      bgColor: '#fffde7',
    },
    {
      key: 'in_work',
      label: t('label:time_control.in_work'),
      icon: <FolderOpenIcon />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
  ];

  const handleTimeControlClick = (category: string) => {
    const categoryData = statisticsStore.time_control.find(c => c.deadline_category === category);

    if (!categoryData || !categoryData.ids) return;

    const json = `{"pin": "", "number": "", "tag_id": 0, "address": "", "sort_by": null, "date_end": null, "pageSize": 100, "isExpired": false, "sort_type": null, "useCommon": true, "date_start": null, "pageNumber": 0, "status_ids": [], "district_id": 0, "employee_id": 0, "service_ids": [], "customerName": "", "deadline_day": 0, "common_filter": "", "structure_ids": [], "isMyOrgApplication": false, "withoutAssignedEmployee": false}`;
    let filterData = JSON.parse(json);
    filterData.app_ids = categoryData.ids; // передаём массив ID
    storeApplication.filter = filterData;
    storeApplication.setFilterToLocalStorage();
    window.open('/user/Application', '_blank');
  };

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <AccessAlarmsIcon color="action" />
        <Typography variant="subtitle1" fontWeight={600}>
          {t('label:time_control.title')}
        </Typography>
      </Stack>

      <Stack spacing={1}>
        {items.map((item) => (
          <Box
            key={item.key}
            onClick={() => handleTimeControlClick(item.key)}
            sx={{
              backgroundColor: item.bgColor,
              border: `1px solid ${item.color}`,
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ color: item.color }}>{item.icon}</Box>
              <Typography fontWeight={500} sx={{ color: item.color }}>
                {item.label}
              </Typography>
            </Stack>
            <Typography fontWeight={600} sx={{ color: item.color }}>
              {counts[item.key] ?? 0}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

function mapTimeControlData(data: Array<{ deadline_category: string, count: number }>) {
  return data.reduce((acc, item) => {
    acc[item.deadline_category] = item.count;
    return acc;
  }, {} as Record<string, number>);
}

export default TimeControlWidget;