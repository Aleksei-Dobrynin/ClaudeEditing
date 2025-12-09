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
import StreetTypePopupForm from '../StreetTypeAddEditView/popupForm';
import PageGridPagination from "components/PageGridPagination";

type StreetTypeListViewProps = {};

const StreetTypeListView: FC<StreetTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadStreetTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: translate("label:StreetTypeListView.code"),
      flex: 1
    },
    {
      field: 'name',
      headerName: translate("label:StreetTypeListView.name"),
      flex: 2
    },
    {
      field: 'name_kg',
      headerName: translate("label:StreetTypeListView.name_kg"),
      flex: 2
    },
    {
      field: 'description',
      headerName: translate("label:StreetTypeListView.description"),
      flex: 2
    },
    {
      field: 'description_kg',
      headerName: translate("label:StreetTypeListView.description_kg"),
      flex: 2
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGridPagination
        title={translate("label:StreetTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStreetType(id)}
        columns={columns}
        page={store.pageNumber}
        pageSize={store.pageSize}
        changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
        changeSort={(sortModel) => store.changeSort(sortModel)}
        searchText=''
        totalCount={store.totalCount}
        data={store.data}
        tableName="StreetType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:StreetTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteStreetType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="StreetType" />
      break
  }

  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <StreetTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadStreetTypes()
        }}
      />

    </Container>
  );
})

export default StreetTypeListView