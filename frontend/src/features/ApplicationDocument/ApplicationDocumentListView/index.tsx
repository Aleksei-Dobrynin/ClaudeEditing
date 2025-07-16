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
import ApplicationDocumentPopupForm from './../ApplicationDocumentAddEditView/popupForm';

type ApplicationDocumentListViewProps = {};


const ApplicationDocumentListView: FC<ApplicationDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadApplicationDocuments()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ApplicationDocumentListView.name"),
      flex: 1
    },
    {
      field: 'document_type_name',
      headerName: translate("label:ApplicationDocumentListView.document_type_name"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ApplicationDocumentListView.description"),
      flex: 1
    },
    {
      field: 'law_description',
      headerName: translate("label:ApplicationDocumentListView.law_description"),
      flex: 1
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:ApplicationDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationDocument(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationDocument" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:ApplicationDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationDocument(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationDocument" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <ApplicationDocumentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadApplicationDocuments()
        }}
      />

    </Container>
  );
})




export default ApplicationDocumentListView
