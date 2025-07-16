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
import ApplicationDocumentTypePopupForm from './../ApplicationDocumentTypeAddEditView/popupForm';

type ApplicationDocumentTypeListViewProps = {};


const ApplicationDocumentTypeListView: FC<ApplicationDocumentTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationDocumentTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ApplicationDocumentTypeListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:ApplicationDocumentTypeListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ApplicationDocumentTypeListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationDocumentTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationDocumentType(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationDocumentType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationDocumentTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationDocumentType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationDocumentType" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationDocumentTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationDocumentTypes()
        }}
      />

    </Container>
  );
})




export default ApplicationDocumentTypeListView
