import { FC, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
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
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { APPLICATION_STATUSES } from "constants/constant";
import ReestrListView from "features/reestr/reestrListView";
import Tooltip from '@mui/material/Tooltip';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AutocompleteCustom from "components/Autocomplete";
import printJS from 'print-js';
import PageGrid from "components/PageGrid";

type applicationListViewProps = {
  finPlan: boolean;
  forFilter?: boolean;
};




const applicationListView: FC<applicationListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const navigate = useNavigate();

  useEffect(() => {
    store.getValuesFromLocalStorage();
    store.doLoad(props.finPlan);
    return () => {
      store.clearStore();
    };
  }, []);

  const handlePrint = () => {
    const printableData = store.data.map((row) => ({
      number: row.number,
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
        { field: 'status_name', displayName: translate("label:ApplicationListView.status_name") },
        { field: 'service_name', displayName: translate("label:ApplicationListView.service_name") },
        { field: 'arch_object_address', displayName: translate("label:ApplicationListView.arch_object_address") },
        { field: 'customer_name', displayName: translate("label:ApplicationListView.customer_name") },
        { field: 'deadline', displayName: translate("label:ApplicationListView.Registration_time_and_deadline") },
        { field: 'created_by_name', displayName: translate("label:ApplicationListView.registrar") },
        { field: 'assigned_employees_names', displayName: translate("label:ApplicationListView.Performers") },
        { field: 'total_sum', displayName: translate("Калькуляция") },
      ],
      type: 'json',
      style: `
        @media print {
          @page { size: A4; margin: 10mm; }
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


  const columns: GridColDef[] = [

    // {
    //   field: "number",
    //   headerName: translate("label:ApplicationListView.number"),
    //   flex: store.isFinPlan ? 0.7 : 0.5,
    //   renderCell: (params) => {
    //     return <Link
    //       style={{ textDecoration: "underline", marginLeft: 5 }}
    //       to={`/user/Application/addedit?id=${params.row.id}`}>
    //       {params.value}
    //     </Link>;
    //   }
    // },
    {
      field: "status_name",
      headerName: translate("label:ApplicationListView.status_name"),
      flex: 0.7,
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
      field: "deadline",
      headerName: translate("Время регистрации"),
      display: "flex",
      flex: 0.7,
      renderCell: (params) => {

        return <div>
          <div>
            <span>
              {params.row.registration_date ? dayjs(params.row.registration_date).format("DD.MM.YYYY HH:mm") : ""}
            </span>
          </div>
        </div>;
      }
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
    //   field: "created_by_name",
    //   headerName: translate("label:ApplicationListView.registrar"),
    //   flex: 0.7
    // },
    // {
    //   field: "assigned_employees_names",
    //   sortable: false,
    //   headerName: translate("label:ApplicationListView.Performers"),
    //   flex: 1.5
    // },
    // {
    //   field: "total_sum",
    //   headerName: translate("Калькуляция"),
    //   flex: 0.7,
    //   display: "flex",
    //   renderCell: (params) => {
    //     return <div>
    //       <div>
    //         <span>
    //           Сумма: {params.row.total_sum}
    //         </span>
    //       </div>
    //       <div>
    //         <span>
    //           Опл.: <strong>{params.row.total_payed}</strong>
    //         </span>

    //       </div>
    //     </div>;
    //   }
    // },
  ];
  let component = <PageGrid
    customHeader={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", gap: 2, mb: 2 }}>
      <Typography variant="h1">
        {translate("Заявки из кабинета")}
      </Typography>
      <Box>
        <Typography variant="h4">
          {translate('foundTotal') + ":" + store.data.length}
        </Typography>
        <Typography variant="h4">
          {"Новых заявок:" + store.data.filter(x => x.status_code === APPLICATION_STATUSES.from_cabinet).length}
        </Typography>
      </Box>
    </Box>}
    title={translate("label:ApplicationListView.entityTitle")}
    columns={columns}
    hideTitle
    data={store.data}
    hideAddButton
    hideDeleteButton
    tableName="Application"
    customEditClick={(id) => {
      navigate(`/user/Application/addedit?id=${id}&cabinet=true`);
    }}
  />;

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={2}>

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
          <Box display={"flex"} flexDirection={"column-reverse"} sx={{ ml: 2 }} alignItems={"end"}>
            {props.forFilter && <Box display={"flex"} sx={{ minWidth: 80, mt: 1 }}>
              <CustomButton
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.saveFilter();
                }}
              >
                {translate("save")}
              </CustomButton>
              <CustomButton
                sx={{ ml: 1 }}
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.closeFilter();
                }}
              >
                {translate("close")}
              </CustomButton>
            </Box>}
            <Box sx={{ minWidth: 80 }}>
              <CustomButton
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.loadApplications();
                }}
              >
                {translate("search")}
              </CustomButton>
            </Box>
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
              || store.filter.tag_id != 0
              || store.filter.isExpired != false
              || store.filter.isMyOrgApplication != false
              || store.filter.withoutAssignedEmployee != false
              || store.filter.employee_id != 0
              || store.filter.incoming_numbers != ""
              || store.filter.outgoing_numbers != ""
            ) && <Box sx={{ mt: 2 }}>
                <CustomButton
                  id="clearSearchFilterButton"
                  onClick={() => {
                    store.clearFilter();
                    store.loadApplications();
                  }}
                >
                  {translate("clear")}
                </CustomButton>
              </Box>}
            {/* <CustomButton
              sx={{ mb: 2 }}
              variant="contained"
              id="printButton"// TODO Узнать надо или нет
              onClick={handlePrint}
            >
              {translate("print")}
            </CustomButton> */}

          </Box>
        </Box>
      </Paper>


      {component}

    </Container>
  );
})



export default applicationListView
