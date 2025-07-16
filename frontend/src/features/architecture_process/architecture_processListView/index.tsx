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
import Architecture_processPopupForm from './../architecture_processAddEditView/popupForm'
import styled from 'styled-components';


type architecture_processListViewProps = {
};


const architecture_processListView: FC<architecture_processListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadarchitecture_processes()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'status_id',
      headerName: translate("label:architecture_processListView.status_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_process_column_status_id"> {param.row.status_id} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_process_header_status_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:architecture_processListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_process_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_process_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:architecture_processListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_process_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_process_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:architecture_processListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_process_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_process_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:architecture_processListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_process_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_process_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:architecture_processListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchitecture_process(id)}
        columns={columns}
        data={store.data}
        tableName="architecture_process" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:architecture_processListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchitecture_process(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="architecture_process" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      {/* <Architecture_processPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadarchitecture_processes()
        }}
      /> */}

    </Container>
  );
})



export default architecture_processListView
