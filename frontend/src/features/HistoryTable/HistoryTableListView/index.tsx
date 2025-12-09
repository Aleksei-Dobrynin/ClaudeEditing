import React, { FC, useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
  Alert,
  IconButton,
  Collapse
} from "@mui/material";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import DateField from "components/DateField";
import CustomButton from "components/Button";
import AutocompleteCustom from "components/Autocomplete";
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Иконки для таблиц
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CommentIcon from '@mui/icons-material/Comment';
import TaskIcon from '@mui/icons-material/Task';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import MapIcon from '@mui/icons-material/Map';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CategoryIcon from '@mui/icons-material/Category';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

type HistoryTableListViewProps = {
  ApplicationID: number;
};

const HistoryTableListView: FC<HistoryTableListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (store.ApplicationID !== props.ApplicationID) {
      store.ApplicationID = props.ApplicationID;
    }
    store.doLoad();
    return () => {
      store.clearStore();
    };
  }, [props.ApplicationID]);


  const getTableIcon = (entityType: string) => {
    const iconProps = { sx: { fontSize: 20 } };

    switch (entityType) {
      case 'application':
        return <AssignmentIcon {...iconProps} />;
      case 'application_payment':
        return <PaymentIcon {...iconProps} />;
      case 'uploaded_application_document':
        return <UploadFileIcon {...iconProps} />;
      case 'application_comment':
        return <CommentIcon {...iconProps} />;
      case 'application_task':
        return <TaskIcon {...iconProps} />;
      case 'application_task_assignee':
        return <PersonAddIcon {...iconProps} />;
      case 'customer':
        return <AccountCircleIcon {...iconProps} />;
      case 'arch_object':
        return <HomeWorkIcon {...iconProps} />;
      case 'arch_object_tag':
        return <LocalOfferIcon {...iconProps} />;
      case 'saved_application_document':
        return <SaveIcon {...iconProps} />;
      case 'application_work_document':
        return <DescriptionIcon {...iconProps} />;
      case 'architecture_process':
        return <ArchitectureIcon {...iconProps} />;
      case 'application_duty_object':
        return <MapIcon {...iconProps} />;
      case 'application_square':
        return <SquareFootIcon {...iconProps} />;
      case 'structure_tag_application':
        return <CategoryIcon {...iconProps} />;
      case 'application_subtask':
        return <TaskAltIcon {...iconProps} />;
      case 'application_subtask_assignee':
        return <GroupAddIcon {...iconProps} />;
      default:
        return <HistoryIcon {...iconProps} />;
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'INSERT':
        return 'success';
      case 'UPDATE':
        return 'info';
      case 'DELETE':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatJsonValue = (jsonString: string, table: string) => {
    try {
      const jsonObject = JSON.parse(jsonString);
      const entries = Object.entries(jsonObject);

      const renderValue = (value: any) => {
        if (value === null || value === undefined) return "-";

        if (typeof value === "boolean") {
          return value ? translate("yes") : translate("no");
        }

        if (typeof value === "string" && (value === "true" || value === "false")) {
          return value === "true" ? translate("yes") : translate("no");
        }

        if (typeof value === "string") {
          if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
            return dayjs(value).format("YYYY-MM-DD");
          }
          if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(value)) {
            return dayjs(value).format("YYYY-MM-DD HH:mm");
          }
          return value;
        }

        return String(value);
      };

      return (
        <Box>
          {entries.map(([key, value], index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              <strong>{translate(`label:${table}ListView.${key}`)}:</strong> {value ? renderValue(value) : "-"}
            </Typography>
          ))}
        </Box>
      );
    } catch (error) {
      return <Typography variant="body2" color="error">Ошибка формата данных</Typography>;
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Заголовок с фильтрами */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <HistoryIcon />
          {translate("label:HistoryTableListView.entityTitle")}
        </Typography>

        {/* Фильтры */}
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <AutocompleteCustom
              value={store.employee_id}
              onChange={(event) => store.changeApplications(event)}
              name="employee_id"
              data={store.Employees}
              fieldNameDisplay={(employee) => `${employee.last_name} ${employee.first_name} ${employee.second_name}`}
              id="employee_id"
              label={translate("Сотрудник")}
              helperText={""}
              error={false}
            />
          </Grid>
          <Grid item xs={12} md={3} sx={{ mb: 1 }}>
            <DateField
              value={store.date_start}
              onChange={(event) => store.changeApplications(event)}
              name="date_start"
              id="date_start"
              helperText=""
              label={translate("label:Dashboard.startDate")}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DateField
              value={store.date_end}
              onChange={(event) => store.changeApplications(event)}
              name="date_end"
              id="date_end"
              helperText=""
              label={translate("label:Dashboard.endDate")}
            />
          </Grid>
          <Grid item xs={12} md={3} display={"flex"}>
            <CustomButton sx={{ mr: 1 }} variant="contained" onClick={() => store.loadHistoryTables()} >
              Применить
            </CustomButton>
            {(store.employee_id != 0 || store.date_start != null || store.date_end != null) &&
              <CustomButton onClick={() => store.clearFilter()}>Очистить</CustomButton>
            }
          </Grid>
        </Grid>
      </Box>

      {/* Карточки с историей */}
      {!store.data || store.data.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {translate("История изменений пуста")}
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {store.data.map((item, index) => (
            <Grid item xs={12} key={item.id || index}>
              <Card
                elevation={2}
                sx={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ pb: expandedCards.has(index) ? 2 : 1.5, pt: 1.5 }}>
                  {/* Первая строка */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={2}>
                      {/* Тип изменения */}
                      <Chip
                        label={translate(`label:HistoryTableListView.db_action_${item.operation}`)}
                        size="small"
                        color={getOperationColor(item.operation)}
                      />

                      {/* Изменяемая таблица */}
                      <Chip
                        label={translate(`label:${item.entity_type}ListView.entityTitle`)}
                        icon={getTableIcon(item.entity_type)}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                        color="secondary"
                      />

                      {/* Сотрудник */}
                      <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <PersonIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {item.created_by_name || translate("Система")}
                        </Typography>
                      </Box>

                      {/* Дата */}
                      <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {item.created_at ? dayjs(item.created_at).format("DD.MM.YYYY HH:mm") : "-"}
                        </Typography>
                      </Box>
                    </Box>

                  </Box>

                  {/* Вторая строка - развертываемый контент */}
                    <Box mt={2}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          backgroundColor: item.operation === 'DELETE' ? 'error.50' : 'success.50',
                          borderColor: item.operation === 'DELETE' ? 'error.200' : 'success.200'
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 1,
                            color: item.operation === 'DELETE' ? 'error.main' : 'success.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {item.operation === 'DELETE'
                            ? translate("label:HistoryTableListView.old_value")
                            : translate("label:HistoryTableListView.new_value")
                          }
                        </Typography>
                        {formatJsonValue(
                          item.operation === 'DELETE' ? item.old_value : item.new_value,
                          item.entity_type
                        )}
                      </Paper>

                      {/* Для UPDATE показываем также старое значение */}
                      {item.operation === 'UPDATE' && item.old_value && (
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            mt: 2,
                            backgroundColor: 'error.50',
                            borderColor: 'error.200'
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              color: 'error.main',
                              fontWeight: 'bold'
                            }}
                          >
                            {translate("label:HistoryTableListView.old_value")}
                          </Typography>
                          {formatJsonValue(item.old_value, item.entity_type)}
                        </Paper>
                      )}
                    </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
});

export default HistoryTableListView;