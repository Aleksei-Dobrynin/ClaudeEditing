import React, { FC, useEffect } from "react";
import {
  Box,
  Container, IconButton, Tooltip
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import ApplicationWorkDocumentPopupForm from "./../ApplicationWorkDocumentAddEditView/popupForm";
import DownloadIcon from "@mui/icons-material/Download";
import CustomButton from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import StructureTemplatesPopupForm from './popupStructureTemplatesForm'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import LayoutStore from 'layouts/MainLayout/store'
import CustomTextField from "components/TextField";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FileViewer from "../../../components/FileViewer";

type ApplicationWorkDocumentListViewProps = {
  idTask?: number;
  idApplication?: number;
  fromTasks?: boolean;
};


const ApplicationWorkDocumentListView: FC<ApplicationWorkDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  useEffect(() => {
    if (store.idTask !== props.idTask) {
      store.idTask = props.idTask;
    }
    if (store.idApplication !== props.idApplication) {
      store.idApplication = props.idApplication;
    }
    store.loadApplicationWorkDocuments();
    return () => store.clearStore();
  }, [props.idTask, props.idApplication]);


  let columns: GridColDef[];
  if (props.fromTasks) {
    columns = [
      {
        field: "id",
        headerName: translate("delete"),
        flex: 1,
        renderCell: (param) => (<div data-testid="table_ApplicationWorkDocument_column_file_name">
          <Tooltip title={translate('delete')}>
            <IconButton
              disabled={param.row.created_by !== LayoutStore.user_id}
              onClick={() => store.changePanelDelete(true, param.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>),
      },
      {
        field: "file_name",
        headerName: translate("label:ApplicationWorkDocumentListView.file_name"),
        flex: 2,
        renderCell: (param) => (<div data-testid="table_ApplicationWorkDocument_column_file_name">
          {param.row.file_id && <Tooltip title={translate("downloadFile")}>
            <IconButton size="small" onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
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
        renderHeader: (param) => (
          <div data-testid="table_ApplicationWorkDocument_header_file_name">{param.colDef.headerName}</div>)
      },
      {
        field: "comment",
        headerName: translate("label:ApplicationWorkDocumentListView.comment"),
        flex: 1
      },
      {
        field: "employee_name",
        headerName: translate("label:ApplicationWorkDocumentListView.employee_name"),
        flex: 1
      }
    ];
  } else {
    columns = [
      {
        field: "file_name",
        headerName: translate("label:ApplicationWorkDocumentListView.file_name"),
        flex: 2,
        renderCell: (param) => (<div data-testid="table_ApplicationWorkDocument_column_file_name">
          {param.row.file_id && <Tooltip title={translate("downloadFile")}>
            <IconButton size="small" onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
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
        renderHeader: (param) => (
          <div data-testid="table_ApplicationWorkDocument_header_file_name">{param.colDef.headerName}</div>)
      },
      {
        field: "comment",
        headerName: translate("label:ApplicationWorkDocumentListView.comment"),
        flex: 1
      },
      {
        field: "task_name",
        headerName: translate("label:ApplicationWorkDocumentListView.to_task"),
        flex: 1,
        renderCell: (param) => (
          <CustomButton
            variant='contained'
            size="small"
            onClick={() => navigate(`/user/Application_Task/addedit?id=${param.row.task_id}`)}
          >
            {`${translate("label:ApplicationWorkDocumentListView.go_to")} "${param.value}"`}
          </CustomButton>)
      },
      {
        field: "employee_name",
        headerName: translate("label:ApplicationWorkDocumentListView.employee_name"),
        flex: 1
      }
    ];
  }

  let type1: string = "popup";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGrid
        title={translate("label:ApplicationWorkDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationWorkDocument(id)}
        columns={columns}
        data={store.data}
        tableName="ApplicationWorkDocument"
        pageSize={25} />;
      break;
    case "popup":
      component = <PopupGrid
        title={translate("label:ApplicationWorkDocumentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteApplicationWorkDocument(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        hideActions={true}
        hideAddButton={!props.fromTasks}
        tableName="ApplicationWorkDocument"
        customBottom={props.fromTasks && <CustomButton
          variant='contained'
          sx={{ ml: 1, mb: 1 }}
          id={`addFromTemplate`}
          onClick={() => { store.isOpenTemplatePanel = true }}
          endIcon={<AddIcon />}
        >
          {translate('label:ApplicationWorkDocumentListView.addFromTemplate')}
        </CustomButton>}
        pageSize={25} />;
      break;
  }


  return (
    <>
      {component}
      <ApplicationWorkDocumentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idMain={store.idTask}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadApplicationWorkDocuments();
        }}
      />
      <StructureTemplatesPopupForm
        openPanel={store.isOpenTemplatePanel}
        id={store.currentId}
        idMain={store.idTask}
        onBtnCancelClick={() => store.closeTemplatePanel()}
        onSaveClick={() => {
          store.closeTemplatePanel();
          store.loadApplicationWorkDocuments();
        }}
      />
      <FileViewer
        isOpen={store.isOpenFileView}
        onClose={() => {store.isOpenFileView = false}}
        fileUrl={store.fileUrl}
        fileType={store.fileType} />
      <Dialog open={store.openPanelDelete} onClose={() => store.changePanelDelete(false, 0)} maxWidth="sm" fullWidth>
        <DialogTitle>{translate('Удаление документа')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <CustomTextField
              value={store.deleteReason}
              onChange={(event) => store.handleChange(event)}
              name="deleteReason"
              multiline
              rows={4}
              id="deleteReason"
              label={translate("Причина удаления")}
              helperText={""}
              error={false}
            />
          </Box>

        </DialogContent>
        <DialogActions>
          <DialogActions>
            <CustomButton
              variant="contained"
              id="id_ApplicationWorkDocumentDeleteButton"
              name={'ApplicationWorkDocumentAddEditView.save'}
              onClick={() => {
                store.deleteApplicationWorkDocument(store.currentId)
              }}
            >
              {translate("common:delete")}
            </CustomButton>
            <CustomButton
              variant="contained"
              id="id_ApplicationWorkDocumentCancelButton"
              color={"secondary"}
              sx={{ color: "white", backgroundColor: "#DE350B !important" }}
              name={'ApplicationWorkDocumentAddEditView.cancel'}
              onClick={() => store.changePanelDelete(false, 0)}
            >
              {translate("common:cancel")}
            </CustomButton>
          </DialogActions>
        </DialogActions >
      </Dialog >
    </>
  );
});


export default ApplicationWorkDocumentListView;
