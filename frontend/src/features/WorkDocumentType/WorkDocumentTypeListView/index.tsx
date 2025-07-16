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
import WorkDocumentTypePopupForm from '../WorkDocumentTypeAddEditView/popupForm';

type WorkDocumentTypeListViewProps = {};

const WorkDocumentTypeListView: FC<WorkDocumentTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadWorkDocumentTypes()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:WorkDocumentTypeListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:WorkDocumentTypeListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:WorkDocumentTypeListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:WorkDocumentTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteWorkDocumentType(id)}
        columns={columns}
        data={store.data}
        tableName="WorkDocumentType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:WorkDocumentTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteWorkDocumentType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="WorkDocumentType" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <WorkDocumentTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadWorkDocumentTypes()
        }}
      />

    </Container>
  );
})




export default WorkDocumentTypeListView
