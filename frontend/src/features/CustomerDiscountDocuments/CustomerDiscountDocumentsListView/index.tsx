import { FC, useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import CustomerDiscountDocumentsPopupForm from './../CustomerDiscountDocumentsAddEditView/popupForm';
import dayjs from "dayjs";

type CustomerDiscountDocumentsListViewProps = {
  idCustomer: number;
};


const CustomerDiscountDocumentsListView: FC<CustomerDiscountDocumentsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.customer_id = props.idCustomer;
    store.loadCustomerDiscountDocumentss()
    return () => {
      store.clearStore()
    }
  }, [props.idCustomer])

  const columns: GridColDef[] = [
    {
      field: 'file_name',
      headerName: translate("label:CustomerDiscountDocumentsListView.file_name"),
      flex: 1
    },
    {
      field: 'discount_document_name',
      headerName: translate("label:CustomerDiscountDocumentsListView.discount_document_name"),
      flex: 1
    },
    {
      field: 'discount',
      headerName: translate("label:CustomerDiscountDocumentsListView.discount"),
      flex: 1
    },
    {
      field: 'discount_type_name',
      headerName: translate("label:CustomerDiscountDocumentsListView.discount_type_name"),
      flex: 1
    },
    {
      field: 'start_date',
      headerName: translate("label:CustomerDiscountDocumentsListView.start_date"),
      flex: 1,
      renderCell: (params) => (
        <span>
            {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
          </span>
      )
    },
    {
      field: 'end_date',
      headerName: translate("label:CustomerDiscountDocumentsListView.end_date"),
      flex: 1,
      renderCell: (params) => (
        <span>
            {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
          </span>
      )
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:CustomerDiscountDocumentsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomerDiscountDocuments(id)}
        columns={columns}
        data={store.data}
        tableName="CustomerDiscountDocuments" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:CustomerDiscountDocumentsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomerDiscountDocuments(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="CustomerDiscountDocuments" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <CustomerDiscountDocumentsPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idCustomer={store.customer_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadCustomerDiscountDocumentss()
        }}
      />

    </Container>
  );
})




export default CustomerDiscountDocumentsListView
