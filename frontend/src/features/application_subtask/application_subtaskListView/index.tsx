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
import Application_subtaskPopupForm from './../application_subtaskAddEditView/popupForm'
import styled from 'styled-components';


type application_subtaskListViewProps = {
  idMain: number;
};


const application_subtaskListView: FC<application_subtaskListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadapplication_subtasks()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:application_subtaskListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_subtask_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_application_subtask_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'status_id',
      headerName: translate("label:application_subtaskListView.status_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_subtask_column_status_id"> {param.row.status_id} </div>),
      renderHeader: (param) => (<div data-testid="table_application_subtask_header_status_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'type_id',
      headerName: translate("label:application_subtaskListView.type_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_subtask_column_type_id"> {param.row.type_id} </div>),
      renderHeader: (param) => (<div data-testid="table_application_subtask_header_type_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'progress',
      headerName: translate("label:application_subtaskListView.progress"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_subtask_column_progress"> {param.row.progress} </div>),
      renderHeader: (param) => (<div data-testid="table_application_subtask_header_progress">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:application_subtaskListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_subtask_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_application_subtask_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'deadline',
      headerName: translate("label:application_subtaskListView.deadline"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_subtask_column_description"> {param.row.deadline} </div>),
      renderHeader: (param) => (<div data-testid="table_application_subtask_header_description">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:application_subtaskListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_subtask(id)}
        columns={columns}
        data={store.data}
        tableName="application_subtask" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:application_subtaskListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_subtask(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="application_subtask" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      {/* <Application_subtaskPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadapplication_subtasks()
        }}
      /> */}

    </Container>
  );
})



export default application_subtaskListView
