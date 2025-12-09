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
// import NotificationPopupForm from './../notificationAddEditView/popupForm'
import styled from 'styled-components';
import dayjs from "dayjs";



type notificationLogListViewProps = {
};


const notificationLogListView: FC<notificationLogListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadnotifications()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'title',
      headerName: translate("label:notificationLogListView.title"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_title"> {param.row.subject} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_title">{param.colDef.headerName}</div>)
    },
    {
      field: 'text',
      headerName: translate("label:notificationLogListView.text"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_text"> {param.row.message} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_text">{param.colDef.headerName}</div>)
    },
    {
      field: 'user_id',
      headerName: translate("label:notificationLogListView.user_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_user_id"> {param.row.user_name} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_user_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'date_send',
      headerName: translate("label:notificationLogListView.date_send"),
      flex: 1,
      // renderCell: (param) => (<div data-testid="table_notification_column_link"> {param.row.date_send} </div>),
      renderCell: (param) => (
        <span>
          {param.row.date_send ? dayjs(param.row.date_send).format('DD.MM.YYYY  HH:mm') : ""}
        </span>
      ),
      renderHeader: (param) => (<div data-testid="table_notification_header_link">{param.colDef.headerName}</div>)
    },
    {
      field: 'type',
      headerName: translate("label:notificationLogListView.type"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_link"> {param.row.type} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_link">{param.colDef.headerName}</div>)
    },
    {
      field: 'status',
      headerName: translate("label:notificationLogListView.status"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_link"> {param.row.statusName} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_link">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:notificationLogListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotification(id)}
        columns={columns}
        data={store.data}
        tableName="notification"
        hideActions = {true}
        hideAddButton = {true}
         />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:notificationLogListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotification(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="notification"
        hideActions = {true}
        hideAddButton = {true}
        hideDeleteButton = {true} />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}
{/* 
      <NotificationPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadnotifications()
        }}
      /> */}

    </Container>
  );
})



export default notificationLogListView
