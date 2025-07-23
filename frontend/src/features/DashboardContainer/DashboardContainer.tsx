import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react-lite';
import {
  Container,
  Grid,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Skeleton,
  Stack,
  Paper,
  Chip,
  Typography
} from '@mui/material';
import { DashboardContainerProps } from './types/dashboard';
import { dashboardStore } from './stores/dashboard/DashboardStore';
import { statisticsStore } from './stores/dashboard/StatisticsStore';
import StatisticsWidget from './widgets/StatisticsWidget';
import TimeControlWidget from './widgets/TimeControlWidget';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from "react-router-dom";
import MainStore from "../../MainStore";
import Faq_questionAccordions from "../faq_question/faq_questionListView/accordion";
import DateField from "../../components/DateField";
import dayjs from "dayjs";
import store from "../Application/ApplicationsFromCabinet/store";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";

const DashboardContainer: React.FC<DashboardContainerProps> = observer(({
  layout = 'grid',
  theme = 'light',
  widgets,
}) => {
  const { t } = useTranslation('dashboard');
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    statisticsStore.fetchStatistics();
    statisticsStore.startAutoRefresh();

    return () => {
      statisticsStore.stopAutoRefresh();
    };
  }, []);

  useEffect(() => {
  }, [layout, theme, widgets]);

  const muiTheme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            },
          },
        },
      },
    },
  });

  const renderWidget = (widgetConfig: any) => {
    if (!widgetConfig.enabled) return null;

    const widgetProps = {
      key: widgetConfig.id,
      ...widgetConfig.settings,
    };

    const visibleApplications = showAll
      ? statisticsStore.allApplications
      : statisticsStore.allApplications.slice(0, 4);

    switch (widgetConfig.type) {
      case 'statistics':
        return <StatisticsWidget {...widgetProps} />;
      case 'applications':
        return (
          <Stack spacing={2}>
            <Grid container spacing={2}>
            {visibleApplications.map((item, index) => {
              const categoryColors = {
                assigned_to_me: 'warning.main',
                completed_applications: 'success.main',
                overdue_applications: 'error.main',
                unsigned_documents: 'info.main',
              };

              const backgroundColor = categoryColors[item.category] || 'grey.400';

              const categoryLabels = {
                assigned_to_me: 'Назначено на меня',
                completed_applications: 'Завершено',
                overdue_applications: 'Просрочено',
                unsigned_documents: 'На подписание',
              };

              return (
                <Grid item xs={12} sm={6} key={index}>
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: backgroundColor,
                    backgroundColor: `${backgroundColor}10`,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  {/* Метка категории */}
                  <Chip
                    label={categoryLabels[item.category]}
                    size="small"
                    sx={{
                      backgroundColor,
                      color: '#fff',
                      fontWeight: 500,
                    }}
                  />

                  {/* Просрочка */}
                  {item.overdue_days > 0 && (
                    <Chip
                      label={`${item.overdue_days} дней просрочки`}
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    />
                  )}

                  {/* Номер заявки */}
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <ErrorOutlineIcon color="error" />
                    <Typography fontWeight={600} color="error.main">
                      №{item.number}
                    </Typography>
                  </Stack>

                  {/* Услуга */}
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {item.service_name}
                  </Typography>

                  {/* Адрес */}
                  <Typography variant="body2" color="text.secondary">
                    {item.addresses}
                  </Typography>

                  {/* Заявитель */}
                  {item.customer_name && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Заявитель: {item.customer_name}
                    </Typography>
                  )}

                  {/* Этап и действия */}
                  {(item.step_name || item.required_action) && (
                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                        p: 1,
                        my: 1,
                      }}
                    >
                      {item.step_name && (
                        <Typography fontSize={14}>
                          <strong>Этап:</strong> {item.step_name}
                        </Typography>
                      )}
                      {item.required_action && (
                        <Typography fontSize={14}>
                          <strong>Требуется:</strong> {item.required_action}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Исполнитель и кнопка */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                    {item.executor_name && (
                      <Typography variant="body2" color="text.secondary">
                        Исполнитель: {item.executor_name}
                      </Typography>
                    )}
                    <Link
                      style={{ textDecoration: "underline", marginLeft: 5 }}
                      target="_blank"
                      to={`/user/Application/addedit?id=${item.id}`}>
                      Открыть →
                    </Link>
                  </Stack>
                </Paper>
                </Grid>
              );
            })}
            </Grid>
            {!showAll && statisticsStore.allApplications.length > 4 && (
              <Box mt={2} textAlign="center">
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <Button variant="outlined" onClick={() => setShowAll(true)}>
                  Показать все критичные заявки →
                </Button>
              </Box>
            )}
          </Stack>
        );
      case 'reference':
        return <TimeControlWidget />
      default:
        return null;
    }
  };

  const getGridSize = (widgetType: string, size?: string) => {
    const baseSize = {
      statistics: { xs: 12, sm: 12, md: 12, lg: 12 },
      applications: { xs: 12, sm: 12, md: 12, lg: 12 },
      quickActions: { xs: 12, sm: 12, md: 4, lg: 4 },
      calendar: { xs: 12, sm: 6, md: 4, lg: 4 },
      reference: { xs: 12, sm: 12, md: 12, lg: 12 },
    };

    return baseSize[widgetType] || { xs: 12, sm: 6, md: 4, lg: 4 };
  };

  if (dashboardStore.isLoading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {!MainStore.isEmployee ? <Faq_questionAccordions /> :
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" spacing={2} mb={2}>
            <DateField
              value={dayjs(statisticsStore.startDate)}
              onChange={(event) => {
                statisticsStore.startDate = event.target.value;
                statisticsStore.fetchStatistics();
              }}
              name="startDate"
              id="startDate"
              label={t('label:dashboard.statistics.startDate')}
              helperText={store.errors.startDate}
              error={!!store.errors.startDate}
            />
            <DateField
              value={dayjs(statisticsStore.endDate)}
              onChange={(event) => {
                statisticsStore.endDate = event.target.value;
                statisticsStore.fetchStatistics();
              }}
              name="endDate"
              id="endDate"
              label={t('label:dashboard.statistics.endDate')}
              helperText={store.errors.endDate}
              error={!!store.errors.endDate}
            />
          </Stack>
          {layout === 'grid' ? (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {dashboardStore.enabledWidgets.map((widget) => (
                <Grid
                  item
                  key={widget.id}
                  {...getGridSize(widget.type, widget.size)}
                >
                  {renderWidget(widget)}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: layout === 'flex' ? 'column' : 'row',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              {dashboardStore.enabledWidgets.map((widget) => (
                <Box
                  key={widget.id}
                  sx={{
                    flex: layout === 'masonry' ? '1 1 auto' : '1',
                    minWidth: isMobile ? '100%' : isTablet ? '48%' : '300px',
                  }}
                >
                  {renderWidget(widget)}
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>}
    </ThemeProvider>
  );
});

export default DashboardContainer;