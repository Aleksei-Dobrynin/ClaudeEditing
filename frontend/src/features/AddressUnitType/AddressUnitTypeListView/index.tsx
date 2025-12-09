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
import AddressUnitTypePopupForm from './../AddressUnitTypeAddEditView/popupForm';
import PageGridPagination from "components/PageGridPagination";

type AddressUnitTypeListViewProps = {};

const AddressUnitTypeListView: FC<AddressUnitTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadAddressUnitTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: translate("label:AddressUnitTypeListView.code"),
      flex: 1
    },
    {
      field: 'name',
      headerName: translate("label:AddressUnitTypeListView.name"),
      flex: 2
    },
    {
      field: 'name_kg',
      headerName: translate("label:AddressUnitTypeListView.name_kg"),
      flex: 2
    },
    {
      field: 'description',
      headerName: translate("label:AddressUnitTypeListView.description"),
      flex: 2
    },
    {
      field: 'description_kg',
      headerName: translate("label:AddressUnitTypeListView.description_kg"),
      flex: 2
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGridPagination
        title={translate("label:AddressUnitTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteAddressUnitType(id)}
        columns={columns}
        page={store.pageNumber}
        pageSize={store.pageSize}
        changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        changeSort={(sortModel) => store.changeSort(sortModel)}
        searchText=''
        totalCount={store.totalCount}
        data={store.data}
        tableName="AddressUnitType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:AddressUnitTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteAddressUnitType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="AddressUnitType" />
      break
  }

  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <AddressUnitTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadAddressUnitTypes()
        }}
      />

    </Container>
  );
})

export default AddressUnitTypeListView