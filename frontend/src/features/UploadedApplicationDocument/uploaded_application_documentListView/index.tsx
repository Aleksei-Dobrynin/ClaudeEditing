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
import UploadDocumentModal from '../uploaded_application_documentAddEditView/UploadDocumentModal'
import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import dayjs from 'dayjs';
import AttachFromOldDocuments from '../AttachFromOldDocuments';
import CustomButton from 'components/Button';
import Uploaded_application_documentCreatePopupForm from '../create_new_document/popupForm';
import FileViewer from "components/FileViewer";

type uploaded_application_documentListViewProps = {
  idMain: number;
  fromTasks?: boolean;
  hideAddButton?: boolean;
};


const Uploaded_application_documentListView: FC<uploaded_application_documentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loaduploaded_application_documents()
    return () => store.clearStore()
  }, [props.idMain])


  let columns: GridColDef[] = [
    // {
    //   field: 'document_number',
    //   headerName: translate("label:uploaded_application_documentListView.document_number"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_document_number"> {param.row.document_number} </div>),
    //   renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_document_number">{param.colDef.headerName}</div>)
    // },
    {
      field: 'doc_name',
      headerName: translate("label:uploaded_application_documentListView.doc_name"),
      flex: 4,
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_doc_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'file_id',
      headerName: translate("label:uploaded_application_documentListView.status"),
      flex: 1,
      renderCell: (param) => {

        return param.row.type_name != "cabinet document" ? <div data-testid="table_uploaded_application_document_column_file_name">
          <Tooltip title={param.row.upload_id ? "Заменить" : "Загрузить"}>
            <IconButton disabled={props.fromTasks} size='small' onClick={() => store.uploadFile(param.row.id, param.row.upload_id)}>
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          <Chip
            label={param.row.upload_id ? (param.row.file_id ? 'Загружен' : "Принят") : "Не загружен"}
            size="small"
            color={param.row.upload_id ? (param.row.file_id ? 'success' : "info") : "error"}
          />
        </div> : <div></div>
      },
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'upload_id',
      headerName: translate("label:uploaded_application_documentListView.accept"),
      flex: 1,
      renderCell: (param) => {
        return param.row.type_name != "cabinet document" ? <div data-testid="table_uploaded_application_document_column_upload_id">
          <Checkbox checked={param.row.upload_id} disabled={param.row.file_id} onChange={(e) => {
            if (e.target.checked) {
              store.acceptDocumentWithoutFile(param.row.id)
            } else if (param.row.upload_id) {
              store.rejectDocument(param.row.upload_id)
            }
          }} />
        </div> : <div></div>
      },
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_upload_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'file_name',
      headerName: translate("label:uploaded_application_documentListView.file_name"),
      flex: 2,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
        {param.row.file_id && <Tooltip title={"Скачать"}>
          <IconButton size='small' onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>}
        {(param.row.file_id && store.checkFile(param.row.file_name)) && <Tooltip title={translate("view")}>
          <IconButton size='small' onClick={() => store.OpenFileFile(param.row.file_id, param.row.file_name)}>
            <RemoveRedEyeIcon />
          </IconButton>
        </Tooltip>}
        {param.row.file_name}
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
        return param.row.type_name != "cabinet document" ? <div data-testid="table_uploaded_application_document_column_file_name">
          <Tooltip title={translate("label:uploaded_application_documentListView.lastUploads")}>
            <IconButton size='small' onClick={() => store.attachClicked(param.row.app_doc_id, param.row.service_document_id, param.row.upload_id)}>
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
        </div> : <div></div>
      },
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
  ];
  if (props.fromTasks) {
    columns = [
      {
        field: 'doc_name',
        headerName: translate("label:uploaded_application_documentListView.doc_name"),
        flex: 1,
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
        field: 'file_name',
        headerName: translate("label:uploaded_application_documentListView.file_name"),
        flex: 2,
        renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
          {param.row.file_id && <Tooltip title={"Скачать"}>
            <IconButton size='small' onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>}
          {(param.row.file_id && store.checkFile(param.row.file_name)) && <Tooltip title={translate("view")}>
            <IconButton size='small' onClick={() => store.OpenFileFile(param.row.file_id, param.row.file_name)}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>}
          {param.row.file_name}
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
    ]
  }

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        onDeleteClicked={(id: number) => store.deleteuploaded_application_document(id)}
        columns={columns}
        data={store.incomingData}
        tableName="uploaded_application_document"
        pageSize={25} />
      break
    case 'popup':
      component = <PopupGrid
        onDeleteClicked={(id: number) => store.deleteuploaded_application_document(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        hideAddButton
        hideTitle
        customBottom={
          <Box display={"flex"} alignItems={"center"}>
            <h1 data-testid={`uploaded_application_documentHeaderTitle`}>
              {translate("label:uploaded_application_documentListView.incoming_entityTitle")}
            </h1>
            {props.hideAddButton != true && <CustomButton disabled={props.fromTasks} sx={{ ml: 2 }} onClick={() => store.onEditNewClicked(0)} variant='contained' size="small" >{translate("common:addDocument")}</CustomButton>}
          </Box>}
        hideActions
        data={store.incomingData}
        tableName="uploaded_application_document"
        pageSize={25} />
      break
  }


  return (
    <Box sx={{ mt: 4 }}>
      {component}

      <UploadDocumentModal
        openPanel={store.openPanel}
        application_document_id={store.idMain}
        service_document_id={store.service_document_id}
        step_id={store.step_id}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loaduploaded_application_documents()
          if (store.onUploadSaved) {
            store.onUploadSaved()
          }
        }}
      />

      <Uploaded_application_documentCreatePopupForm
        openPanel={store.openPanelNew}
        application_id={store.idMain}
        id={store.currentId}
        onBtnCancelClick={() => store.closeNewPanel()}
        onSaveClick={() => {
          store.closeNewPanel()
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
        service_document_id={store.service_document_id}
        uploadedId={store.uploadedDocId}
        idApplication={store.idMain}
      />
      <FileViewer
        isOpen={store.isOpenFileView}
        onClose={() => { store.isOpenFileView = false }}
        fileUrl={store.fileUrl}
        fileType={store.fileType} />
    </Box>
  );
})



export default Uploaded_application_documentListView
