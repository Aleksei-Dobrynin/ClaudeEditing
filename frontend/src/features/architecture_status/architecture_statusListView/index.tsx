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
import Architecture_statusPopupForm from './../architecture_statusAddEditView/popupForm'
import styled from 'styled-components';


type architecture_statusListViewProps = {
};


const architecture_statusListView: FC<architecture_statusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadarchitecture_statuses()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:architecture_statusListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_status_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_status_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:architecture_statusListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_status_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_status_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:architecture_statusListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_status_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_status_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'name_kg',
      headerName: translate("label:architecture_statusListView.name_kg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_status_column_name_kg"> {param.row.name_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_status_header_name_kg">{param.colDef.headerName}</div>)
    },
    {
      field: 'description_kg',
      headerName: translate("label:architecture_statusListView.description_kg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_status_column_description_kg"> {param.row.description_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_status_header_description_kg">{param.colDef.headerName}</div>)
    },
    {
      field: 'text_color',
      headerName: translate("label:architecture_statusListView.text_color"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_status_column_text_color"> {param.row.text_color} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_status_header_text_color">{param.colDef.headerName}</div>)
    },
    {
      field: 'background_color',
      headerName: translate("label:architecture_statusListView.background_color"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_architecture_status_column_background_color"> {param.row.background_color} </div>),
      renderHeader: (param) => (<div data-testid="table_architecture_status_header_background_color">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:architecture_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchitecture_status(id)}
        columns={columns}
        data={store.data}
        tableName="architecture_status" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:architecture_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchitecture_status(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="architecture_status" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Architecture_statusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadarchitecture_statuses()
        }}
      />

    </Container>
  );
})



export default architecture_statusListView
