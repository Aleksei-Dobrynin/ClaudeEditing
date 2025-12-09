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
import ApplicationInvoicePopupForm from '../ApplicationInvoiceAddEditView/popupForm';

type ApplicationInvoiceListViewProps = {};

const ApplicationInvoiceListView: FC<ApplicationInvoiceListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationInvoices()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ApplicationInvoiceListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:ApplicationInvoiceListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ApplicationInvoiceListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationInvoiceListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationInvoice(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationInvoice" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationInvoiceListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationInvoice(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationInvoice" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationInvoicePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationInvoices()
        }}
      />

    </Container>
  );
})




export default ApplicationInvoiceListView
