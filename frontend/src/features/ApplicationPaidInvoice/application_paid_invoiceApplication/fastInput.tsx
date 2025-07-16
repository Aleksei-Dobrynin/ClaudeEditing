import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../ApplicationPaidInvoiceListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";
import dayjs from "dayjs";
import ApplicationStore from 'features/Application/ApplicationAddEditView/store'
import MainStore from "MainStore";

type application_paid_invoiceProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
  isDisabled? : boolean;
};

const FastInputView: FC<application_paid_invoiceProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadApplicationPaidInvoicesByIDApplication();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'date',
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paid_invoiceListView.date"),
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}
        </span>
      )
    },
    {
      field: 'payment_identifier',
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paid_invoiceListView.payment_identifier"),
    },
    {
      field: 'sum',
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paid_invoiceListView.sum"),
    },
  ];

  return (
    <Card component={Paper} elevation={5} sx={{ mt: 2 }}>
      <CardContent>
        <Box id="application_payment_TitleName" sx={{ mb: 1, ml: 1 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
            {translate("label:application_paid_invoiceAddEditView.Receipt_of_funds")}
          </Typography>
        </Box>
        <Divider />
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
          {columns.map((col) => {
            const id = "id_c_title_application_paid_invoice_" + col.field;
            if (col.width == null) {
              return (
                <Grid id={id} item xs sx={{ m: 1 }}>
                  <Typography sx={{ fontWeight: "bold" }}>
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
                id="id_application_paid_invoice_row"
              >
                {columns.map((col) => {
                  const id = "id_application_paid_invoice_" + col.field + "_value";
                  if (col.width == null) {
                    if (col.renderCell == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {col.renderCell({ value: entity[col.field], entity })}
                        </Grid>
                      );
                    }
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
                      {/* <IconButton
                        id="id_application_paid_invoiceEditButton"
                        name="edit_button"
                        style={{ margin: 0, marginRight: 5, padding: 0 }}
                        onClick={() => {
                          storeList.setFastInputIsEdit(true);
                          store.doLoad(entity.id);
                        }}
                      >
                        <CreateIcon />
                      </IconButton> */}
                      <IconButton
                        id="id_application_paid_invoiceDeleteButton"
                        name="delete_button"
                        disabled={!(MainStore.isFinancialPlan || MainStore.isAdmin || ApplicationStore.status_code === "done" || (!MainStore.isAdmin && props.isDisabled))}
                        style={{ margin: 0, padding: 0 }}
                        onClick={() => storeList.deleteappication_paid_invoice(entity.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Grid>
              </Grid>
              <Divider />
            </>
          );
        })}
        <Grid item xs sx={{ m: 1, ml: '70%' }}>
          Общая сумма: &nbsp;<strong>{storeList.totalSum?.toFixed(2)}</strong>
        </Grid>

        {storeList.isEdit ? (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item md={4} xs={12}>
              <CustomTextField
                value={store.payment_identifier}
                onChange={(event) => store.handleChange(event)}
                name="payment_identifier"
                data-testid="id_f_application_paid_invoice_payment_identifier"
                id='id_f_application_paid_invoice_identifier'
                label={translate('label:application_paid_invoiceAddEditView.payment_identifier_number')}
                helperText={store.errors.payment_identifier}
                error={!!store.errors.payment_identifier}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <CustomTextField
                value={store.sum}
                onChange={(event) => store.handleChange(event)}
                name="sum"
                data-testid="id_f_application_paid_invoice_sum"
                id='id_f_application_paid_sum'
                type="number"
                label={translate('label:application_paid_invoiceAddEditView.sum')}
                helperText={store.errors.sum}
                error={!!store.errors.sum}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DateTimeField
                value={store.date}
                onChange={(event) => store.handleChange(event)}
                name="date"
                id='id_f_application_paid_invoice_date'
                label={translate('label:application_paid_invoiceAddEditView.date')}
                helperText={store.errors.date}
                error={!!store.errors.date}
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_customer_contactSaveButton"
                sx={{ mr: 1 }}
                disabled={!(MainStore.isFinancialPlan || MainStore.isAdmin || (MainStore.isAccountant && ApplicationStore.status_code !== "done")) || ApplicationStore.status_code === "done"}
                onClick={() => {
                  store.onSaveClick((id: number) => {
                    storeList.setFastInputIsEdit(false);
                    storeList.loadApplicationPaidInvoicesByIDApplication();
                    store.clearStore();
                  });
                }}
              >
                {translate("common:save")}
              </CustomButton>
              <CustomButton
                variant="contained"
                size="small"
                id="id_customer_contactCancelButton"
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
          <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
            <CustomButton
              variant="contained"
              size="small"
                        disabled={!(MainStore.isFinancialPlan || MainStore.isAdmin || (MainStore.isAccountant && ApplicationStore.status_code !== "done")) || ApplicationStore.status_code === "done"}
              id="id_customer_contactAddButton"
              onClick={() => {
                storeList.setFastInputIsEdit(true);
                store.doLoad(0);
                store.application_id = props.idMain;
              }}
            >
              {translate("common:add")}
            </CustomButton>
          </Grid>
        )}

      </CardContent>
    </Card>
  );
});

export default FastInputView;
