import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { getStepStatusLogsByApplicationStep } from 'api/stepstatuslog';
import { observer } from 'mobx-react';

interface StepStatusLog {
  id: number;
  app_step_id: number;
  old_status: string;
  new_status: string;
  change_date: string;
  comments: string;
  created_at: string;
  created_by: number;
  created_user_name?: string;
}

interface StepStatusHistoryGridProps {
  stepId: number;
}

const StepStatusHistoryGrid: React.FC<StepStatusHistoryGridProps> = observer(({ stepId }) => {
  const [logs, setLogs] = useState<StepStatusLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [stepId]);

  const loadLogs = async () => {
    if (!stepId) return;
    
    try {
      setLoading(true);
      const response = await getStepStatusLogsByApplicationStep(stepId);
      if (response.status === 200 && response.data) {
        setLogs(response.data);
      }
    } catch (error) {
      console.error('Error loading status logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      completed: { label: 'Завершен', color: 'success' as const },
      in_progress: { label: 'В процессе', color: 'primary' as const },
      waiting: { label: 'В ожидании', color: 'default' as const },
      paused: { label: 'Приостановлен', color: 'warning' as const },
    };

    const config = statusConfig[status] || { label: status, color: 'default' as const };
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="filled"
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (logs.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          История изменений отсутствует
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Дата изменения</TableCell>
            <TableCell>Старый статус</TableCell>
            <TableCell>Новый статус</TableCell>
            <TableCell>Комментарий</TableCell>
            <TableCell>Изменил</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} hover>
              <TableCell>{formatDate(log.change_date)}</TableCell>
              <TableCell>{getStatusChip(log.old_status)}</TableCell>
              <TableCell>{getStatusChip(log.new_status)}</TableCell>
              <TableCell>{log.comments || '—'}</TableCell>
              <TableCell>{log.created_user_name || `ID: ${log.created_by}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default StepStatusHistoryGrid;