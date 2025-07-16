import React, { FC, useEffect } from "react";
import {
  Card, CardContent, Divider, Paper, Grid, Container, Button,
  IconButton, Box, Typography, DialogTitle, DialogContent, DialogActions, Dialog, RadioGroup, Radio, FormControlLabel
} from "@mui/material";

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
import AssignmentIcon from "@mui/icons-material/Assignment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomButton from "components/Button";
import TreeLookUp from "components/TreeLookup";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import ApplicationWorkDocumentPopupForm
  from "../../ApplicationWorkDocument/ApplicationWorkDocumentAddEditView/popupForm";
import storeDocument from "features/ApplicationWorkDocument/ApplicationWorkDocumentListView/store";
import FileField from "../../../components/FileField";
import AutocompleteCustom from "../../../components/Autocomplete";
import DownloadIcon from "@mui/icons-material/Download";
import workDocumentStore from 'features/ApplicationWorkDocument/ApplicationWorkDocumentListView/store'
import MainStore from "MainStore";
import { APPLICATION_STATUSES } from "constants/constant";

type application_paymentProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
  onCalculationAdded?: () => void;
  idStructure?: number;
  disabled: boolean;
  isAssigned?: boolean;
  idTask?: number;
  statusCode?: string;
};

const FastInputapplication_paymentView: FC<application_paymentProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    storeList.forApplication = true;
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadapplication_payments();
      storeList.loadApplicationSum();
      storeList.loadUserOrgStructure();
      storeList.loadorg_structures(props.idStructure);
    }
    if (props.idTask !== 0 && store.idTask !== props.idTask) {
      store.idTask = props.idTask;
    }
  }, [props.idMain]);

  useEffect(() => {
    store.filterStructureId = props.idStructure;
  }, [])


  useEffect(() => {
    store.filterStructureId = props.idStructure;
  }, [props.idStructure])

  const columns = [
    {
      field: "structure_name",
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paymentListView.Department")
    },
    {
      field: "file_name",
      width: null,
      headerName: translate("label:application_paymentListView.file_name")
    },
    {
      field: "sum_wo_discount",
      width: null, //or number from 1 to 12
      headerName: translate("Сумма до налогов")
    },
    {
      field: "sum",
      width: null, //or number from 1 to 12
      headerName: translate("Итого")
    },
    {
      field: "sign_full_name",
      width: null, //or number from 1 to 12
      headerName: translate("Подписавшие ЭЦП")
    },
  ];

  //reason

  return (
    <>
      <Paper elevation={7} variant="outlined" sx={{ mt: 2 }}>
        <Card sx={{ m: 2 }}>
          <Box id="application_payment_TitleName" sx={{ mb: 1, ml: 1 }}>
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              {translate("label:application_paymentAddEditView.entityTitle")}
            </Typography>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs sx={{ m: 1 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      {col.headerName}
                    </Typography>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={null} sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
            })}
            <Grid item xs={2}></Grid>
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
                    if (col.field == "sum") {
                      return (
                        <Grid style={{ wordBreak: 'break-all' }} item xs id={id} sx={{ m: 1 }}>
                          <Typography sx={{ fontSize: "12px", color: "red" }}>
                            <strong>{entity[col.field]}</strong>
                          </Typography>
                        </Grid>
                      );
                    }
                    if (col.field == "sign_full_name") {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          <Typography sx={{ fontSize: "12px" }}>
                            <div dangerouslySetInnerHTML={{ __html: entity[col.field] }} />
                          </Typography>
                        </Grid>
                      );
                    }
                    if (col.width == null) {
                      return (
                        <Grid style={{ wordBreak: 'break-all' }} item xs id={id} sx={{ m: 1 }}>
                          <Typography sx={{ fontSize: "12px" }}>
                            <div dangerouslySetInnerHTML={{ __html: entity[col.field] }} />
                          </Typography>
                        </Grid>
                      );
                    } else
                      return (
                        <Grid style={{ wordBreak: 'break-all' }} item xs={col.width} id={id} sx={{ m: 1 }}>
                          <div dangerouslySetInnerHTML={{ __html: entity[col.field] }} />
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} style={{ flexWrap: 'wrap', wordBreak: 'break-all' }} xs={2}>
                    {storeList.isEdit === false && (
                      <>
                        {storeList.data.find(ap => ap.id === entity.id)?.file_id && <Tooltip title={translate("downloadFile")}>
                          <IconButton size="small" onClick={() => store.downloadFile(storeList.data.find(ap => ap.id === entity.id)?.file_id, storeList.data.find(ap => ap.id === entity.id)?.file_name)}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>}
                        <IconButton
                          id="id_EmployeeContactEditButton"
                          name="edit_button"
                          disabled={entity.structure_id != storeList.first_user_structure_id}
                          style={{ margin: 0, marginRight: 5, padding: 0 }}
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
                          disabled={entity.structure_id && !storeList.org_structures.find(x => x.id === entity.structure_id)}
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
                            <br />
                            {`Описание - ${entity.description}`}
                          </>} placement="left">
                            <InfoOutlinedIcon />
                          </Tooltip>
                        </IconButton>
                        <IconButton>
                          <Tooltip
                            title={<>Подписать</>}
                            placement="left"
                            onClick={() => {

                              storeList.signApplicationPayment(entity.id, entity.file_id);
                            }}
                          >
                            <AssignmentIcon />
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

          <Grid item xs sx={{ m: 1 }}>
            Общая сумма: &nbsp;<strong>{storeList.totalSum}</strong><br />
          </Grid>

          {storeList.isEdit ? (
            <Paper elevation={7} variant="outlined" sx={{ mt: 2 }}>
              <Card sx={{ m: 2 }}>
                <Grid container spacing={3} sx={{ mt: 2, mb: 2 }}>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_free_calc}
                      onChange={(event) => {
                        if (event.target.value) {
                          store.sum_wo_discount = 0;
                          store.sum = 0;
                          store.nds = 0;
                          store.nds_value = 0;
                          store.nsp = 0;
                          store.nsp_value = 0;
                        } else {
                          store.nds = 12;
                          store.nsp = 2;
                        }
                        store.handleChange(event);

                      }}
                      name="is_free_calc"
                      label={translate("label:application_paymentAddEditView.is_free_calculation")}
                      id="id_f_is_free_calc"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <LookUp
                      data={store.org_structures}
                      // hideLabel
                      value={store.structure_id}
                      error={!!store.errors.structure_id}
                      helperText={store.errors.structure_id}
                      id="id_f_application_payment_structure_id"
                      label={translate("label:application_paymentAddEditView.structure_id")}
                      onChange={(event) => {
                        store.handleChange(event);
                        store.changeOrgStructures();
                      }}
                      name="structure_id"
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <CustomTextField
                      value={store.sum_wo_discount}
                      disabled={store.is_free_calc}
                      onChange={(event) => {
                        // Удаляем ведущие нули (кроме 0.)
                        if (event.target.value?.length > 1 && event.target.value?.startsWith("0") && !event.target.value?.startsWith("0.")) {
                          event.target.value = event.target.value?.replace(/^0+/, "");
                        }

                        // Заменяем запятую на точку
                        if (event.target.value?.includes(',')) {
                          event.target.value = event.target.value.replace(',', '.');
                        }

                        // ПРОСТО СОХРАНЯЕМ ЗНАЧЕНИЕ КАК ЕСТЬ - НЕ ВЫЗЫВАЕМ handleChangeNumber!
                        store.sum_wo_discount = event.target.value;

                        // Валидацию и расчеты делаем только если это валидное число
                        const numValue = parseFloat(event.target.value);
                        if (!isNaN(numValue) && event.target.value !== '' && !event.target.value.endsWith('.')) {
                          store.validateField('sum_wo_discount', numValue);
                          store.calculateSum();
                        }
                      }}
                      name="sum_wo_discount"
                      type="number"
                      data-testid="id_f_application_payment_sum_wo_discount"
                      id="id_f_application_payment_sum_wo_discount"
                      label={translate("Сумма до налогов")}
                      helperText={store.errors.sum_wo_discount}
                      error={!!store.errors.sum_wo_discount}
                    />
                  </Grid>
                  {store.serice_price > 0 && <Grid item md={3} xs={12}>
                    {translate("label:ServicePriceListView.service_price")}: &nbsp;<strong>{store.serice_price}</strong><br />
                  </Grid>}
                  {/* <Grid item md={3} xs={12}>
                    <CustomCheckbox
                      value={store.is_percentage}
                      onChange={(event) => store.handleChange(event)}
                      name="is_percentage"
                      label={translate("label:application_paymentAddEditView.is_percentage")}
                      id="id_f_is_percentage"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <CustomTextField
                      disabled={!store.is_percentage}
                      value={store.discount_percentage}
                      onChange={(event) => {
                        if (event.target.value?.length > 1 && event.target.value?.startsWith("0")) {
                          event.target.value = event.target.value?.replace(/^0+/, "");
                        }
                        store.handleChange(event)
                      }}
                      name="discount_percentage"
                      type="number"
                      data-testid="id_f_application_payment_discount_percentage"
                      id="id_f_application_payment_discount_percentage"
                      label={translate("label:application_paymentAddEditView.discount_percentage")}
                      helperText={store.errors.discount_percentage}
                      error={!!store.errors.discount_percentage}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <CustomTextField
                      disabled={true}
                      value={store.discount_percentage_value}
                      onChange={(event) => {
                      }}
                      name="discount_percentage_value"
                      type="number"
                      data-testid="id_f_application_payment_discount_percentage_value"
                      id="id_f_application_payment_discount_percentage_value"
                      label={translate("label:application_paymentAddEditView.discount_percentage_value")}
                      helperText={store.errors.discount_percentage_value}
                      error={!!store.errors.discount_percentage_value}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <CustomTextField
                      disabled={store.is_percentage}
                      value={store.discount_value}
                      onChange={(event) => {
                        if (event.target.value?.length > 1 && event.target.value?.startsWith("0")) {
                          event.target.value = event.target.value?.replace(/^0+/, "");
                        }
                        store.handleChange(event);
                      }}
                      name="discount_value"
                      type="number"
                      data-testid="id_f_application_payment_discount_value"
                      id="id_f_application_payment_discount_value"
                      label={translate("label:application_paymentAddEditView.discount_value")}
                      helperText={store.errors.discount_value}
                      error={!!store.errors.discount_value}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
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
                  <Grid item md={6} xs={12}>
                    <AutocompleteCustom
                      value={store.head_structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="head_structure_id"
                      data={store.employeeInStructure}
                      fieldNameDisplay={(field) => field.employee_name + " - " + field.post_name}
                      data-testid="id_f_application_task_assignee_head_structure_id"
                      id='id_f_application_task_assignee_head_structure_id'
                      label={translate('label:application_paymentAddEditView.head_structure_id')}
                      helperText={store.errors.head_structure_id}
                      error={!!store.errors.head_structure_id}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <AutocompleteCustom
                      value={store.implementer_id}
                      onChange={(event) => store.handleChange(event)}
                      name="implementer_id"
                      data={store.employeeInStructure}
                      fieldNameDisplay={(field) => field.employee_name + " - " + field.post_name}
                      data-testid="id_f_application_task_assignee_implementer_id"
                      id='id_f_application_task_assignee_implementer_id'
                      label={translate('label:application_paymentAddEditView.implementer_id')}
                      helperText={store.errors.implementer_id}
                      error={!!store.errors.implementer_id}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <CustomCheckbox

                      disabled={store.is_free_calc}
                      value={store.is_manual_entry_nds}
                      onChange={(event) => store.handleChange(event)}
                      name="is_manual_entry_nds"
                      label={translate("label:application_paymentAddEditView.is_manual_entry_nds")}
                      id="id_f_is_manual_entry_nds"
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <CustomTextField
                      value={store.nds}
                      disabled={!store.is_manual_entry_nds}
                      onChange={(event) => store.handleChange(event)}
                      name="nds"
                      type="number"
                      data-testid="id_f_application_payment_nds"
                      id="id_f_application_payment_nds"
                      label={translate("label:application_paymentAddEditView.nds")}
                      helperText={store.errors.nds}
                      error={!!store.errors.nds}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <CustomCheckbox
                      disabled={store.is_free_calc}
                      value={store.is_manual_entry_nsp}
                      onChange={(event) => store.handleChange(event)}
                      name="is_manual_entry_nsp"
                      label={translate("label:application_paymentAddEditView.is_manual_entry_nsp")}
                      id="id_f_is_manual_entry_nsp"
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <CustomTextField
                      value={store.nsp}
                      disabled={!store.is_manual_entry_nsp}
                      onChange={(event) => store.handleChange(event)}
                      name="nsp"
                      type="number"
                      data-testid="id_f_application_payment_nsp"
                      id="id_f_application_payment_nsp"
                      label={translate("label:application_paymentAddEditView.nsp")}
                      helperText={store.errors.nsp}
                      error={!!store.errors.nsp}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <CustomTextField
                      value={store.nds_value}
                      disabled={true}
                      onChange={(event) => store.handleChange(event)}
                      name="nds_value"
                      type="number"
                      data-testid="id_f_application_payment_nds_value"
                      id="id_f_application_payment_nds_value"
                      label={translate("label:application_paymentAddEditView.nds_value")}
                      helperText={store.errors.nds_value}
                      error={!!store.errors.nds_value}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <CustomTextField
                      value={store.nsp_value}
                      disabled={true}
                      onChange={(event) => store.handleChange(event)}
                      name="nsp_value"
                      type="number"
                      data-testid="id_f_application_payment_nsp_value"
                      id="id_f_application_payment_nsp_value"
                      label={translate("label:application_paymentAddEditView.nsp_value")}
                      helperText={store.errors.nsp_value}
                      error={!!store.errors.nsp_value}
                    />
                  </Grid>
                  <Grid item md={8} xs={12}>
                    <FileField
                      value={store.FileName}
                      helperText={store.errors.FileName}
                      error={!!store.errors.FileName}
                      inputKey={store.idDocumentinputKey}
                      fieldName="FileName"
                      onChange={(event) => {
                        if (event.target.files.length == 0) return;
                        store.handleChange({ target: { value: event.target.files[0], name: "File" } });
                        store.handleChange({ target: { value: event.target.files[0].name, name: "FileName" } });
                        store.changeDocInputKey();
                      }}
                      onClear={() => {
                        store.handleChange({ target: { value: null, name: "File" } });
                        store.handleChange({ target: { value: "", name: "FileName" } });
                        store.changeDocInputKey();
                      }}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <CustomTextField
                      value={store.sum}
                      disabled={true}
                      onChange={(event) => store.handleChange(event)}
                      name="sum"
                      type="number"
                      data-testid="id_f_application_payment_sum"
                      id="id_f_application_payment_sum"
                      label={translate("Итого")}
                      helperText={store.errors.sum}
                      error={!!store.errors.sum}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
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

                  <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                    <CustomButton
                      variant="contained"
                      disabled={props.disabled}
                      size="small"
                      id="id_application_paymentSaveButton"
                      sx={{ mr: 1 }}
                      onClick={() => {
                        store.onSaveClick((id: number) => {
                          storeList.setFastInputIsEdit(false);
                          storeList.loadapplication_payments();
                          storeList.loadApplicationSum();
                          storeList.loadorg_structures(props.idStructure);
                          workDocumentStore.loadApplicationWorkDocumentsByTask(store.idTask)
                          store.clearStore();
                          if (props.onCalculationAdded) {
                            props.onCalculationAdded()
                          }
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
              </Card>
            </Paper>
          ) : (
            <Grid container spacing={3}>

              {/*<Grid item xs={3} display={"flex"} justifyContent={"flex-start"} sx={{ mt: 2 }}>*/}
              {/*  <CustomButton*/}
              {/*    variant="contained"*/}
              {/*    size="small"*/}
              {/*    disabled={props.disabled}*/}
              {/*    id="id_application_paymentAddButton"*/}
              {/*    onClick={() => {*/}
              {/*      storeList.printForStructure();*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    {translate("common:print")}*/}
              {/*  </CustomButton>*/}
              {/*</Grid>*/}
              {/* TODO Delete */}
              {/*<Grid item xs={3} display={"flex"} justifyContent={"flex-start"} sx={{ mt: 2 }}>*/}
              {/*  <CustomButton*/}
              {/*    variant="contained"*/}
              {/*    size="small"*/}
              {/*    disabled={props.disabled}*/}
              {/*    id="id_application_paymentAddButton"*/}
              {/*    onClick={() => {*/}
              {/*      storeList.getPDFForStructure();*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    {translate("common:download")}*/}
              {/*  </CustomButton>*/}
              {/*</Grid>*/}
              <Grid item xs={6} display={"flex"} justifyContent={"flex-start"} sx={{ mt: 2 }}>
                {storeList.data?.length > 0 &&
                  <CustomButton
                    variant="contained"
                    size="small"
                    id="id_application_paymentPrintButton"
                    onClick={() => {
                      store.openPrint = true;
                    }}
                  >
                    {translate("Распечатать акт")}
                  </CustomButton>
                }
              </Grid>
              <Grid item xs={6} display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_application_paymentAddButton"
                  onClick={() => {
                    if (!props.isAssigned && !MainStore.isAdmin) { // если не назначены
                      MainStore.openErrorDialog("Вы не назначены на задачу")
                      return;
                    }
                    if (props.statusCode !== APPLICATION_STATUSES.preparation) {
                      MainStore.openErrorDialog("Статус заявки не верный")
                      return;
                    }
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
        </Card>
        <ConfirmationDialogRaw
          id="ringtone-menu"
          keepMounted
          open={store.openPrint}
          onClose={(v) => {
            store.openPrint = false;
            MainStore.printDocumentByCode("act", {
              application_id: props.idMain
            }, v)
          }}
        />
      </Paper>
    </>
  );
});

interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, open, ...other } = props;
  const [value, setValue] = React.useState(null);
  const radioGroupRef = React.useRef<HTMLElement>(null);


  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Выберите язык</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
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
        <Button autoFocus onClick={handleCancel}>
          Отмена
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}


export default FastInputapplication_paymentView;
