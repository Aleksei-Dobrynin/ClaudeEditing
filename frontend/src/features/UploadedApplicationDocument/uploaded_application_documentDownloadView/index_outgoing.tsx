import { FC, useEffect } from 'react';
import {
  Box,
  Checkbox,
  Chip,
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
import Uploaded_application_documentPopupForm from '../uploaded_application_documentAddEditView/popupForm'
import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import dayjs from 'dayjs';
import AttachFromOldDocuments from '../AttachFromOldDocuments';

type Outgoing_uploaded_application_documentListViewProps = {
  idMain: number;
};


const Outgoing_Uploaded_application_documentListView: FC<Outgoing_uploaded_application_documentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loaduploaded_application_documents()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    {
      field: 'document_number',
      headerName: translate("label:uploaded_application_documentListView.document_number"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_document_number"> {param.row.document_number} </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_document_number">{param.colDef.headerName}</div>)
    },
    {
      field: 'doc_name',
      headerName: translate("label:uploaded_application_documentListView.doc_name"),
      flex: 4,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_doc_name"> {param.row.doc_name} </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_doc_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'file_id',
      headerName: translate("label:uploaded_application_documentListView.status"),
      flex: 1,
      renderCell: (param) => {

        return <div data-testid="table_uploaded_application_document_column_file_name">
          <Tooltip title={param.row.upload_id ? "Заменить" : "Загрузить"}>
            <IconButton size='small' onClick={() => store.uploadFile(param.row.id, param.row.upload_id)}>
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          <Chip
            label={param.row.upload_id ? (param.row.file_id ? 'Загружен' : "Принят") : "Не загружен"}
            size="small"
            color={param.row.upload_id ? (param.row.file_id ? 'success' : "info") : "error"}
          />
        </div>
      },
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'upload_id',
      headerName: translate("label:uploaded_application_documentListView.accept"),
      flex: 1,
      renderCell: (param) => {
        return <div data-testid="table_uploaded_application_document_column_upload_id">
          <Checkbox checked={param.row.upload_id} disabled={param.row.file_id} onChange={(e) => {
            if (e.target.checked) {
              store.acceptDocumentWithoutFile(param.row.id)
            } else if (param.row.upload_id) {
              store.rejectDocument(param.row.upload_id)
            }
          }} />
        </div>
      },
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_upload_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'file_name',
      headerName: translate("label:uploaded_application_documentListView.file_name"),
      flex: 2,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
        {param.row.file_name}
        {param.row.file_id && <Tooltip title={"Скачать"}>
          <IconButton size='small' onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>}
      </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:uploaded_application_documentListView.created_at"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ""}
        </span>
      ),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'id',
      headerName: translate("label:uploaded_application_documentListView.lastUploads"),
      flex: 1,
      renderCell: (param) => {
        return <div data-testid="table_uploaded_application_document_column_file_name">
          <Tooltip title={translate("label:uploaded_application_documentListView.lastUploads")}>
            <IconButton size='small' onClick={() => store.attachClicked(param.row.app_doc_id)}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
        </div>
      },
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:uploaded_application_documentListView.outgoing_entityTitle")}
        onDeleteClicked={(id: number) => store.deleteuploaded_application_document(id)}
        columns={columns}
        data={store.outgoingData}
        tableName="uploaded_application_document"
        pageSize={25} />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:uploaded_application_documentListView.outgoing_entityTitle")}
        onDeleteClicked={(id: number) => store.deleteuploaded_application_document(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        hideAddButton
        hideActions
        data={store.outgoingData}
        tableName="uploaded_application_document"
        pageSize={25} />
      break
  }


  return (
    <Box sx={{ mt: 4 }}>
      {component}

      <Uploaded_application_documentPopupForm
        openPanel={store.openPanel}
        application_document_id={store.idMain}
        service_document_id={store.service_document_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loaduploaded_application_documents()
        }}
      />

      <AttachFromOldDocuments
        openPanel={store.openPanelAttachFromOtherDoc}
        onBtnCancelClick={() => store.closePanelAttach()}
        onSaveClick={() => {
          store.closePanelAttach()
          store.loaduploaded_application_documents()
        }}
        idApplicationDocument={store.idDocumentAttach}
        idApplication={store.idMain}
      />

    </Box>
  );
})



export default Outgoing_Uploaded_application_documentListView
