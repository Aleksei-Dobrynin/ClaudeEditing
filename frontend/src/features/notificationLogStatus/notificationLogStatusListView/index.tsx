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
import NotificationLogStatusPopupForm from './../notificationLogStatusAddEditView/popupForm'
import styled from 'styled-components';


type notificationLogStatusListViewProps = {
};


const notificationLogStatusListView: FC<notificationLogStatusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadnotificationLogStatuses()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:notificationLogStatusListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notificationLogStatus_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_notificationLogStatus_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:notificationLogStatusListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notificationLogStatus_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_notificationLogStatus_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:notificationLogStatusListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notificationLogStatus_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_notificationLogStatus_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:notificationLogStatusListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notificationLogStatus_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_notificationLogStatus_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:notificationLogStatusListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notificationLogStatus_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_notificationLogStatus_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:notificationLogStatusListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notificationLogStatus_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_notificationLogStatus_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:notificationLogStatusListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notificationLogStatus_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_notificationLogStatus_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:notificationLogStatusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotificationLogStatus(id)}
        columns={columns}
        data={store.data}
        tableName="notificationLogStatus" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:notificationLogStatusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotificationLogStatus(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="notificationLogStatus" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <NotificationLogStatusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadnotificationLogStatuses()
        }}
      />

    </Container>
  );
})



export default notificationLogStatusListView
