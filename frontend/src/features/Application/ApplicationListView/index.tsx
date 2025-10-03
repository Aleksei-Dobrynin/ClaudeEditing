import React, { FC, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton
} from "@mui/material";
import PageGridScrollLoading from "components/PageGridScrollLoading";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import ApplicationPopupForm from "./../PopupForm";
import ApplicationListFilter from "./ApplicationListFilter"; // Import the new filter component
import dayjs from "dayjs";
import CustomButton from "components/Button";
import MainStore from "MainStore";
import { Link } from "react-router-dom";
import { APPLICATION_STATUSES } from "constants/constant";
import ReestrListView from "features/reestr/reestrListView";
import Tooltip from '@mui/material/Tooltip';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import printJS from 'print-js';
import * as XLSX from 'xlsx';
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

type ApplicationListViewProps = {
  finPlan: boolean;
  forFilter?: boolean;
  forJournal?: boolean;
};

const ApplicationListView: FC<ApplicationListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.getValuesFromLocalStorage();
    store.doLoad(props.finPlan, props.forJournal);
    return () => {
      store.clearStore();
    };
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleTemplateMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleTemplateMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    store.filter.pageNumber = 0;
    store.loadApplications();
  };

  const handleClearFilter = () => {
    store.clearFilter();
    store.loadApplications();
  };

  const handlePrint = () => {
    const printableData = store.data.map((row) => ({
      number: row.number,
      journal_outgoing_number: row.journal_outgoing_number ?? '',
      journal_added_at: row.journal_added_at ? `${dayjs(row.journal_added_at).format("DD.MM.YYYY HH:mm")}` : "",
      status_name: row.status_name,
      service_name: `${row.service_name} (${row.day_count} р.дн.)`,
      arch_object_address: `${row.arch_object_address}, ${row.arch_object_district}`,
      customer_name: `${row.customer_name}, ИНН: ${row.customer_pin}${row.customer_contacts ? "; " + row.customer_contacts : ""}`,
      deadline: row.registration_date
        ? `${dayjs(row.registration_date).format("DD.MM.YYYY HH:mm")} / ${row.deadline ? dayjs(row.deadline).format("DD.MM.YYYY") : ""}`
        : "",
      created_by_name: row.created_by_name || "",
      assigned_employees_names: row.assigned_employees_names || "",
      total_sum: `Сумма: ${row.total_sum}, Опл.: ${row.total_payed}`,
    }));

    printJS({
      printable: printableData,
      properties: [
        { field: 'number', displayName: translate("label:ApplicationListView.number") },
        store.isJournal && { field: 'journal_outgoing_number', displayName: translate("label:JournalApplicationListView.outgoing_number") },
        store.isJournal && { field: 'journal_added_at', displayName: translate("label:JournalApplicationListView.added_at") },
        { field: 'status_name', displayName: translate("label:ApplicationListView.status_name") },
        { field: 'service_name', displayName: translate("label:ApplicationListView.service_name") },
        { field: 'arch_object_address', displayName: translate("label:ApplicationListView.arch_object_address") },
        { field: 'customer_name', displayName: translate("label:ApplicationListView.customer_name") },
        { field: 'deadline', displayName: translate("label:ApplicationListView.Registration_time_and_deadline") },
        { field: 'created_by_name', displayName: translate("label:ApplicationListView.registrar") },
        { field: 'assigned_employees_names', displayName: translate("label:ApplicationListView.Performers") },
        { field: 'total_sum', displayName: translate("Калькуляция") },
      ].filter(Boolean),
      type: 'json',
      style: `
      @media print {
          @page { size: A4 landscape; margin: 10mm; }
        body { font-family: Arial, sans-serif; font-size: 10pt; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 4px; text-align: left; word-wrap: break-word; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        th:nth-child(1), td:nth-child(1) { width: 10%; }
        th:nth-child(2), td:nth-child(2) { width: 12%; }
        th:nth-child(3), td:nth-child(3) { width: 15%; }
        th:nth-child(4), td:nth-child(4) { width: 15%; }
        th:nth-child(5), td:nth-child(5) { width: 15%; }
        th:nth-child(6), td:nth-child(6) { width: 12%; }
        th:nth-child(7), td:nth-child(7) { width: 10%; }
        th:nth-child(8), td:nth-child(8) { width: 15%; }
        th:nth-child(9), td:nth-child(9) { width: 10%; }
      }
    `,
      header: `<h2 style="text-align: center; margin-bottom: 10px;">${translate("label:ApplicationListView.entityTitle")}</h2>`,
    });
  };

  const handleExportExcel = async () => {
    try {
      const allData = await store.exportApplicationsToExcel();

      if (!allData || allData.length === 0) {
        return;
      }

      const printableData = allData.map((row) => ({
        [translate("label:ApplicationListView.number")]: row.number || "",
        ...(store.isJournal && {
          [translate("label:JournalApplicationListView.outgoing_number")]: row.journal_outgoing_number || '',
          [translate("label:JournalApplicationListView.added_at")]: row.journal_added_at ? dayjs(row.journal_added_at).format("DD.MM.YYYY HH:mm") : "",
        }),
        [translate("label:ApplicationListView.status_name")]: row.status_name || "",
        [translate("label:ApplicationListView.service_name")]: `${row.service_name || ""} (${row.day_count || 0} р.дн.)`,
        [translate("label:ApplicationListView.arch_object_address")]: `${row.arch_object_address || ""}, ${row.arch_object_district || ""}`,
        [translate("label:ApplicationListView.customer_name")]: `${row.customer_name || ""}, ИНН: ${row.customer_pin || ""}${row.customer_contacts ? "; " + row.customer_contacts : ""}`,
        [translate("label:ApplicationListView.Registration_time_and_deadline")]: row.registration_date
          ? `${dayjs(row.registration_date).format("DD.MM.YYYY HH:mm")} / ${row.deadline ? dayjs(row.deadline).format("DD.MM.YYYY") : ""}`
          : "",
        [translate("label:ApplicationListView.registrar")]: row.created_by_name || "",
        ...(!store.isJournal && {
          [translate("label:ApplicationListView.Performers")]: row.assigned_employees_names || "",
          [translate("label:ApplicationListView.comments") || "Комментарии"]: row.comments || "",
        }),
        [translate("Калькуляция")]: `Сумма: ${row.total_sum || 0}, Опл.: ${row.total_payed || 0}`,
      }));

      const ws = XLSX.utils.json_to_sheet(printableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Заявки");

      const headers = Object.keys(printableData[0] || {});
      const colWidths = headers.map((header) => {
        const maxLength = Math.max(
          header.length,
          ...printableData.map(row => String(row[header] || "").length)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = colWidths;

      const currentDate = dayjs().format("DD.MM.YYYY");
      const fileName = `заявки по фильтру за ${currentDate}.xlsx`;

      XLSX.writeFile(wb, fileName);

      const message = store.totalCount > 500
        ? `Файл "${fileName}" успешно сохранен (${printableData.length} записей)`
        : `Файл "${fileName}" успешно сохранен`;

      MainStore.setSnackbar(message, "success");
    } catch (err) {
      console.error("Ошибка при экспорте:", err);
    }
  };

  let columns: GridColDef[] = [
    ...((MainStore.isRegistrar && MainStore.isHeadStructure) ? [{
      field: 'select_application',
      headerName: translate("label:ApplicationListView.select_application"),
      flex: 0.5,
      renderCell: (param) => {
        return <Checkbox checked={!!param.row.select_application} onChange={(e) => {
          store.changeSelect(param.row.id, e.target.checked);
        }} />
      },
    }] : []),
    {
      field: "number",
      headerName: translate("label:ApplicationListView.number"),
      flex: store.isFinPlan ? 0.7 : 0.7,
      renderCell: (params) => {
        return <>
          <Link
            style={{ textDecoration: "underline", marginLeft: 5 }}
            to={`/user/Application/addedit?id=${params.row.id}`}>
            {params.value}
          </Link>
          <Tooltip title={"Быстрый просмотр"}>
            <IconButton onClick={() => store.changeOpenPanel(true, params.row.id)}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
        </>
      }
    },
    ...(store.isJournal ? [{
      field: "journal_outgoing_number",
      headerName: translate("label:JournalApplicationListView.outgoing_number"),
      flex: 1
    },
    store.isJournal && {
      field: "journal_added_at",
      headerName: translate("label:JournalApplicationListView.added_at"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ""}
        </span>
      )
    }] : []),
    {
      field: "status_name",
      headerName: translate("label:ApplicationListView.status_name"),
      flex: store.isFinPlan ? 0.9 : 0.7,
      renderCell: (params) => (
        <>
          <Chip
            variant="outlined"
            label={params.value}
            style={{ backgroundColor: params.row.status_color }}
          />
          {params.row.status_id == 2 &&
            <>&nbsp; {params.row.done_date ? dayjs(params.row.done_date).format("DD.MM.YYYY") : ""}</>
          }
        </>
      )
    },
    {
      field: "service_name",
      headerName: translate("label:ApplicationListView.service_name"),
      flex: 1,
      renderCell: (params) => {
        return <div>
          <Tooltip title={<>{params.row.service_name} ({params.row.day_count} р.дн.)</>}>
            <span>{params.row.service_name} ({params.row.day_count} р.дн.)</span>
          </Tooltip>
        </div>
      }
    },
    {
      field: "arch_object_address",
      headerName: translate("label:ApplicationListView.arch_object_address"),
      flex: 1.2,
      display: "flex",
      renderCell: (params) => {
        return <div>
          <div>{params.value}</div>
          <div>{params.row.arch_object_district}</div>
        </div>;
      }
    },
    {
      field: "customer_name",
      headerName: translate("label:ApplicationListView.customer_name"),
      flex: 1.5,
      display: "flex",
      renderCell: (params) => {
        return <div>
          <div>{params.value}</div>
          <div>
            ИНН: {params.row.customer_pin}{params.row.customer_contacts ? "; " + params.row.customer_contacts : ""}
          </div>
        </div>;
      }
    },
    {
      field: "deadline",
      headerName: translate("label:ApplicationListView.Registration_time_and_deadline"),
      display: "flex",
      flex: 0.7,
      renderCell: (params) => {
        let dealineColor = null;
        let deadlineTooltip = "";
        if (params.value) {
          const deadline = dayjs(params.value);
          if (params.row.status_code === APPLICATION_STATUSES.review
            || params.row.status_code === APPLICATION_STATUSES.preparation
            || params.row.status_code === APPLICATION_STATUSES.executor_assignment
            || params.row.status_code === APPLICATION_STATUSES.return_to_eo
            || params.row.status_code === APPLICATION_STATUSES.ready_for_eo
          ) {
            if (deadline < dayjs()) {
              dealineColor = "red";
              deadlineTooltip = `Срок выполнения просрочен на ${dayjs().set('hour', 23).set('minute', 59).diff(deadline, 'day')} дней`
            } else if (deadline < dayjs().add(1, "day")) {
              dealineColor = "#0000FF";
            } else if (deadline < dayjs().add(3, "day")) {
              dealineColor = "#FF00FF";
            } else if (deadline < dayjs().add(7, "day")) {
              dealineColor = "#9105fc";
            }
          }
        }

        return <div>
          <div>
            <span>
              {params.row.registration_date ? dayjs(params.row.registration_date).format("DD.MM.YYYY HH:mm") : ""}
            </span>
          </div>
          <div>
            <Tooltip title={deadlineTooltip} placement="bottom">
              <span style={{ color: dealineColor, fontWeight: 700 }}>
                {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
              </span>
            </Tooltip>
          </div>
        </div>;
      }
    },
    {
      field: "created_by_name",
      headerName: translate("label:ApplicationListView.registrar"),
      flex: 0.7
    },
    !store.isJournal && {
      field: "assigned_employees_names",
      sortable: false,
      headerName: translate("label:ApplicationListView.Performers"),
      flex: 1.3,
      renderCell: (params) => {
        const employeesString = params.value;

        if (!employeesString || employeesString.trim() === '') {
          return <span style={{ color: '#999', fontStyle: 'italic' }}>Не назначены</span>;
        }

        const employees = employeesString.split(',').map(emp => emp.trim()).filter(emp => emp !== '');

        if (employees.length === 0) {
          return <span style={{ color: '#999', fontStyle: 'italic' }}>Не назначены</span>;
        }

        return (
          <div style={{
            whiteSpace: 'pre-line',
            lineHeight: '1.4',
            fontSize: '13px',
            wordBreak: 'break-word'
          }}>
            {employees.join('\n')}
          </div>
        );
      }
    },
    {
      field: "total_sum",
      headerName: translate("Калькуляция"),
      flex: store.isFinPlan ? 1 : 0.7,
      display: "flex",
      renderCell: (params) => {
        return <div>
          <div>
            <span>Сумма: {params.row.total_sum}</span>
          </div>
          <div>
            <span>Опл.: <strong>{params.row.total_payed}</strong></span>
          </div>
        </div>;
      }
    },
    (!store.isJournal && !store.isFinPlan) && {
      field: "comments",
      headerName: translate("label:ApplicationListView.comments") || "Комментарии",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const comments = params.value;
        if (!comments || comments.length === 0) {
          return <span style={{ color: '#999', fontStyle: 'italic' }}></span>;
        }

        const maxLength = 100;
        const displayText = comments.length > maxLength
          ? `${comments.substring(0, maxLength)}...`
          : comments;

        return (
          <Tooltip title={comments} placement="top-start">
            <div style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {displayText}
            </div>
          </Tooltip>
        );
      }
    },
  ];

  if (store.isFinPlan) {
    columns = columns.filter(item => item.field !== "created_by_name");

    columns.unshift(
      {
        field: "reestr_id",
        headerName: translate("label:ApplicationListView.Registry"),
        sortable: false,
        flex: 0.8,
        display: "flex",
        renderCell: (params) => {
          if (params.row.reestr_id !== 0) {
            return <div><div><span>{params.row.reestr_id}</span></div><div><span>{params.row.reestr_name}</span></div></div>;
          }
          return <div>
            <CustomButton style={{ textAlign: 'start' }} disabled={!store.selectedReestrId} onClick={async () => {
              if (!store.selectedReestrId) {
                store.onChangePanelFinPlan(true, params.row.id);
                return;
              }

              const check = await store.getCheckApplicationBeforeRegistering(params.row.id, store.selectedReestrId);

              if (!check.valid) {
                store.setCheckResult(check, params.row.id);
                return;
              }
              await store.setApplicationToReestr(params.row.id, store.selectedReestrId, store.selectedReestrName);
            }}>
              {"Добавить в реестр"} <br />{store.selectedReestrName}
            </CustomButton>
          </div>;
        }
      }
    );
  }

  let type1: string = "form";
  let component = null;
  switch (type1) {
    case "form":
      component = <Box sx={{ width: '100%', overflow: 'auto' }}>
        <Box sx={{ minWidth: 1200 }}>
          <PageGridScrollLoading
            customHeader={props.finPlan ?
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h1">
                    {translate("label:ApplicationListView.entityTitle")}
                  </Typography>
                  <Typography variant="h4">
                    {translate('foundTotal') + ":" + store.totalCount}
                  </Typography>
                </Box>

                {store.isFinPlan && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center' }} m={1}>
                      <CustomButton
                        variant="contained"
                        color={store.selectedReestrId ? "secondary" : "primary"}
                        onClick={() => store.onChangeReestrSelectPanel(true)}
                      >
                        {store.selectedReestrId
                          ? `${translate("label:ApplicationListView:Change_Registry")}`
                          : translate("label:ApplicationListView:Select_Registry")}
                      </CustomButton>

                      <Box ml={1}>Текущий реестр: <strong>
                        <a
                          style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}
                          target="_blank"
                          href={`/user/reestr/addedit?id=${store.selectedReestrId}`}>
                          {store.selectedReestrName}
                        </a>
                      </strong></Box>
                    </Box>
                  </>
                )}
              </Box> : null
            }
            title={store.isJournal ? translate("label:JournalApplicationListView.entityTitle") : translate("label:ApplicationListView.entityTitle")}
            showCount={true}
            page={store.filter.pageNumber}
            pageSize={store.filter.pageSize}
            totalCount={store.totalCount}
            hideActions
            hideAddButton={!((MainStore.isRegistrar || MainStore.isAdmin) && (Boolean(store.isJournal) === false))}
            changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
            changeSort={(sortModel) => store.changeSort(sortModel)}
            searchText={""}
            columns={columns}
            data={store.data}
            customAddPath={"/user/ApplicationStepper?id=0&tab=0"}
            tableName="Application" />;
        </Box>
      </Box>
      break;
    case "popup":
      component = <PopupGrid
        title={translate("label:ApplicationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplication(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="Application" />;
      break;
  }

  return (
    <Container maxWidth={false} sx={{ overflowX: 'auto' }}>
      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <ApplicationListFilter
          store={store}
          onSearch={handleSearch}
          onClear={handleClearFilter}
          onPrint={handlePrint}
          onExportExcel={handleExportExcel}
          onSaveFilter={() => store.saveFilter()}
          onCloseFilter={() => store.closeFilter()}
          forFilter={props.forFilter}
          isJournal={store.isJournal}
          selectedIds={store.selectedIds}
          onTemplateMenuOpen={handleTemplateMenuOpen}
              />
      </Paper>

      {component}

      <ApplicationPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onClose={() => store.changeOpenPanel(false, 0)}
      />

      {/* Dialogs */}
      <Dialog maxWidth={"lg"} fullWidth open={store.openReestrSelectPanel}
        onClose={() => store.onChangeReestrSelectPanel(false)}>
        <DialogContent>
          <ReestrListView
            fromApplicatoin
            onClickReestr={(id, name) => {
              store.setSelectedReestr(id, name);
              store.onChangeReestrSelectPanel(false);
            }} />
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="contained"
            onClick={() => store.onChangeReestrSelectPanel(false)}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </Dialog>

      <Dialog open={!!store.checkResult && !store.checkResult.valid} onClose={() => store.setCheckResult(null)}>
        <DialogTitle>Обнаружены проблемы</DialogTitle>
        <DialogContent>
          Не все данные корректны. Вы действительно хотите добавить заявку в реестр?
          <ul>
            {store.checkResult?.errors && Object.entries(store.checkResult.errors).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => store.setCheckResult(null)}>Отмена</CustomButton>
          <CustomButton
            color="primary"
            onClick={async () => {
              if (store.selectedApplicationId) {
                await store.setApplicationToReestr(
                  store.selectedApplicationId,
                  store.selectedReestrId,
                  store.selectedReestrName
                );
              }
              store.setCheckResult(null);
            }}
          >
            Добавить
          </CustomButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={store.openError}
        onClose={() => (store.openError = false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Ошибка
          <IconButton
            aria-label="close"
            onClick={() => (store.openError = false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography>
            {store.messageError}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => (store.openError = false)}
          >
            ОК
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        open={store.isOpenSelectLang}
      >
        <DialogTitle>Выберите язык</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            aria-label="ringtone"
            name="ringtone"
            onChange={(e) => {
              store.selectedLang = e.target.value;
            }}
          >
            <FormControlLabel
              value={"ru"}
              key={"ru"}
              control={<Radio />}
              label={"Русский"}
            />
            <FormControlLabel
              value={"ky"}
              key={"ky"}
              control={<Radio />}
              label={"Кыргызча"}
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => {
            store.isOpenSelectLang = false;
            store.selectedLang = "";
            store.selectTemplate_id = 0;
          }}>
            Отмена
          </Button>
          <Button
            disabled={store.selectedLang === ""}
            onClick={() => {
              store.isOpenSelectLang = false;
              store.selectTemplate();
            }}>Ok</Button>
        </DialogActions>
      </Dialog>

      {/* Template Selection Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleTemplateMenuClose}>
        {store.ApplicationTemplates.map(x => {
          return <MenuItem
            key={x.id}
            onClick={() => {
              handleTemplateMenuClose();
              store.selectTemplate_id = x.id;
              store.isOpenSelectLang = true;
            }}>
            {x.name}
          </MenuItem>
        })}
      </Menu>
    </Container>
  );
});

export default ApplicationListView;