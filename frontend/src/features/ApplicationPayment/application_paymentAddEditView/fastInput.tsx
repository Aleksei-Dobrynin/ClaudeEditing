import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import storeInvoice from "./../../ApplicationPaidInvoice/ApplicationPaidInvoiceListView/store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../application_paymentListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomButton from "components/Button";
import TreeLookUp from "components/TreeLookup";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Autocomplete from "@mui/material/Autocomplete";
import AutocompleteCustom from "../../../components/Autocomplete";
import Alert from '@mui/material/Alert';
import DownloadIcon from "@mui/icons-material/Download";
import DiscountFormView from './discountForm'
import MainStore from "MainStore";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FileViewer from "../../../components/FileViewer";


type application_paymentProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
  statusCode?: string;
  isDisabled?: boolean;
};

const FastInputapplication_paymentView: FC<application_paymentProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    storeList.forApplication = true;
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadapplication_payments();
      storeList.loadCustomerDiscount();
      storeList.loadorg_structures();
      storeList.loadApplicationSum();
    }
  }, [props.idMain]);

  const isReadOnly = (props.statusCode == 'document_ready' || (!MainStore.isAdmin && props.isDisabled));

  const columns = [
    {
      field: "structure_name",
      width: null, //or number from 1 to 12
      headerName: "Отдел",
      renderCell: (param) => {
        return <span>
          {param.row.name}
          <span>{param.row}</span>
        </span>
      }

    },
    // {
    //   field: "structure_short_name",
    //   width: null, //or number from 1 to 12
    //   headerName: translate("label:application_paymentListView.structure_short_name"),
    //   renderCell: (param) => {

    //     return <span>
    //       <span>{param.row?.structure_short_name}</span>
    //     </span>
    //   }

    // },
    {
      field: "description",
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paymentListView.description")
    },
    {
      field: "created_by_name",
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paymentListView.created_by")
    },
    {
      field: "updated_by_name",
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paymentListView.updated_by")
    },
    {
      field: "sum",
      width: null, //or number from 1 to 12
      headerName: translate("Сумма")
    },
    // {
    //   field: "discount_value",
    //   width: null, //or number from 1 to 12
    //   headerName: translate("label:application_paymentListView.discount_value"),
    //   renderCell: (param) => {
    //     return <span>{param.row?.discount_percentage ? (param.row?.discount_percentage + "%") : param.row?.discount_value }</span>
    //   }

    // },
    // {
    //   field: "discount_percentage",
    //   width: null, //or number from 1 to 12
    //   headerName: translate("label:application_paymentListView.discount_percentage")
    // },
    // {
    //   field: "discount_value",
    //   width: null, //or number from 1 to 12
    //   headerName: translate("label:application_paymentListView.discount_value")
    // },
    // {
    //   field: "reason",
    //   width: null, //or number from 1 to 12
    //   headerName: translate("label:application_paymentListView.reason")
    // },
    // {
    //   field: "sum_wo_discount",
    //   width: null, //or number from 1 to 12
    //   headerName: translate("Сумма")
    // },
  ];

  return (
    <>
      {storeList.is_show_discount &&
        <Box display={"flex"} justifyContent={"center"} sx={{ mb: 2 }}>
          <Alert variant="filled" severity="info">{translate("label:application_paymentAddEditView.message_discount")}</Alert>
        </Box>
      }
      <Box display={"flex"} justifyContent={"center"}
        sx={{ fontSize: 24 }}
      >
        Калькуляция
      </Box>
      <FileViewer
        isOpen={store.isOpenFileView}
        onClose={() => { store.isOpenFileView = false }}
        fileUrl={store.fileUrl}
        fileType={store.fileType} />
      <Card component={Paper} elevation={5} sx={{ mt: 2 }}>
        <CardContent>
          <Box id="application_payment_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:application_paymentAddEditView.entityTitle")}</h3>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={null} sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
            })}
            <Grid item xs={1}></Grid>
          </Grid>
          <Divider />

          {storeList.data.map((entity) => {
            const style = { backgroundColor: entity.id === store.id && "#F0F0F0" };
            return (
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={style}
                  spacing={1}
                  id="id_EmployeeContact_row"
                >
                  {columns.map((col) => {
                    const id = "id_EmployeeContact_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid item xs={col.width} id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <>
                        {storeList.data.find(ap => ap.id === entity.id)?.file_id && <Tooltip title={translate("view")}>
                          <IconButton size='small' onClick={() => store.OpenFileFile(storeList.data.find(ap => ap.id === entity.id)?.file_id, storeList.data.find(ap => ap.id === entity.id)?.file_name)}>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        </Tooltip>}
                        {storeList.data.find(ap => ap.id === entity.id)?.file_id && <Tooltip title={translate("downloadFile")}>
                          <IconButton size="small" onClick={() => store.downloadFile(storeList.data.find(ap => ap.id === entity.id)?.file_id, storeList.data.find(ap => ap.id === entity.id)?.file_name)}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>}
                        <IconButton
                          id="id_EmployeeContactEditButton"
                          name="edit_button"
                          style={{ margin: 0, marginRight: 5, padding: 0 }}
                          disabled={(entity.structure_id && !storeList.org_structures.find(x => x.id === entity.structure_id) || isReadOnly) && !MainStore.isFinancialPlan}
                          onClick={() => {
                            storeList.setFastInputIsEdit(true);
                            store.doLoad(entity.id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          id="id_EmployeeContactDeleteButton"
                          name="delete_button"
                          disabled={(entity.structure_id && !storeList.org_structures.find(x => x.id === entity.structure_id) || isReadOnly) && !MainStore.isFinancialPlan}
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deleteapplication_payment(entity.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          id="id_EmployeeContacInfoButton"
                        >
                          <Tooltip title={<>
                            {`Создано - ${storeList.data.find(ap => ap.id === entity.id)?.created_by_name} - ${storeList.data.find(ap => ap.id === entity.id)?.created_at ? dayjs(storeList.data.find(ap => ap.id === entity.id)?.created_at).format("DD.MM.YYYY HH:mm") : ""}`}
                            <br />
                            {`Обновлено - ${storeList.data.find(ap => ap.id === entity.id)?.updated_by_name} - ${storeList.data.find(ap => ap.id === entity.id)?.updated_at ? dayjs(storeList.data.find(ap => ap.id === entity.id)?.updated_at).format("DD.MM.YYYY HH:mm") : ""}`}
                          </>} placement="left">
                            <InfoOutlinedIcon />
                          </Tooltip>
                        </IconButton>
                      </>
                    )}

                  </Grid>
                </Grid>
                <Divider />
              </>
            );
          })}
          {/* <Grid item xs sx={{ m: 1, ml: '74%' }}>
            Общая сумма: &nbsp;<strong>{storeList.totalSum?.toFixed(2)}</strong>
          </Grid> */}
          <Grid container spacing={1} sx={{ mt: 1, mb: 1 }}>
            <Grid item md={3} xs={12}>
              {translate("label:application_paymentListView.application_sum_wo_discount")}: &nbsp;<strong>{storeList.application_sum_wo_discount?.toFixed(2)}</strong>
            </Grid>
            <Grid item md={2} xs={12}>
              {translate("Скидка")}: &nbsp;<strong>{storeList.application_discount_value ? (storeList.application_discount_value - 0)?.toFixed(2) : ((storeList.application_discount_percentage - 0)?.toFixed(2) + "%")}</strong>
            </Grid>
            <Grid item md={2} xs={12}>
              {translate("Включая НДС")}: &nbsp;<strong>{storeList.application_nds_value?.toFixed(2)}</strong>
            </Grid>
            <Grid item md={2} xs={12}>
              {translate("Включая НСП")}: &nbsp;<strong>{storeList.application_nsp_value?.toFixed(2)}</strong>
            </Grid>
            <Grid item md={3} xs={12}>
              {translate("label:application_paymentListView.application_total_sum")}: &nbsp;<strong>{storeList.application_total_sum?.toFixed(2)}</strong>
            </Grid>
          </Grid>
          {storeList.isDiscountForm && <DiscountFormView />}
          {storeList.isEdit ? (
            <Grid container spacing={1} sx={{ mt: 2, mb: 15 }}>

              <Grid item md={2} xs={12}>
                <AutocompleteCustom
                  data={store.org_structures}
                  // hideLabel
                  value={store.structure_id}
                  error={!!store.errors.structure_id}
                  helperText={store.errors.structure_id}
                  id="id_f_application_payment_structure_id"
                  label={"Отдел"}
                  fieldNameDisplay={(e) => `${e.name} ${e.short_name ? "(" + e.short_name + ")" : ""}`}
                  onChange={(e) => store.handleChange(e)}
                  name="structure_id"
                />
              </Grid>
              {/* <Grid item md={2} xs={12}>
                <CustomTextField
                  value={store.sum_wo_discount}
                  onChange={(event) => {

                    if (event.target.value?.length > 1 && event.target.value?.startsWith("0")) {
                      event.target.value = event.target.value?.replace(/^0+/, "");
                    }
                    if (store.is_percentage) {
                      store.discount_percentage_value = Math.round(((store.discount_percentage / 100.0) * Number(event.target.value)) * 100) / 100;
                      store.sum = Math.round((store.sum_wo_discount - store.discount_percentage) * 100) / 100;
                    } else {
                      store.sum = Math.round((Number(event.target.value) - store.discount_value) * 100) / 100;
                    }
                    store.handleChange(event)
                  }}
                  name="sum_wo_discount"
                  type="number"
                  data-testid="id_f_application_payment_sum_wo_discount"
                  id="id_f_application_payment_sum_wo_discount"
                  label={translate("Сумма")}
                  helperText={store.errors.sum_wo_discount}
                  error={!!store.errors.sum_wo_discount}
                />
              </Grid> */}
              {/* <Grid item md={2} xs={12}>
                <CustomCheckbox
                  value={store.is_percentage}
                  onChange={(event) => store.handleChange(event)}
                  name="is_percentage"
                  label={translate("label:application_paymentAddEditView.is_percentage")}
                  id="id_f_is_percentage"
                />
              </Grid> */}
              {/* <Grid item md={1} xs={12}>
                <CustomTextField
                  disabled={!store.is_percentage}
                  value={store.discount_percentage}
                  onChange={(event) => {
                    if (event.target.value?.length > 1 && event.target.value?.startsWith("0")) {
                      event.target.value = event.target.value?.replace(/^0+/, "");
                    }
                    store.discount_percentage_value = Math.round(((store.sum_wo_discount / 100) * Number(event.target.value)) * 100) / 100;
                    store.discount_percentage = Number(event.target.value);
                    store.sum = store.sum_wo_discount - store.discount_percentage_value;
                    store.discount_value = 0;
                    store.validateField('discount_percentage', store.discount_percentage);
                  }}
                  name="discount_percentage"
                  type="number"
                  data-testid="id_f_application_payment_discount_percentage"
                  id="id_f_application_payment_discount_percentage"
                  label={translate("label:application_paymentAddEditView.discount_percentage")}
                  helperText={store.errors.discount_percentage}
                  error={!!store.errors.discount_percentage}
                />
              </Grid> */}
              {/* <Grid item md={1} xs={12}>
                <CustomTextField
                  disabled={true}
                  value={store.discount_percentage_value}
                  onChange={(event) => { }}
                  name="discount_percentage_value"
                  type="number"
                  data-testid="id_f_application_payment_discount_percentage_value"
                  id="id_f_application_payment_discount_percentage_value"
                  label={translate("label:application_paymentAddEditView.discount_percentage_value")}
                  helperText={store.errors.discount_percentage_value}
                  error={!!store.errors.discount_percentage_value}
                />
              </Grid> */}
              {/* <Grid item md={1} xs={12}>
                <CustomTextField
                  disabled={store.is_percentage}
                  value={store.discount_value}
                  onChange={(event) => {
                    if (event.target.value?.length > 1 && event.target.value?.startsWith("0")) {
                      event.target.value = event.target.value?.replace(/^0+/, "");
                    }
                    store.discount_value = Number(event.target.value);
                    store.sum = store.sum_wo_discount - store.discount_value;
                    store.discount_percentage = 0;
                    store.validateField('discount_value', store.discount_value);
                  }}
                  name="discount_value"
                  type="number"
                  data-testid="id_f_application_payment_discount_value"
                  id="id_f_application_payment_discount_value"
                  label={translate("label:application_paymentAddEditView.discount_value")}
                  helperText={store.errors.discount_value}
                  error={!!store.errors.discount_value}
                />
              </Grid> */}
              <Grid item md={3} xs={12}>
                <CustomTextField
                  value={store.sum}
                  onChange={(event) => store.handleChange(event)}
                  name="sum"
                  type="number"
                  data-testid="id_f_application_payment_sum"
                  id="id_f_application_payment_sum"
                  label={translate("Сумма с налогами")}
                  helperText={store.errors.sum}
                  error={!!store.errors.sum}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomTextField
                  value={store.description}
                  onChange={(event) => store.handleChange(event)}
                  name="description"
                  multiline
                  data-testid="id_f_application_payment_description"
                  id="id_f_application_payment_description"
                  label={translate("label:application_paymentAddEditView.description")}
                  helperText={store.errors.description}
                  error={!!store.errors.description}
                />
              </Grid>
              {/* <Grid item md={6} xs={12}>
                <CustomTextField
                  value={store.reason}
                  onChange={(event) => store.handleChange(event)}
                  name="reason"
                  multiline
                  data-testid="id_f_application_payment_reason"
                  id="id_f_application_payment_reason"
                  label={translate("label:application_paymentAddEditView.reason")}
                  helperText={store.errors.reason}
                  error={!!store.errors.reason}
                />
              </Grid> */}
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_application_paymentSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadapplication_payments();
                      storeList.loadApplicationSum();
                      storeList.loadorg_structures();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_application_paymentCancelButton"
                  onClick={() => {
                    storeList.setFastInputIsEdit(false);
                    store.clearStore();
                  }}
                >
                  {translate("common:cancel")}
                </CustomButton>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={1} sx={{ mt: 2, mb: 15 }} display={"flex"} justifyContent={"flex-end"}>
              <Grid item>
                <CustomButton
                  variant="contained"
                  disabled={(storeList.isDiscountForm || isReadOnly) && !MainStore.isFinancialPlan}
                  size="small"
                  id="id_application_paymentAddButton"
                  onClick={() => {
                    storeList.setOpenDiscountForm(true);
                    store.doLoad(0);
                    store.application_id = props.idMain;
                  }}
                >
                  {translate("label:application_paymentAddEditView.add_discount")}
                </CustomButton>
              </Grid>
              <Grid item>
                <CustomButton
                  variant="contained"
                  disabled={(storeList.isDiscountForm || isReadOnly) && !MainStore.isFinancialPlan}
                  size="small"
                  id="id_application_paymentAddButton"
                  onClick={() => {
                    storeList.setFastInputIsEdit(true);
                    store.doLoad(0);
                    store.application_id = props.idMain;
                  }}
                >
                  {translate("common:add")}
                </CustomButton>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </>
  );
});

export default FastInputapplication_paymentView;
