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
import ApplicationFilterTypePopupForm from './../ApplicationFilterTypeAddEditView/popupForm';

type ApplicationFilterTypeListViewProps = {};


const ApplicationFilterTypeListView: FC<ApplicationFilterTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationFilterTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ApplicationFilterTypeListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:ApplicationFilterTypeListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ApplicationFilterTypeListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationFilterTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationFilterType(id)}
        columns={columns}
        data={store.data}
        tableName="FilterTypeApplication" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationFilterTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationFilterType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="FilterTypeApplication" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationFilterTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationFilterTypes()
        }}
      />

    </Container>
  );
})




export default ApplicationFilterTypeListView
