import { FC, useEffect } from 'react';
import {
  Chip,
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Task_statusPopupForm from './../task_statusAddEditView/popupForm'
import styled from 'styled-components';


type task_statusListViewProps = {
};


const task_statusListView: FC<task_statusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadtask_statuses()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:task_statusListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_status_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_task_status_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:task_statusListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_status_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_task_status_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:task_statusListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_status_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_task_status_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'textcolor',
      headerName: translate("label:task_statusListView.textcolor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_status_column_textcolor"> {param.row.textcolor} </div>),
      renderHeader: (param) => (<div data-testid="table_task_status_header_textcolor">{param.colDef.headerName}</div>)
    },
    {
      field: 'backcolor',
      headerName: translate("label:task_statusListView.backcolor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_status_column_backcolor"> {param.row.backcolor} </div>),
      renderHeader: (param) => (<div data-testid="table_task_status_header_backcolor">{param.colDef.headerName}</div>)
    },
    {
      field: 'id',
      headerName: translate("label:task_statusListView.Chip"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_status_column_id"><Chip size="small" label={param.row.name} style={{ background: param.row.backcolor, color: param.row.textcolor }} />  </div>),
      renderHeader: (param) => (<div data-testid="table_task_status_header_id">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:task_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletetask_status(id)}
        columns={columns}
        data={store.data}
        tableName="task_status" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:task_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletetask_status(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="task_status" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Task_statusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadtask_statuses()
        }}
      />

    </Container>
  );
})



export default task_statusListView
