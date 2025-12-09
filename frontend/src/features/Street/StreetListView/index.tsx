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
import StreetPopupForm from './../StreetAddEditView/popupForm';
import PageGridPagination from "components/PageGridPagination";

type StreetListViewProps = {};

const StreetListView: FC<StreetListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadStreets()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: translate("label:StreetListView.code"),
      flex: 1
    },
    {
      field: 'name',
      headerName: translate("label:StreetListView.name"),
      flex: 2
    },
    {
      field: 'name_kg',
      headerName: translate("label:StreetListView.name_kg"),
      flex: 2
    },
    {
      field: 'type_name',
      headerName: translate("label:StreetListView.type_id"),
      flex: 2,
      // valueGetter: (params) => params.row.type?.name || ''
    },
    {
      field: 'expired',
      headerName: translate("label:StreetListView.expired"),
      flex: 1,
      renderCell: param => {
        return param.row.expired ?
          <Chip label={translate("label:StreetListView.expired_yes")} color="error" size="small" /> :
          <Chip label={translate("label:StreetListView.expired_no")} color="success" size="small" />
      }
    },
    {
      field: 'address_unit_name',
      headerName: translate("label:StreetListView.address_unit_name"),
      flex: 2
    },
    // {
    //   field: 'description',
    //   headerName: translate("label:StreetListView.description"),
    //   flex: 2
    // },
    // {
    //   field: 'description_kg',
    //   headerName: translate("label:StreetListView.description_kg"),
    //   flex: 2
    // },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:StreetListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStreet(id)}
        columns={columns}
        // page={store.pageNumber}
        pageSize={store.pageSize}
        // changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        // changeSort={(sortModel) => store.changeSort(sortModel)}
        // searchText=''
        // totalCount={store.totalCount}
        data={store.data}
        tableName="Street" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:StreetListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStreet(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="Street" />
      break
  }

  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <StreetPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadStreets()
        }}
      />

    </Container>
  );
})

export default StreetListView