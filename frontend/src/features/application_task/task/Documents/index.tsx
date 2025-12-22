import React, { FC, useEffect } from "react";
import { default as ApplicationStepsBaseView } from './base';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Dialog, DialogActions, DialogContent, IconButton, Tooltip, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react";
import store from "./store";
import CustomButton from 'components/Button';
import Outgoing_Uploaded_application_documentListView
  from "features/UploadedApplicationDocument/uploaded_application_documentListView/index_outgoing";
import UploadDocumentModal from 'features/UploadedApplicationDocument/uploaded_application_documentAddEditView/UploadDocumentModal'
import FileViewer from "components/FileViewer";
import CloseIcon from '@mui/icons-material/Close';
import i18n from "i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

type ApplicationStepsProps = {
  appId: number;
  service_id: number;
  hasAccess: boolean;
  expandedStepId: number;
  taskId: number;
  onPaymentDialogOpen?: () => void;
  accessPaymentDialog?: boolean;
};

const ApplicationStepsView: FC<ApplicationStepsProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    store.application_id = props.appId;
    store.loadApplication(props.appId);
    return () => {
      store.clearStore();
    };
  }, [props.appId]);

  useEffect(() => {
    store.hasAccess = props.hasAccess;
  }, [props.hasAccess]);

  useEffect(() => {
    store.expandedStepIds = [props.expandedStepId];
    // store.expandedStepId = props.expandedStepId
  }, [props.expandedStepId]);

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


  const handleBack = () => {
    navigate('/user/applications');
  };

  // const handleRefresh = () => {
  //   if (applicationId && !isNaN(Number(applicationId))) {
  //     store.loadApplication(Number(applicationId));
  //   } else {
  //     store.loadApplication(1001);
  //   }
  // };

  return (
    <>
      <ApplicationStepsBaseView
        taskId={props.taskId}
        service_id={props.service_id}
        onPaymentDialogOpen={props.onPaymentDialogOpen}
        accessPaymentDialog={props.accessPaymentDialog}
      />

      <UploadDocumentModal
        openPanel={store.openPanelUpload}
        is_outgoing={true}
        step_id={store.currentStepId}
        application_document_id={props.appId}
        service_document_id={store.currentServiceDocId}
        onBtnCancelClick={() => store.closeUploadFilePopup()}
        onSaveClick={() => {
          store.closeUploadFilePopup()
          store.loadApplication(store.application_id)
        }}
      />

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
          <h3>Список подписаших документ</h3>
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

      <Dialog
        open={store.isOpenFileHistory}
        onClose={() => { store.isOpenFileHistory = false; }}
        maxWidth="md"
        fullWidth
      >
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={() => { store.isOpenFileHistory = false; }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{ justifyItems: 'center' }}>
          <h3>{i18n.t("label:UploadedApplicationDocumentListView.document_download_history")}</h3>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {i18n.t("label:UploadedApplicationDocumentListView.view_history")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {i18n.t("label:UploadedApplicationDocumentListView.file_name_history")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {i18n.t("label:UploadedApplicationDocumentListView.created_at_history")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {i18n.t("label:UploadedApplicationDocumentListView.created_by_name_history")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {i18n.t("label:UploadedApplicationDocumentListView.delete_reason")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {i18n.t("label:UploadedApplicationDocumentListView.delete_by_name_history")}
                  </th>
                </tr>
                </thead>
                <tbody>
                {store.fileHistory?.filter(d => d.file_id != null).map((doc, index) => (
                  <tr
                    key={doc.id}
                    className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-4 border-b border-gray-200">
                      {(doc.file_id && store.checkFile(doc?.file_name)) && <Tooltip title={i18n.t("label:UploadedApplicationDocumentListView.view_history")}>
                        <IconButton size="small" onClick={() => {
                          store.OpenFileFile(doc.file_id, doc.file_name)
                        }}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>}
                      {doc.file_id && <Tooltip title="Список подписавших">
                        <IconButton size="small" onClick={() => {
                          store.ecpListOpen = true;
                          store.loadGetSignByFileId(doc.file_id)
                        }}>
                          <FormatListBulletedIcon />
                        </IconButton>
                      </Tooltip>}
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-900">
                  {doc.file_name}
                </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                <span className="text-sm font-mono text-gray-800">
                  {formatDateTime(doc.created_at)}
                </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                <span className="text-sm text-gray-700">
                  {doc.created_by_name} \ {doc.structure_name}
                </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                <span className="text-sm font-mono text-gray-800">
                  {doc.delete_reason}
                </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                <span className="text-sm text-gray-700">
                  {doc.deleted_by_name}
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

      <FileViewer
        isOpen={store.isOpenFileView}
        onClose={() => { store.isOpenFileView = false }}
        fileUrl={store.fileUrl}
        fileType={store.fileType} />

      {/* <UploadPopup /> */}

      {/* <Outgoing_Uploaded_application_documentListView idMain={props.appId} hideGrid={false} columns={1} /> */}

    </>
  );
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ApplicationStepsView;