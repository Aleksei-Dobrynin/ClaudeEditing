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
import ApplicationFilterPopupForm from './../ApplicationFilterAddEditView/popupForm';

type ApplicationFilterListViewProps = {};


const ApplicationFilterListView: FC<ApplicationFilterListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationFilters()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ApplicationFilterListView.name"),
      flex: 1
    },
    {
      field: 'post_name',
      headerName: translate("label:ApplicationFilterListView.post_id"),
      flex: 1
    },
    {
      field: 'query_name',
      headerName: translate("label:ApplicationFilterListView.query_id"),
      flex: 1
    },
    {
      field: 'type_name',
      headerName: translate("label:ApplicationFilterListView.type_id"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:ApplicationFilterListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ApplicationFilterListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationFilterListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationFilter(id)}
        columns={columns}
        data={store.data}
        tableName="FilterApplication" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationFilterListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationFilter(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="FilterApplication" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationFilterPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationFilters()
        }}
      />

    </Container>
  );
})




export default ApplicationFilterListView
