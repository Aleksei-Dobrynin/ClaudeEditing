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
import InvoiceStatusPopupForm from '../InvoiceStatusAddEditView/popupForm';

type InvoiceStatusListViewProps = {};

const InvoiceStatusListView: FC<InvoiceStatusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadInvoiceStatuss()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:InvoiceStatusListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:InvoiceStatusListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:InvoiceStatusListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:InvoiceStatusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteInvoiceStatus(id)}
        columns={columns}
        data={store.data}
        tableName="InvoiceStatus" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:InvoiceStatusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteInvoiceStatus(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="InvoiceStatus" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <InvoiceStatusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadInvoiceStatuss()
        }}
      />

    </Container>
  );
})




export default InvoiceStatusListView
