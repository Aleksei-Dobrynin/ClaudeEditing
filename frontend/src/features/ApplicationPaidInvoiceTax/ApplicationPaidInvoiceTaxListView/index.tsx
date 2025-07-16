import React, { FC, useEffect } from "react";
import PageGrid from "../ApplicationPaidInvoiceTaxListView/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";


type ApplicationPaidInvoiceTaxListViewProps = {
  idMain: number;
};

const ApplicationPaidInvoiceTaxListView: FC<ApplicationPaidInvoiceTaxListViewProps> = observer(
  (props) => {
    const { t } = useTranslation();
    const translate = t;
    useEffect(() => {
      if (props.idMain !== 0 && store.idMain !== props.idMain) {
        store.idMain = props.idMain;
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
          params.id != "defoultRow" ? <span>{params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}</span> : "Total"
        ),
      },
      {
        field: "bank_identifier",
        headerName: translate("label:ApplicationPaidInvoiceListView.bank_identifier"),
        flex: 1,
      },
      {
        field: "sum",
        headerName: translate("label:ApplicationPaidInvoiceListView.sum"),
        flex: 1,
      },
      {
        field: "tax",
        headerName: translate("label:ApplicationPaidInvoiceListView.tax"),
        flex: 1,
      },
    ];

    return (
      <div style={{ marginTop: 30 }}>
        
        <PageGrid
          title={translate("label:ApplicationPaidInvoiceListView.entityTitle")}
          columns={columns}
          data={store.data}
          tableName="ApplicationPaidInvoice"
          hideAddButton={true}
          hideActions={true}
        />
        ;
      </div>
    );
  }
);

export default ApplicationPaidInvoiceTaxListView;
