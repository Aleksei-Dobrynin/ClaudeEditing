// components/dashboard-beta/widgets/CalendarWidget/index.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  NotificationImportant as NotificationIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CalendarWidgetProps, CalendarEvent } from '../../types/dashboard';
import WidgetWrapper from '../../components/WidgetWrapper';
import EmptyState from '../../components/EmptyState';

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  events = [],
  onDateSelect,
  compactMode = true
}) => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    t('label:dashboard.calendar.months.january'),
    t('label:dashboard.calendar.months.february'),
    t('label:dashboard.calendar.months.march'),
    t('label:dashboard.calendar.months.april'),
    t('label:dashboard.calendar.months.may'),
    t('label:dashboard.calendar.months.june'),
    t('label:dashboard.calendar.months.july'),
    t('label:dashboard.calendar.months.august'),
    t('label:dashboard.calendar.months.september'),
    t('label:dashboard.calendar.months.october'),
    t('label:dashboard.calendar.months.november'),
    t('label:dashboard.calendar.months.december')
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const getEventsForDate = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'deadline':
        return <NotificationIcon fontSize="small" color="error" />;
      case 'meeting':
        return <EventIcon fontSize="small" color="primary" />;
      case 'reminder':
        return <ScheduleIcon fontSize="small" color="action" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = 
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      const isSelected = 
        selectedDate &&
        day === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();

      days.push(
        <Box
          key={day}
          onClick={() => handleDateClick(day)}
          sx={{
            aspectRatio: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: isSelected 
              ? theme.palette.primary.main 
              : isToday 
              ? alpha(theme.palette.primary.main, 0.1)
              : 'transparent',
            color: isSelected ? 'primary.contrastText' : 'text.primary',
            '&:hover': {
              backgroundColor: isSelected 
                ? theme.palette.primary.dark
                : alpha(theme.palette.action.hover, 0.1),
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: isToday ? 600 : 400 }}>
            {day}
          </Typography>
          {dayEvents?.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 2,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: theme.palette.error.main,
              }}
            />
          )}
        </Box>
      );
    }

    return days;
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <WidgetWrapper title={t('label:dashboard.calendar.title')}>
      <Box>
        {/* Calendar Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <IconButton size="small" onClick={handlePreviousMonth}>
            <ChevronLeftIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          
          <IconButton size="small" onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Calendar Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            mb: 3,
          }}
        >
          {/* Day headers */}
          {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(day => (
            <Typography
              key={day}
              variant="caption"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontWeight: 500,
                py: 1,
              }}
            >
              {day}
            </Typography>
          ))}
          
          {/* Calendar days */}
          {renderCalendar()}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Upcoming Events */}
        {upcomingEvents?.length > 0 ? (
          <>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
              Ближайшие события
            </Typography>
            <List dense disablePadding>
              {upcomingEvents.map(event => (
                <ListItem key={event.id} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {getEventIcon(event.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    secondary={new Date(event.date).toLocaleDateString()}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <EmptyState
            title={t('label:dashboard.calendar.noEvents')}
            iconType="calendar"
            height={150}
          />
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            fullWidth
          >
            {t('label:dashboard.calendar.addReminder')}
          </Button>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default CalendarWidget;