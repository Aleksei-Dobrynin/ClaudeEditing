import React, { FC, useEffect } from "react";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { Box } from "@mui/material";

type ApplicationPaidInvoiceListViewProps = {
  idMain: number;
};


const ApplicationPaidInvoiceListView: FC<ApplicationPaidInvoiceListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && store.idMain !== props.idMain) {
      store.idMain = props.idMain;
      store.loadApplicationPaidInvoicesByIDApplication();
    }
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: translate("label:ApplicationPaidInvoiceListView.date"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}
        </span>
      )
    },
    {
      field: "bank_identifier",
      headerName: translate("label:ApplicationPaidInvoiceListView.bank_identifier"),
      flex: 1
    },
    {
      field: "sum",
      headerName: translate("label:ApplicationPaidInvoiceListView.sum"),
      flex: 1
    },
    {
      field: "payment_identifier",
      headerName: translate("label:ApplicationPaidInvoiceListView.payment_identifier"),
      flex: 1
    }
  ];

  return (
    <div style={{ marginTop: 30 }}>
      <PageGrid
        title={translate("label:ApplicationPaidInvoiceListView.entityTitle")}
        columns={columns}
        data={store.data}
        tableName="ApplicationPaidInvoice"
        hideAddButton={true}
        customBottom={<Box sx={{ mt: 1, mr: 2 }} display={"flex"} justifyContent={"flex-end"}>
          Общая сумма: &nbsp;<strong>{store.totalSum}</strong>
        </Box>}
        hideActions={true} />
    </div>);
});


export default ApplicationPaidInvoiceListView;
