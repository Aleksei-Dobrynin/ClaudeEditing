import { FC, useEffect } from 'react';
import {
  Checkbox,
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Task_typePopupForm from './../task_typeAddEditView/popupForm'
import styled from 'styled-components';
import { CheckBox } from '@mui/icons-material';


type task_typeListViewProps = {
};


const task_typeListView: FC<task_typeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadtask_types()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:task_typeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:task_typeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:task_typeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_for_task',
      headerName: translate("label:task_typeListView.is_for_task"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_is_for_task"> <Checkbox checked={param.row.is_for_task} disabled /> </div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_is_for_task">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_for_subtask',
      headerName: translate("label:task_typeListView.is_for_subtask"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_is_for_subtask"> <Checkbox checked={param.row.is_for_subtask} disabled /></div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_is_for_subtask">{param.colDef.headerName}</div>)
    },
    {
      field: 'icon_color',
      headerName: translate("label:task_typeListView.icon_color"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_icon_color"> {param.row.icon_color} </div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_icon_color">{param.colDef.headerName}</div>)
    },
    {
      field: 'svg_icon_id',
      headerName: translate("label:task_typeListView.svg_icon_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_svg_icon_id"> {param.row.svg_icon_id} </div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_svg_icon_id">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:task_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletetask_type(id)}
        columns={columns}
        data={store.data}
        tableName="task_type" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:task_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletetask_type(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="task_type" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Task_typePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadtask_types()
        }}
      />

    </Container>
  );
})



export default task_typeListView
