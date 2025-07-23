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

const TimeControlWidget = () => {
  const counts = mapTimeControlData(statisticsStore.time_control);

  const items = [
    {
      key: 'overdue',
      label: 'Просрочено',
      icon: <ErrorOutlineIcon />,
      color: '#f44336',
      bgColor: '#fdecea',
    },
    {
      key: 'due_soon_2',
      label: 'Осталось 3 дня',
      icon: <WarningAmberIcon />,
      color: '#f57c00',
      bgColor: '#fff4e5',
    },
    {
      key: 'due_soon_5',
      label: 'Осталось 5 дней',
      icon: <AccessTimeIcon />,
      color: '#f9a825',
      bgColor: '#fffde7',
    },
    {
      key: 'in_work',
      label: 'В работе',
      icon: <FolderOpenIcon />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <AccessAlarmsIcon color="action" />
        <Typography variant="subtitle1" fontWeight={600}>
          Контроль сроков
        </Typography>
      </Stack>

      <Stack spacing={1}>
        {items.map((item) => (
          <Box
            key={item.key}
            sx={{
              backgroundColor: item.bgColor,
              border: `1px solid ${item.color}`,
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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