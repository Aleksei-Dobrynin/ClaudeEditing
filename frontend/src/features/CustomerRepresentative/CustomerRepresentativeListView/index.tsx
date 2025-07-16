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
import CustomerRepresentativePopupForm from './../CustomerRepresentativeAddEditView/popupForm';

type CustomerRepresentativeListViewProps = {};


const CustomerRepresentativeListView: FC<CustomerRepresentativeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadCustomerRepresentatives()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'last_name',
      headerName: translate("label:CustomerRepresentativeListView.last_name"),
      flex: 1
    },
    {
      field: 'first_name',
      headerName: translate("label:CustomerRepresentativeListView.first_name"),
      flex: 1
    },
    {
      field: 'second_name',
      headerName: translate("label:CustomerRepresentativeListView.second_name"),
      flex: 1
    },
    {
      field: 'pin',
      headerName: translate("label:CustomerRepresentativeListView.pin"),
      flex: 1
    },
    {
      field: 'date_start',
      headerName: translate("label:CustomerRepresentativeListView.date_start"),
      flex: 1
    },
    {
      field: 'date_end',
      headerName: translate("label:CustomerRepresentativeListView.date_end"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:CustomerRepresentativeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomerRepresentative(id)}
        columns={columns}
        data={store.data}
        tableName="CustomerRepresentative" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:CustomerRepresentativeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomerRepresentative(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="CustomerRepresentative" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <CustomerRepresentativePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadCustomerRepresentatives()
        }}
      />

    </Container>
  );
})




export default CustomerRepresentativeListView
