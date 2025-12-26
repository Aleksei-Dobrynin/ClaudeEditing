import React, { FC, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";
import PageGridScrollLoading from "components/PageGridScrollLoading";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import CustomButton from "components/Button";
import { Link } from "react-router-dom";

// Иконки
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import UnsignedDocumentsFilter from "./UnsignedDocumentsFilter";

const UnsignedDocumentsListView: FC = observer(() => {
  const { t } = useTranslation();

  useEffect(() => {
    store.doLoad();
    return () => {
      store.clearStore();
    };
  }, []);

  // Обработчик поиска
  const handleSearch = () => {
    store.loadDocuments();
  };

  // Обработчик сброса фильтров
  const handleClear = () => {
    store.resetFilters();
  };

  // Форматирование даты
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("DD.MM.YYYY");
  };

  // Рендер статуса документа
  const renderDocumentStatus = (status: "pending" | "approved" | "rejected") => {
    if (status === "approved") {
      return (
        <Chip
          icon={<CheckCircleIcon fontSize="small" />}
          label={t("label:DocumentNotificationsView.statusApproved")}
          color="success"
          size="small"
          variant="outlined"
        />
      );
    } else if (status === "rejected") {
      return (
        <Chip
          icon={<CancelIcon fontSize="small" />}
          label={t("label:DocumentNotificationsView.statusRejected")}
          color="error"
          size="small"
          variant="outlined"
        />
      );
    } else {
      return (
        <Chip
          label={t("label:DocumentNotificationsView.statusPending")}
          color="primary"
          variant="outlined"
          size="small"
        />
      );
    }
  };

  // Колонки грида
  const columns: GridColDef[] = [
    {
      field: "app_number",
      headerName: t("label:DocumentNotificationsView.applicationNumber", { id: "" }).replace("№", "№ Заявки"),
      flex: 0.8,
      renderCell: (params) => (
        <Link
          style={{ textDecoration: "underline", color: "#1976d2" }}
          to={`/user/Application/addedit?id=${params.row.app_id}`}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "document_name",
      headerName: t("label:UnsignedDocuments.documentName") || "Название документа",
      flex: 1.2,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "document_status",
      headerName: t("label:DocumentNotificationsView.documentStatus") || "Статус",
      flex: 0.8,
      renderCell: (params) => renderDocumentStatus(params.value),
    },
    {
      field: "full_name",
      headerName: t("label:DocumentNotificationsView.customer") || "Заявитель",
      flex: 1.2,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.value}</Typography>
          <Typography variant="caption" color="textSecondary">
            ПИН: {params.row.pin}
          </Typography>
        </Box>
      ),
    },
    {
      field: "service_name",
      headerName: t("label:UnsignedDocuments.service") || "Услуга",
      flex: 1.2,
      renderCell: (params) => (
        <Tooltip title={`${params.value} (${params.row.service_days} р.дн.)`}>
          <span>{params.value} ({params.row.service_days} р.дн.)</span>
        </Tooltip>
      ),
    },
    {
      field: "arch_object_address",
      headerName: t("label:DocumentNotificationsView.address") || "Адрес",
      flex: 1.2,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "app_work_description",
      headerName: t("label:DocumentNotificationsView.work_description") || "Описание работ",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span style={{ 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            whiteSpace: "nowrap" 
          }}>
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "deadline",
      headerName: t("label:DocumentNotificationsView.deadline") || "Дедлайн",
      flex: 0.7,
      renderCell: (params) => {
        const isOverdue = store.isOverdue(params.value);
        return (
          <Box>
            {isOverdue && (
              <Tooltip title={t("label:DocumentNotificationsView.statusOverdue")}>
                <WarningAmberIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
              </Tooltip>
            )}
            <Typography
              variant="body2"
              color={isOverdue ? "error" : "textPrimary"}
              fontWeight={isOverdue ? "bold" : "normal"}
              component="span"
            >
              {formatDate(params.value)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: t("actions") || "Действия",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <CustomButton
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => store.navigateToApplication(params.row.task_id, params.row.app_step_id)}
        >
          {t("label:DocumentNotificationsView.navigate")}
        </CustomButton>
      ),
    },
  ];

  return (
    <Container maxWidth={false} sx={{ overflowX: "auto" }}>
      {/* Фильтры */}
      <Paper elevation={5} sx={{ width: "100%", p: 2, mb: 2 }}>
        <UnsignedDocumentsFilter
          store={store}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </Paper>

      {/* Грид */}
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: 1400 }}>
          <PageGridScrollLoading
            title={t("label:DocumentNotificationsView.documentsForApproval")}
            showCount={true}
            page={store.page}
            pageSize={store.pageSize}
            totalCount={store.totalCount}
            hideActions
            hideAddButton
            changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
            changeSort={(sortModel) => store.changeSort(sortModel)}
            searchText=""
            columns={columns}
            data={store.data}
            tableName="UnsignedDocuments"
            getRowHeight={() => 'auto'}
          />
        </Box>
      </Box>
    </Container>
  );
});

export default UnsignedDocumentsListView;