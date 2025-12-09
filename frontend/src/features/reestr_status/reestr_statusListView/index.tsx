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
import Reestr_statusPopupForm from './../reestr_statusAddEditView/popupForm'
import styled from 'styled-components';


type reestr_statusListViewProps = {
};


const reestr_statusListView: FC<reestr_statusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadreestr_statuses()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:reestr_statusListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_reestr_status_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_reestr_status_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:reestr_statusListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_reestr_status_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_reestr_status_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:reestr_statusListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_reestr_status_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_reestr_status_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:reestr_statusListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_reestr_status_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_reestr_status_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:reestr_statusListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_reestr_status_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_reestr_status_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:reestr_statusListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_reestr_status_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_reestr_status_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:reestr_statusListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_reestr_status_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_reestr_status_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:reestr_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletereestr_status(id)}
        columns={columns}
        data={store.data}
        tableName="reestr_status" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:reestr_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletereestr_status(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="reestr_status" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Reestr_statusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadreestr_statuses()
        }}
      />

    </Container>
  );
})



export default reestr_statusListView
