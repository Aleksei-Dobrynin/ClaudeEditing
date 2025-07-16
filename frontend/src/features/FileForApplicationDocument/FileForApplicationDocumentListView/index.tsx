import { FC, useEffect } from 'react';
import {
  Container,
  IconButton,
  Tooltip,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import FileForApplicationDocumentPopupForm from './../FileForApplicationDocumentAddEditView/popupForm';
import DownloadIcon from '@mui/icons-material/Download';

type FileForApplicationDocumentListViewProps = {
  idDocument: number;
};


const FileForApplicationDocumentListView: FC<FileForApplicationDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idDocument !== props.idDocument) {
      store.idDocument = props.idDocument
    }
    store.loadFileForApplicationDocumentsByDocument()
    return () => store.clearStore()
  }, [props.idDocument])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:FileForApplicationDocumentListView.name"),
      flex: 1
    },
    {
      field: 'file_name',
      headerName: translate("label:FileForApplicationDocumentListView.file_name"),
      flex: 1
    },
    {
      field: 'id',
      headerName: translate("downloadFile"),
      flex: 1,
      renderCell: (param) => {
        return <div data-testid="table_Language_column_code">
          <Tooltip title={translate("downloadFile")}>
            <IconButton onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </div>
      },
    },
    {
      field: 'type_name',
      headerName: translate("label:FileForApplicationDocumentListView.type_name"),
      flex: 1
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:FileForApplicationDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteFileForApplicationDocument(id)}
        columns={columns}
        data={store.data}
        tableName="FileForApplicationDocument" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:FileForApplicationDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteFileForApplicationDocument(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="FileForApplicationDocument" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <FileForApplicationDocumentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idDocument={store.idDocument}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadFileForApplicationDocuments()
        }}
      />

    </Container>
  );
})




export default FileForApplicationDocumentListView
