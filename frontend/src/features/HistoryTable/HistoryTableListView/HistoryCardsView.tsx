import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Paper,
    Alert,
    Collapse,
    IconButton
} from "@mui/material";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Иконки для таблиц
import AssignmentIcon from '@mui/icons-material/Assignment'; // application
import PaymentIcon from '@mui/icons-material/Payment'; // application_payment
import UploadFileIcon from '@mui/icons-material/UploadFile'; // uploaded_application_document
import CommentIcon from '@mui/icons-material/Comment'; // application_comment
import TaskIcon from '@mui/icons-material/Task'; // application_task
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // application_task_assignee
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // customer
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // arch_object
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; // arch_object_tag
import SaveIcon from '@mui/icons-material/Save'; // saved_application_document
import DescriptionIcon from '@mui/icons-material/Description'; // application_work_document
import ArchitectureIcon from '@mui/icons-material/Architecture'; // architecture_process
import MapIcon from '@mui/icons-material/Map'; // application_duty_object
import SquareFootIcon from '@mui/icons-material/SquareFoot'; // application_square
import CategoryIcon from '@mui/icons-material/Category'; // structure_tag_application
import TaskAltIcon from '@mui/icons-material/TaskAlt'; // application_subtask
import GroupAddIcon from '@mui/icons-material/GroupAdd'; // application_subtask_assignee

type HistoryCardsViewProps = {
    ApplicationID: number;
};

const HistoryCardsView: FC<HistoryCardsViewProps> = observer((props) => {
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
                            <strong>{translate(`label:${table}ListView.${key}`)}:</strong> {value ? String(value) : "-"}
                        </Typography>
                    ))}
                </Box>
            );
        } catch (error) {
            return <Typography variant="body2" color="error">Ошибка формата данных</Typography>;
        }
    };

    if (!store.data || store.data.length === 0) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                {translate("История изменений пуста")}
            </Alert>
        );
    }

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography
                variant="h6"
                sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <HistoryIcon />
                {translate("label:HistoryTableListView.entityTitle")}
            </Typography>

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
                                        {/* Иконка таблицы */}

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

                                    {/* Иконка развертывания */}
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
        </Box>
    );
});

export default HistoryCardsView;