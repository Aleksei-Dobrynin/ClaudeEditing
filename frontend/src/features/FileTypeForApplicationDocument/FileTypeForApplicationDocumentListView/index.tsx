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
import FileTypeForApplicationDocumentPopupForm from './../FileTypeForApplicationDocumentAddEditView/popupForm';

type FileTypeForApplicationDocumentListViewProps = {};


const FileTypeForApplicationDocumentListView: FC<FileTypeForApplicationDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadFileTypeForApplicationDocuments()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:FileTypeForApplicationDocumentListView.name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:FileTypeForApplicationDocumentListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:FileTypeForApplicationDocumentListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:FileTypeForApplicationDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteFileTypeForApplicationDocument(id)}
        columns={columns}
        data={store.data}
        tableName="FileTypeForApplicationDocument" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:FileTypeForApplicationDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteFileTypeForApplicationDocument(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="FileTypeForApplicationDocument" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <FileTypeForApplicationDocumentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadFileTypeForApplicationDocuments()
        }}
      />

    </Container>
  );
})




export default FileTypeForApplicationDocumentListView
