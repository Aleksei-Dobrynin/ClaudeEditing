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

type application_paid_invoiceProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
  disabled?: boolean; 
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
      field: 'sum',
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paid_invoiceListView.sum"),
    },
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
      field: 'bank_identifier',
      width: null, //or number from 1 to 12
      headerName: translate("label:application_paid_invoiceListView.bank_identifier"),
    },
  ];

  return (
    <Paper elevation={7} variant="outlined" sx={{ mt: 2 }}>
      <Card sx={{ m: 2 }}>
        <Box id="application_payment_TitleName" sx={{ mb: 1, ml: 1 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
            {translate("label:application_paid_invoiceAddEditView.Receipt_of_funds")}
          </Typography>
        </Box>
        <Divider />
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
          {columns.map((col) => {
            const id = "id_c_title_EmployeeContact_" + col.field;
            if (col.width == null) {
              return (
                <Grid id={id} item xs sx={{ m: 1 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: "bold" }}>
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
                    if (col.renderCell == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          <Typography sx={{ fontSize: '12px' }}>
                            {entity[col.field]}
                          </Typography>
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          <Typography sx={{ fontSize: '12px' }}>
                            {col.renderCell({ value: entity[col.field], entity })}
                          </Typography>
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
              </Grid>
              <Divider />
            </>
          );
        })}
      </Card>
    </Paper>
  );
});

export default FastInputView;
