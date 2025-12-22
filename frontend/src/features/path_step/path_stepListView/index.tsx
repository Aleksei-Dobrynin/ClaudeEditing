import { FC, useEffect } from 'react';
import {
  Container,
  Checkbox
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Path_stepPopupForm from './../path_stepAddEditView/popupForm'
import styled from 'styled-components';


type path_stepListViewProps = {
  idMain: number;
};


const path_stepListView: FC<path_stepListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadpath_steps()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    
    {
      field: 'step_type',
      headerName: translate("label:path_stepListView.step_type"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_step_type"> {param.row.step_type} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_step_type">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:path_stepListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:path_stepListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:path_stepListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:path_stepListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_updated_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'responsible_org_id',
      headerName: translate("label:path_stepListView.responsible_org_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_responsible_org_id"> {param.row.structure_name} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_responsible_org_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:path_stepListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:path_stepListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'order_number',
      headerName: translate("label:path_stepListView.order_number"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_order_number"> {param.row.order_number} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_order_number">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_required',
      headerName: translate("label:path_stepListView.is_required"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_path_step_column_is_required">
          <Checkbox 
            checked={param.row.is_required} 
            disabled 
            size="small"
          />
        </div>
      ),
      renderHeader: (param) => (<div data-testid="table_path_step_header_is_required">{param.colDef.headerName}</div>)
    },
    {
      field: 'estimated_days',
      headerName: translate("label:path_stepListView.estimated_days"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_path_step_column_estimated_days"> {param.row.estimated_days} </div>),
      renderHeader: (param) => (<div data-testid="table_path_step_header_estimated_days">{param.colDef.headerName}</div>)
    },
    {
      field: 'wait_for_previous_steps',
      headerName: translate("label:path_stepListView.wait_for_previous_steps"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_path_step_column_wait_for_previous_steps">
          <Checkbox 
            checked={param.row.wait_for_previous_steps} 
            disabled 
            size="small"
          />
        </div>
      ),
      renderHeader: (param) => (<div data-testid="table_path_step_header_wait_for_previous_steps">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:path_stepListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletepath_step(id)}
        columns={columns}
        data={store.effectiveData}
        tableName="path_step" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:path_stepListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletepath_step(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.effectiveData}
        tableName="path_step" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Path_stepPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        service_path_id={store.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadpath_steps()
        }}
      />

    </Container>
  );
})



export default path_stepListView