import { FC, useEffect } from 'react';
import {
  Checkbox,
  Container,
  Chip
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import AddressUnitPopupForm from './../AddressUnitAddEditView/popupForm';
import PageGridPagination from "components/PageGridPagination";

type AddressUnitListViewProps = {};

const AddressUnitListView: FC<AddressUnitListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadAddressUnits()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: translate("label:AddressUnitListView.code"),
      flex: 1
    },
    {
      field: 'name',
      headerName: translate("label:AddressUnitListView.name"),
      flex: 2
    },
    {
      field: 'name_kg',
      headerName: translate("label:AddressUnitListView.name_kg"),
      flex: 2
    },
    {
      field: 'type_name',
      headerName: translate("label:AddressUnitListView.type_id"),
      flex: 2,
      // valueGetter: (params) => params.row.type?.name || ''
    },
    {
      field: 'expired',
      headerName: translate("label:AddressUnitListView.expired"),
      flex: 1,
      renderCell: param => {
        return param.row.expired ?
          <Chip label={translate("label:AddressUnitListView.expired_yes")} color="error" size="small" /> :
          <Chip label={translate("label:AddressUnitListView.expired_no")} color="success" size="small" />
      }
    },
    {
      field: 'parent_name',
      headerName: translate("label:AddressUnitListView.parent_name"),
      flex: 2
    },
    // {
    //   field: 'description',
    //   headerName: translate("label:AddressUnitListView.description"),
    //   flex: 2
    // },
    // {
    //   field: 'description_kg',
    //   headerName: translate("label:AddressUnitListView.description_kg"),
    //   flex: 2
    // },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:AddressUnitListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteAddressUnit(id)}
        columns={columns}
        // page={store.pageNumber}
        pageSize={store.pageSize}
        // changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        // changeSort={(sortModel) => store.changeSort(sortModel)}
        // searchText=''
        // totalCount={store.totalCount}
        data={store.data}
        tableName="AddressUnit" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:AddressUnitListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteAddressUnit(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="AddressUnit" />
      break
  }

  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <AddressUnitPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadAddressUnits()
        }}
      />

    </Container>
  );
})

export default AddressUnitListView