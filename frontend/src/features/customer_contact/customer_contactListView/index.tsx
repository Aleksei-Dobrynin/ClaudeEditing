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
import Customer_contactPopupForm from './../customer_contactAddEditView/popupForm'
import styled from 'styled-components';


type customer_contactListViewProps = {
  idMain: number;
};


const customer_contactListView: FC<customer_contactListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadcustomer_contacts()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'value',
      headerName: translate("label:customer_contactListView.value"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_customer_contact_column_value"> {param.row.value} </div>),
      renderHeader: (param) => (<div data-testid="table_customer_contact_header_value">{param.colDef.headerName}</div>)
    },
    {
      field: 'type_id',
      headerName: translate("label:customer_contactListView.type_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_customer_contact_column_type_id"> {param.row.type_id} </div>),
      renderHeader: (param) => (<div data-testid="table_customer_contact_header_type_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'allow_notification',
      headerName: translate("label:customer_contactListView.allow_notification"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_customer_contact_column_allow_notification"> {param.row.allow_notification} </div>),
      renderHeader: (param) => (<div data-testid="table_customer_contact_header_allow_notification">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:customer_contactListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletecustomer_contact(id)}
        columns={columns}
        data={store.data}
        tableName="customer_contact" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:customer_contactListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletecustomer_contact(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="customer_contact" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Customer_contactPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadcustomer_contacts()
        }}
      />

    </Container>
  );
})



export default customer_contactListView
