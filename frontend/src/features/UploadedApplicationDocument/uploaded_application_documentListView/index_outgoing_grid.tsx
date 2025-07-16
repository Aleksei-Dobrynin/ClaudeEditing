import { FC, useEffect, useState } from 'react';
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import dayjs from 'dayjs';
import AttachFromOldDocuments from '../AttachFromOldDocuments';
import FileViewer from "../../../components/FileViewer";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import A4Preview from "./A4Preview";

type Outgoing_uploaded_application_documentListViewProps = {
  idMain: number;
  hideGrid?: boolean; // Optional prop to hide the grid
};


const Outgoing_Uploaded_application_documentListGridView: FC<Outgoing_uploaded_application_documentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    if (props.hideGrid) return;
    store.loaduploaded_application_documents()
    return () => store.clearStore()
  }, [props.idMain])

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'upload_id',
      flex: 1,
      headerName: translate("ЭЦП"),
      renderCell: (param) => {
        return <div>
          <Tooltip title={translate("Подписать")}>
            <IconButton disabled={!param.row.file_id} size='small' onClick={() => store.signApplicationPayment(param.row.file_id, 0, () => { })}>
              <AssignmentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={translate("Подписавшие")}>
            <IconButton disabled={!param.row.file_id} size='small' onClick={() => {
              store.ecpListOpen = true;
              store.loadGetSignByFileId(param.row.file_id)
            }}>
              <ChecklistIcon />
            </IconButton>
          </Tooltip>
        </div>
      },
    },
    // {
    //   field: 'document_number',
    //   headerName: translate("label:uploaded_application_documentListView.document_number"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_document_number"> {param.row.document_number} </div>),
    //   renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_document_number">{param.colDef.headerName}</div>)
    // },
    {
      field: 'doc_name',
      flex: 1.5,
      headerName: translate("label:uploaded_application_documentListView.doc_name"),
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_doc_name"> {param.row.doc_name} </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_doc_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'file_id',
      flex: 0.7,
      headerName: translate("label:uploaded_application_documentListView.status"),
      renderCell: (param) => {

        let title = "Загрузить";
        if (param.row.upload_id) {
          title = "Заменить";
        }

        // if (param.row.type_code == "dogovor" || param.row.type_code == "raspiska" || param.row.type_code == "invoice") {
        //   title = "Сгенерировать из шаблона";
        // }


        return <div data-testid="table_uploaded_application_document_column_file_name">
          <Tooltip title={title}>
            <IconButton
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              size='small'
              onClick={(e) => {
                // if (param.row.type_code == "dogovor" || param.row.type_code == "raspiska" || param.row.type_code == "invoice") {
                //   store.currentTemplateCode = param.row.type_code;
                //   handleClick(e);
                // } else {
                  store.uploadFile(param.row.id, param.row.upload_id);
                // }
              }}>
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
    // {
    //   field: 'upload_id',
    //   headerName: translate("label:uploaded_application_documentListView.accept"),
    //   flex: 1,
    //   renderCell: (param) => {
    //     return <div data-testid="table_uploaded_application_document_column_upload_id">
    //       <Checkbox checked={param.row.upload_id} disabled={param.row.file_id} onChange={(e) => {
    //         if (e.target.checked) {
    //           store.acceptDocumentWithoutFile(param.row.id)
    //         } else if (param.row.upload_id) {
    //           store.rejectDocument(param.row.upload_id)
    //         }
    //       }} />
    //     </div>
    //   },
    //   renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_upload_id">{param.colDef.headerName}</div>)
    // },
    {
      field: 'file_name',
      headerName: translate("label:uploaded_application_documentListView.file_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
        {param.row.file_name}
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
      </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:uploaded_application_documentListView.created_at"),
      flex: 0.7,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ""}
        </span>
      ),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'status_name',
      headerName: translate("label:uploaded_application_documentListView.status_name"),
      flex: 0.7,
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_status_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'id',
      headerName: translate("label:uploaded_application_documentListView.lastUploads"),
      flex: 0.5,
      renderCell: (param) => {
        return <div data-testid="table_uploaded_application_document_column_file_name">
          <Tooltip title={translate("label:uploaded_application_documentListView.lastUploads")}>
            <IconButton size='small' onClick={() => store.attachClicked(param.row.app_doc_id, param.row.service_document_id, param.row.upload_id)}>
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
        </div>
      },
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  if (!props.hideGrid) {

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
  }



  return (
    <Box sx={{ mt: 4 }}>
      {component}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={async () => {
          handleClose();
          let template = "";
          if (store.currentTemplateCode == "dogovor") {
            template = "individual_agreement";
          }
          if (store.currentTemplateCode == "raspiska") {
            template = "raspiska";
          }
          if (store.currentTemplateCode == "invoice") {
            template = "invoice_for_payment";
          }


          await store.getHtmlTemplate(template, { application_id: store.idMain }, "ky")
        }}>Кыргызский</MenuItem>

        <MenuItem onClick={async (e) => {
          handleClose();
          let template = "";
          if (store.currentTemplateCode == "dogovor") {
            template = "individual_agreement";
          }
          if (store.currentTemplateCode == "raspiska") {
            template = "raspiska";
          }
          if (store.currentTemplateCode == "invoice") {
            template = "invoice_for_payment";
          }

          await store.getHtmlTemplate(template, { application_id: store.idMain }, "ru")

        }}>Русский</MenuItem>

      </Menu>

      {/* <Uploaded_application_documentPopupForm
        openPanel={store.openPanel}
        is_outgoing={true}
        step_id={store.step_id}
        application_document_id={store.idMain}
        service_document_id={store.service_document_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loaduploaded_application_documents()
          if (store.onUploadSaved) {
            store.onUploadSaved()
          }
        }}
      /> */}
      <FileViewer
        isOpen={store.isOpenFileView}
        onClose={() => { store.isOpenFileView = false }}
        fileUrl={store.fileUrl}
        fileType={store.fileType} />
      {/* <AttachFromOldDocuments
        openPanel={store.openPanelAttachFromOtherDoc}
        onBtnCancelClick={() => store.closePanelAttach()}
        onSaveClick={() => {
          store.closePanelAttach()
          store.loaduploaded_application_documents()
        }}
        idApplicationDocument={store.idDocumentAttach}
        idApplication={store.idMain}
      /> */}




      <Dialog
        open={store.docPreviewOpen}
        onClose={() => { store.docPreviewOpen = false; }}
        maxWidth="xl"
        fullWidth
      >
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={() => { store.docPreviewOpen = false; }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>

          <A4Preview htmlString={store.htmlContent} code={store.currentTemplateCode} />

        </DialogContent>
      </Dialog>

      <Dialog
        open={store.ecpListOpen}
        onClose={() => { store.ecpListOpen = false; }}
        maxWidth="md"
        fullWidth
      >
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={() => { store.ecpListOpen = false; }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{ justifyItems: 'center' }}>
          <h3>Список подписавших документ</h3>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      ФИО
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Отдел
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Дата подписания
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {store.signData.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                    >
                      <td className="px-4 py-4 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-900">
                          {row.employee_fullname || 'Не указано'}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <span className="text-sm text-gray-700">
                          {row.structure_fullname || 'Не указано'}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <span className="text-sm font-mono text-gray-800">
                          {formatDateTime(row.timestamp)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          </div>

        </DialogContent>
      </Dialog>
    </Box >
  );
})



export default Outgoing_Uploaded_application_documentListGridView
