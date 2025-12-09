import { FC, useEffect } from 'react';
import { Container, IconButton, Tooltip, Dialog, DialogContent, DialogActions } from '@mui/material';
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Contragent_interaction_docPopupForm from './../contragent_interaction_docAddEditView/popupForm';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CloseIcon from '@mui/icons-material/Close';

type Contragent_interaction_docListViewProps = {
  idMain: number;
};

const Contragent_interaction_docListView: FC<Contragent_interaction_docListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain;
    }
    store.loadcontragent_interaction_docs();
    
    return () => store.clearStore();
  }, [props.idMain]);

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
      field: 'ecp_actions',
      flex: 1,
      headerName: translate("ЭЦП"),
      renderCell: (param) => {
        return (
          <div>
            <Tooltip title={translate("Подписать")}>
              <IconButton 
                disabled={!param.row.file_id} 
                size='small' 
                onClick={() => store.signDocument(param.row.file_id)}
              >
                <AssignmentIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={translate("Подписавшие")}>
              <IconButton 
                disabled={!param.row.file_id} 
                size='small' 
                onClick={() => {
                  store.ecpListOpen = true;
                  store.loadGetSignByFileId(param.row.file_id);
                }}
              >
                <ChecklistIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
      renderHeader: (param) => (
        <div data-testid="table_contragent_interaction_doc_header_ecp">
          {param.colDef.headerName}
        </div>
      )
    },
    {
      field: 'file_name',
      headerName: translate("label:contragent_interaction_docListView.file_name"),
      flex: 2,
      renderCell: (param) => (
        <div data-testid="table_contragent_interaction_doc_column_file_name">
          {param.row.file_name}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_contragent_interaction_doc_header_file_name">
          {param.colDef.headerName}
        </div>
      )
    },
    {
      field: 'message',
      headerName: translate("label:contragent_interaction_docListView.message"),
      flex: 3,
      renderCell: (param) => (
        <div data-testid="table_contragent_interaction_doc_column_message">
          {param.row.message}
        </div>
      ),
      renderHeader: (param) => (
        <div data-testid="table_contragent_interaction_doc_header_message">
          {param.colDef.headerName}
        </div>
      )
    },
  ];

  const type: string = 'popup';
  let component = null;

  switch (type) {
    case 'popup':
      component = (
        <PopupGrid
          title={translate("label:contragent_interaction_docListView.entityTitle")}
          onDeleteClicked={(id: number) => store.deletecontragent_interaction_doc(id)}
          onEditClicked={(id: number) => store.onEditClicked(id)}
          columns={columns}
          data={store.data}
          tableName="contragent_interaction_doc"
        />
      );
      break;
  }

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      {/* Popup форма */}
      <Contragent_interaction_docPopupForm
        openPanel={store.openPanel}
        currentId={store.currentId}
        idMain={store.idMain}
        existingDocuments={store.data}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadcontragent_interaction_docs();
        }}
        onDeleteDocument={(id: number) => {
          store.deletecontragent_interaction_doc(id);
        }}
        onDownloadFile={(fileId: number, fileName: string) => store.downloadFile(fileId, fileName)}
      />

      {/* Диалог со списком подписавших */}
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
                      className={`hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
    </Container>
  );
});

export default Contragent_interaction_docListView;