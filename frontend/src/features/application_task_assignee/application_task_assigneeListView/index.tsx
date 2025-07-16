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
import Application_task_assigneePopupForm from './../application_task_assigneeAddEditView/popupForm'
import styled from 'styled-components';


type application_task_assigneeListViewProps = {
  idMain: number;
};


const application_task_assigneeListView: FC<application_task_assigneeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadapplication_task_assignees()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    
    {
      field: 'structure_employee_id',
      headerName: translate("label:application_task_assigneeListView.structure_employee_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_task_assignee_column_structure_employee_id"> {param.row.structure_employee_id} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_assignee_header_structure_employee_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:application_task_assigneeListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_task_assignee_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_assignee_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:application_task_assigneeListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_task_assignee_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_assignee_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:application_task_assigneeListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_task_assignee_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_assignee_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:application_task_assigneeListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_task_assignee_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_assignee_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:application_task_assigneeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_task_assignee(id)}
        columns={columns}
        data={store.data}
        tableName="application_task_assignee" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:application_task_assigneeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_task_assignee(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="application_task_assignee" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Application_task_assigneePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadapplication_task_assignees()
        }}
      />

    </Container>
  );
})



export default application_task_assigneeListView
