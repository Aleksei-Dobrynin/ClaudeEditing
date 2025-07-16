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
import QueryFiltersPopupForm from './../QueryFiltersAddEditView/popupForm';

type QueryFiltersListViewProps = {};

const QueryFiltersListView: FC<QueryFiltersListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadQueryFilterss()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:QueryFiltersListView.name"),
      flex: 1
    },
    {
      field: 'name_kg',
      headerName: translate("label:QueryFiltersListView.name_kg"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:QueryFiltersListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:QueryFiltersListView.description"),
      flex: 1
    },
    {
      field: 'target_table',
      headerName: translate("label:QueryFiltersListView.target_table"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:QueryFiltersListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteQueryFilters(id)}
        columns={columns}
        data={store.data}
        tableName="QueryFilters" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:QueryFiltersListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteQueryFilters(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="QueryFilters" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <QueryFiltersPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadQueryFilterss()
        }}
      />

    </Container>
  );
})




export default QueryFiltersListView
