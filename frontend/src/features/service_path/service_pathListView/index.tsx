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
import Service_pathPopupForm from '../service_pathAddEditView/popupForm'
import styled from 'styled-components';


type service_pathListViewProps = {
};


const service_pathListView: FC<service_pathListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadservice_paths()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'updated_by',
      headerName: translate("label:service_pathListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_updated_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'service_id',
      headerName: translate("label:service_pathListView.service_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_service_id"> {param.row.service_id} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_service_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:service_pathListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:service_pathListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_default',
      headerName: translate("label:service_pathListView.is_default"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_is_default"> {param.row.is_default} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_is_default">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_active',
      headerName: translate("label:service_pathListView.is_active"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_is_active"> {param.row.is_active} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_is_active">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:service_pathListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:service_pathListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:service_pathListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_service_path_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_service_path_header_created_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:service_pathListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteservice_path(id)}
        columns={columns}
        data={store.data}
        tableName="service_path" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:service_pathListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteservice_path(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="service_path" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Service_pathPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadservice_paths()
        }}
      />

    </Container>
  );
})



export default service_pathListView
