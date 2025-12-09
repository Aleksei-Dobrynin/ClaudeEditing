import { FC, useEffect } from 'react';
import {
  Checkbox,
  Container
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import CustomerPopupForm from './../CustomerAddEditView/popupForm';
import PageGridPagination from "components/PageGridPagination";

type CustomerListViewProps = {};


const CustomerListView: FC<CustomerListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadCustomers()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'pin',
      headerName: translate("label:CustomerListView.pin"),
      flex: 1
    },
    {
      field: 'is_organization',
      headerName: translate("label:CustomerListView.is_organization"),
      flex: 1,
      renderCell: param => {
        return <Checkbox checked={param.row.is_organization} disabled />
      }
    },
    {
      field: 'full_name',
      headerName: translate("label:CustomerListView.full_name"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGridPagination
        title={translate("label:CustomerListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomer(id)}
        columns={columns}
        page={store.pageNumber}
        pageSize={store.pageSize}
        changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        changeSort={(sortModel) => store.changeSort(sortModel)}
        searchText=''
        totalCount={store.totalCount}
        data={store.data}
        tableName="Customer" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:CustomerListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomer(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="Customer" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <CustomerPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadCustomers()
        }}
      />

    </Container>
  );
})




export default CustomerListView
