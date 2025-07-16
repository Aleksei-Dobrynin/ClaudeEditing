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
import PopupForm from './../legal_act_registry_statusAddEditView/popupForm'
import styled from 'styled-components';


type legal_act_registry_statusListViewProps = {
};


const legal_act_registry_statusListView: FC<legal_act_registry_statusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadlegal_act_registry_statuses()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'description_kg',
      headerName: translate("label:legal_act_registry_statusListView.description_kg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_description_kg"> {param.row.description_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_description_kg">{param.colDef.headerName}</div>)
    },
    {
      field: 'text_color',
      headerName: translate("label:legal_act_registry_statusListView.text_color"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_text_color"> {param.row.text_color} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_text_color">{param.colDef.headerName}</div>)
    },
    {
      field: 'background_color',
      headerName: translate("label:legal_act_registry_statusListView.background_color"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_background_color"> {param.row.background_color} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_background_color">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:legal_act_registry_statusListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:legal_act_registry_statusListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:legal_act_registry_statusListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_code">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'created_at',
    //   headerName: translate("label:legal_act_registry_statusListView.created_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_created_at"> {param.row.created_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_created_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_at',
    //   headerName: translate("label:legal_act_registry_statusListView.updated_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_updated_at"> {param.row.updated_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_updated_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'created_by',
    //   headerName: translate("label:legal_act_registry_statusListView.created_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_created_by"> {param.row.created_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_created_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_by',
    //   headerName: translate("label:legal_act_registry_statusListView.updated_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_updated_by"> {param.row.updated_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_updated_by">{param.colDef.headerName}</div>)
    // },
    {
      field: 'name_kg',
      headerName: translate("label:legal_act_registry_statusListView.name_kg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_act_registry_status_column_name_kg"> {param.row.name_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_act_registry_status_header_name_kg">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:legal_act_registry_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletelegal_act_registry_status(id)}
        columns={columns}
        data={store.data}
        tableName="legal_act_registry_status" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:legal_act_registry_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletelegal_act_registry_status(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="legal_act_registry_status" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <PopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadlegal_act_registry_statuses()
        }}
      />

    </Container>
  );
})



export default legal_act_registry_statusListView
