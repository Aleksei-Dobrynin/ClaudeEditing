import React, { FC, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper, Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@mui/material";
import PageGridPagination from "components/PageGridPagination";
import PageGridScrollLoading from "components/PageGridScrollLoading";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import { observer } from "mobx-react";
import store from "./store";
import storeExcel from "../../ExcelUpload/ExcelUploadView/store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import ApplicationPopupForm from "./../PopupForm";
import dayjs from "dayjs";
import CustomButton from "components/Button";
import CustomTextField from "components/TextField";
import LookUp from "components/LookUp";
import ClearIcon from "@mui/icons-material/Clear";
import DateField from "components/DateField";
import MtmLookup from "components/mtmLookup";
import FileField from "../../../components/FileField";
import MainStore from "MainStore";
import CustomCheckbox from "../../../components/Checkbox";
import AutocompleteCustom from "components/Autocomplete";
import TextField from "@mui/material/TextField";
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

  // Замените handlePrint в index.tsx:
  // Оригинальная функция handlePrint для печати (используйте store.data)
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
        th:nth-child(1), td:nth-child(1) { width: 10%; } /* number */
        th:nth-child(2), td:nth-child(2) { width: 12%; } /* status_name */
        th:nth-child(3), td:nth-child(3) { width: 15%; } /* service_name */
        th:nth-child(4), td:nth-child(4) { width: 15%; } /* arch_object_address */
        th:nth-child(5), td:nth-child(5) { width: 15%; } /* customer_name */
        th:nth-child(6), td:nth-child(6) { width: 12%; } /* deadline */
        th:nth-child(7), td:nth-child(7) { width: 10%; } /* created_by_name */
        th:nth-child(8), td:nth-child(8) { width: 15%; } /* assigned_employees_names */
        th:nth-child(9), td:nth-child(9) { width: 10%; } /* total_sum */
      }
    `,
      header: `<h2 style="text-align: center; margin-bottom: 10px;">${translate("label:ApplicationListView.entityTitle")}</h2>`,
    });
  };

  // Новая функция handleExportExcel для экспорта в Excel всех данных по фильтру
  const handleExportExcel = async () => {
    try {
      // Получаем все данные через store
      const allData = await store.exportApplicationsToExcel();

      if (!allData || allData.length === 0) {
        return; // Сообщение уже показано в store
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

      // Создаем Excel файл
      const ws = XLSX.utils.json_to_sheet(printableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Заявки");

      // Автоподбор ширины колонок
      const headers = Object.keys(printableData[0] || {});
      const colWidths = headers.map((header) => {
        const maxLength = Math.max(
          header.length,
          ...printableData.map(row => String(row[header] || "").length)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = colWidths;

      // Генерируем имя файла с текущей датой
      const currentDate = dayjs().format("DD.MM.YYYY");
      const fileName = `заявки по фильтру за ${currentDate}.xlsx`;

      // Сохраняем файл
      XLSX.writeFile(wb, fileName);

      // Показываем количество записей только если их больше 500
      const message = store.totalCount > 500
        ? `Файл "${fileName}" успешно сохранен (${printableData.length} записей)`
        : `Файл "${fileName}" успешно сохранен`;

      MainStore.setSnackbar(message, "success");
    } catch (err) {
      console.error("Ошибка при экспорте:", err);
      // Ошибка уже обработана в store
    }
  };

  // useEffect(() => {
  //   if (MainStore.isHeadStructure || MainStore.isEmployee) {
  //     store.filter.isMyOrgApplication = true;
  //     store.doLoad(props.finPlan);
  //   }
  // }, [MainStore.isHeadStructure, MainStore.isEmployee]);

  let columns: GridColDef[] = [
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
          <div>
            {params.value}
          </div>
          <div>
            {params.row.arch_object_district}
          </div>
        </div>;
      }
    },
    // {
    //   field: "arch_object_district",
    //   headerName: translate("label:ApplicationListView.arch_object_district"),
    //   flex: 1
    // },
    {
      field: "customer_name",
      headerName: translate("label:ApplicationListView.customer_name"),
      flex: 1.5,
      display: "flex",
      renderCell: (params) => {
        return <div>
          <div>
            {params.value}
          </div>
          <div>
            ИНН: {params.row.customer_pin}{params.row.customer_contacts ? "; " + params.row.customer_contacts : ""}
          </div>
        </div>;
      }
    },
    // {
    //   field: "work_description",
    //   headerName: translate("label:ApplicationListView.work_description"),
    //   flex: 1
    // },
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
    // {
    //   field: "is_paid",
    //   headerName: translate("label:ApplicationListView.is_paid"),
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Chip
    //       color={params.value ? "success" : "error"}
    //       sx={{ background: params.value ? "#00875a" : "", color: params.value ? "white" : "" }}
    //       label={translate(`label:ApplicationListView.paid_${params.value ? true : false}`)}
    //     />
    //   )
    // },
    // {
    //   field: "deadline",
    //   headerName: translate("label:ApplicationListView.deadline"),
    //   flex: 1,
    //   renderCell: (params) => {
    //     let dealineColor = null;
    //     if (params.value) {
    //       const deadline = dayjs(params.value);
    //       if (deadline < dayjs()) {
    //         dealineColor = "red";
    //       } else if (deadline < dayjs().add(3, "day")) {
    //         dealineColor = "orange";
    //       } else if (deadline < dayjs().add(7, "day")) {
    //         dealineColor = "#e5e56a";
    //       }
    //     }
    //     return <span style={{ color: dealineColor }}>
    //       {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
    //     </span>;
    //   }
    // },
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

        // Разделяем исполнителей по запятой и убираем лишние пробелы
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
            <span>
              Сумма: {params.row.total_sum}
            </span>
          </div>
          <div>
            <span>
              Опл.: <strong>{params.row.total_payed}</strong>
            </span>

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

        // Если комментарий длинный, обрезаем его
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
          console.log(params);
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

                        <a onClick={() => {

                        }}></a></strong></Box>
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

      {/* <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={3}>
            <Grid item md={4} xs={4}>
              <LookUp
                value={storeExcel.bank_id}
                onChange={(event) => storeExcel.handleChange(event)}
                name="bank_id"
                data={storeExcel.Banks}
                id="bank_id"
                label={translate("label:ApplicationListView.bank_id")}
                helperText={""}
                error={false}
              />
            </Grid>
            <Grid item md={5} xs={5}>
              <FileField
                value={storeExcel.FileName}
                helperText={storeExcel.errorFileName}
                error={!!storeExcel.errorFileName}
                inputKey={storeExcel.idDocumentinputKey}
                fieldName="fileName"
                onChange={(event) => {
                  if (event.target.files.length == 0) return;
                  storeExcel.handleChange({ target: { value: event.target.files[0], name: "File" } });
                  storeExcel.handleChange({ target: { value: event.target.files[0].name, name: "FileName" } });
                }}
                onClear={() => {
                  storeExcel.handleChange({ target: { value: null, name: "File" } });
                  storeExcel.handleChange({ target: { value: "", name: "FileName" } });
                  storeExcel.changeDocInputKey();
                }}
              />
            </Grid>
            <Grid item md={3} xs={3}>
              <CustomButton
                variant="contained"
                id="id_FileForApplicationDocumentSaveButton"
                onClick={() => {
                  storeExcel.onSaveClick(() => {
                    store.loadApplications();
                  });
                }}
              >
                {translate("label:ApplicationListView.upload_bank_document")}
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      </Paper> */}

      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={2}>
            {store.isJournal && <Grid item md={12} xs={12}>
              <LookUp
                id="id_f_DocumentJournals_journals_id"
                label={translate("label:JournalApplicationListView.journal_id")}
                value={store.filter.journals_id}
                data={store.Journals}
                onChange={(e) => store.changeJournalId(e.target.value)}
                name="journals_id"
                fieldNameDisplay={(i) => i.name}
              />
            </Grid>
            }

            {!store.is_allFilter &&
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.filter.common_filter}
                  onChange={(e) => store.changeCommonFilter(e.target.value)}
                  name={"searchByCommonFilter"}
                  label={translate("label:ApplicationListView.search")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"common_filter"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="common_filter_Search_Btn"
                          onClick={() => {
                            store.clearFilter();
                            store.loadApplications();
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            }
            {store.is_allFilter && <>
              <Grid item md={4} xs={12}>
                <CustomTextField
                  value={store.filter.pin}
                  onChange={(e) => store.changePin(e.target.value)}
                  name={"searchByPin"}
                  label={translate("label:ApplicationListView.searchByPin")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"pin"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="pin_Search_Btn"
                          onClick={() => store.changePin("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <CustomTextField
                  value={store.filter.customerName}
                  onChange={(e) => store.changeCustomerName(e.target.value)}
                  name={"customerName"}
                  label={translate("label:ApplicationListView.searchCustomerName")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"customerName"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="customerName_Search_Btn"
                          onClick={() => store.changeCustomerName("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <CustomTextField
                  value={store.filter.number}
                  onChange={(e) => store.changeNumber(e.target.value)}
                  name={"number"}
                  label={translate("label:ApplicationListView.searchByNumber")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"pin"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="number_Search_Btn"
                          onClick={() => store.changeNumber("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <DateField
                  value={store.filter.date_start != null ? dayjs(new Date(store.filter.date_start)) : null}
                  onChange={(event) => store.changeDateStart(event.target.value)}
                  name="dateStart"
                  id="filterByDateStart"
                  label={translate("label:ApplicationListView.filterByDateStart")}
                  helperText={store.errors.dateStart}
                  error={!!store.errors.dateStart}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <DateField
                  value={store.filter.date_end != null ? dayjs(new Date(store.filter.date_end)) : null}
                  onChange={(event) => store.changeDateEnd(event.target.value)}
                  name="dateEnd"
                  id="filterByDateEnd"
                  label={translate("label:ApplicationListView.filterByDateEnd")}
                  helperText={store.errors.dateEnd}
                  error={!!store.errors.dateEnd}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <LookUp
                  value={store.filter.district_id}
                  onChange={(event) => store.changeDistrict(event.target.value)}
                  name="district_id"
                  data={store.Districts}
                  id="district_id"
                  label={translate("label:ApplicationListView.filterByDistrict")}
                  helperText={""}
                  error={false}
                />
              </Grid>
              {/* Новые поля для фильтрации по суммам */}
              <Grid item md={3} xs={12}>
                <CustomTextField
                  value={store.filter.total_sum_from || ""}
                  onChange={(e) => store.changeTotalSumFrom(e.target.value)}
                  name={"total_sum_from"}
                  label={translate("label:ApplicationListView.totalSumFrom")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"total_sum_from"}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="total_sum_from_Clear_Btn"
                          onClick={() => store.changeTotalSumFrom("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <CustomTextField
                  value={store.filter.total_sum_to || ""}
                  onChange={(e) => store.changeTotalSumTo(e.target.value)}
                  name={"total_sum_to"}
                  label={translate("label:ApplicationListView.totalSumTo")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"total_sum_to"}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="total_sum_to_Clear_Btn"
                          onClick={() => store.changeTotalSumTo("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <CustomTextField
                  value={store.filter.total_payed_from || ""}
                  onChange={(e) => store.changeTotalPayedFrom(e.target.value)}
                  name={"total_payed_from"}
                  label={translate("label:ApplicationListView.totalPayedFrom")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"total_payed_from"}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="total_payed_from_Clear_Btn"
                          onClick={() => store.changeTotalPayedFrom("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <CustomTextField
                  value={store.filter.total_payed_to || ""}
                  onChange={(e) => store.changeTotalPayedTo(e.target.value)}
                  name={"total_payed_to"}
                  label={translate("label:ApplicationListView.totalPayedTo")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"total_payed_to"}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="total_payed_to_Clear_Btn"
                          onClick={() => store.changeTotalPayedTo("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              {/* <Grid item md={6} xs={12}>
                <LookUp
                  value={store.filter.tag_id}
                  onChange={(event) => store.changeTag(event.target.value)}
                  name="tag_id"
                  data={store.Tags}
                  id="tag_id"
                  label={translate("label:ApplicationListView.filterByTag")}
                  helperText={""}
                  error={false}
                />
              </Grid> */}
              <Grid item md={12} xs={12}>
                <MtmLookup
                  label={translate("label:ApplicationListView.filterByService")}
                  name="service_ids"
                  value={store.filter.service_ids}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  data={store.Services}
                  onChange={(name, value) => store.changeService(value)}
                  toggles={true}
                  toggleGridColumn={4}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <MtmLookup
                  label={translate("label:ApplicationListView.filterByStatus")}
                  name="status_ids"
                  value={store.filter.status_ids}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  data={store.Statuses}
                  onChange={(name, value) => store.changeStatus(value)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <AutocompleteCustom
                  value={store.filter.employee_id}
                  onChange={(event) => {
                    store.changeEmployee(event.target.value);
                  }}
                  data={store.Employees}
                  name="status_id"
                  label={translate("label:ApplicationListView.filterByEmployee")}
                  // getOptionLabel={(employee) =>
                  //   employee
                  //     ? `${employee.last_name || ""} ${employee.first_name || ""} ${employee.second_name || ""}`
                  //     : ""
                  // }
                  fieldNameDisplay={(e) => `${e.full_name}`}
                  id="id_f_employee_id"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomTextField
                  value={store.filter.incoming_numbers}
                  onChange={(e) => store.changeIncomingNumbers(e.target.value)}
                  name={"searchByIncomingNumbers"}
                  label={translate("label:ApplicationListView.searchByIncomingNumbers")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"incoming_numbers"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="incoming_numbers_Search_Btn"
                          onClick={() => store.changeIncomingNumbers("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomTextField
                  value={store.filter.outgoing_numbers}
                  onChange={(e) => store.changeOutgoingNumbers(e.target.value)}
                  name={"searchByOutgoingNumbers"}
                  label={translate("label:ApplicationListView.searchByOutgoingNumbers")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"outgoing_numbers"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="outgoing_numbers_Search_Btn"
                          onClick={() => store.changeOutgoingNumbers("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.filter.address}
                  onChange={(e) => store.changeAddress(e.target.value)}
                  name={"address"}
                  label={translate("label:ApplicationListView.searchByAddress")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"address"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="number_Search_Btn"
                          onClick={() => store.changeAddress("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

            </>

            }

            {/* <Grid item md={12} xs={12}>
              <CustomTextField
                value={store.filter.address}
                onChange={(e) => store.changeAddress(e.target.value)}
                name={"address"}
                label={translate("label:ApplicationListView.searchByAddress")}
                onKeyDown={(e) => e.keyCode === 13 && store.loadApplicationsCommon()}
                id={"pin"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="address_Search_Btn"
                        onClick={() => store.changeAddress("")}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid> */}

            {store.filter.isExpired &&
              <Grid item md={4} xs={12}>
                <LookUp
                  value={store.filter.deadline_day}
                  onChange={(event) => store.changeDeadlineDay(event.target.value)}
                  name="deadline_day"
                  data={store.DeadlineDays}
                  id="deadline_day"
                  label={translate("label:ApplicationListView.filterByDeadline")}
                  helperText={""}
                  error={false}
                />
              </Grid>
            }

            <Grid item md={12} xs={12}>
              <CustomCheckbox
                value={store.is_allFilter}
                onChange={(event) => store.changeAllFilter(event)}
                name="is_allFilter"
                label={translate("label:ApplicationListView.is_allFilter")}
                id="id_f_Application_is_allFilter"
              />
              <CustomCheckbox
                value={store.filter.isExpired}
                onChange={(event) => store.handleCheckboxChangeWithLoad('isExpired', event.target.value)}
                name="isExpired"
                label={translate("label:ApplicationListView.isExpired")}
                id="id_f_Application_isExpired"
              />
              <CustomCheckbox
                value={store.filter.is_paid}
                onChange={(event) => store.handleCheckboxChangeWithLoad('is_paid', true, () => store.changeIsPaid(true))}
                name="isPaid"
                label={translate("label:ApplicationListView.paidOnly")}
                id="id_f_Application_isPaid"
              />
              <CustomCheckbox
                value={store.filter.is_paid == false}
                onChange={(event) => store.handleCheckboxChangeWithLoad('is_paid', false, () => store.changeIsPaid(false))}
                name="isPaid"
                label={translate("label:ApplicationListView.notPaidOnly")}
                id="id_f_Application_isNotPaid"
              />
              {(MainStore.isHeadStructure || MainStore.isEmployee) && <CustomCheckbox
                value={store.filter.isMyOrgApplication}
                onChange={(event) => store.handleCheckboxChangeWithLoad('isMyOrgApplication', event.target.value)}
                name="isMyOrgApplication"
                label={translate("label:ApplicationListView.isMyOrgApplication")}
                id="id_f_Application_isMyOrgApplication"
              />}
              {(store.is_allFilter && (MainStore.isHeadStructure || MainStore.isEmployee)) && <CustomCheckbox
                value={store.filter.withoutAssignedEmployee}
                onChange={(event) => store.handleCheckboxChangeWithLoad('withoutAssignedEmployee', event.target.value)}
                name="withoutAssignedEmployee"
                label={translate("label:ApplicationListView.withoutAssignedEmployee")}
                id="id_f_Application_withoutAssignedEmployee"
              />}
            </Grid>
          </Grid>

          <Box display={"flex"} flexDirection={"column"} sx={{ ml: 2 }} alignItems={"stretch"} minWidth={200}>
            {props.forFilter && <Box display={"flex"} sx={{ gap: 1, mb: 2 }}>
              <CustomButton
                variant="contained"
                fullWidth
                id="searchFilterButton"
                onClick={() => {
                  store.saveFilter();
                }}
              >
                {translate("save")}
              </CustomButton>
              <CustomButton
                variant="contained"
                fullWidth
                id="searchFilterButton"
                onClick={() => {
                  store.closeFilter();
                }}
              >
                {translate("close")}
              </CustomButton>
            </Box>}

            <CustomButton
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
              id="searchFilterButton"
              onClick={() => {
                  store.filter.pageNumber = 0;
                store.loadApplications();
              }}
            >
              {translate("search")}
            </CustomButton>

            {(store.filter.pin !== ""
              || store.filter.customerName !== ""
              || store.filter.number !== ""
              || store.filter.address !== ""
              || store.filter.service_ids.length !== 0
              || store.filter.date_start !== null
              || store.filter.date_end !== null
              || store.filter.service_ids.length > 0
              || store.filter.status_ids.length > 0
              || store.filter.district_id != 0
              || store.filter.journals_id != 0
              || store.filter.tag_id != 0
              || store.filter.isExpired != false
              || store.filter.isMyOrgApplication != false
              || store.filter.withoutAssignedEmployee != false
              || store.filter.employee_id != 0
              || store.filter.incoming_numbers != ""
              || store.filter.outgoing_numbers != ""
              || store.filter.total_sum_from !== null
              || store.filter.total_sum_to !== null
              || store.filter.total_payed_from !== null
              || store.filter.total_payed_to !== null
            ) && (
                <CustomButton
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  id="clearSearchFilterButton"
                  onClick={() => {
                    store.clearFilter();
                    store.loadApplications();
                  }}
                >
                  {translate("clear")}
                </CustomButton>
              )}

            <CustomButton
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
              id="printButton"
              onClick={handlePrint}
            >
              {translate("print") || "Печать"}
            </CustomButton>

            <CustomButton
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
              id="exportExcelButton"
              onClick={handleExportExcel}
            >
              {translate("export_to_excel") || "Экспорт в Excel"}
            </CustomButton>
          </Box>
        </Box>
      </Paper>

      {component}

      <ApplicationPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onClose={() => store.changeOpenPanel(false, 0)}
      />

      <Dialog maxWidth={"md"} fullWidth open={store.openReestrSelectPanel}
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

    </Container>
  );
});

export default ApplicationListView;