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
import NotificationPopupForm from './../notificationAddEditView/popupForm'
import styled from 'styled-components';


type notificationListViewProps = {
};


const notificationListView: FC<notificationListViewProps> = observer((props) => {
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
      headerName: translate("label:notificationListView.title"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_title"> {param.row.title} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_title">{param.colDef.headerName}</div>)
    },
    {
      field: 'text',
      headerName: translate("label:notificationListView.text"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_text"> {param.row.text} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_text">{param.colDef.headerName}</div>)
    },
    {
      field: 'employee_id',
      headerName: translate("label:notificationListView.employee_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_employee_id"> {param.row.employee_id} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_employee_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'user_id',
      headerName: translate("label:notificationListView.user_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_user_id"> {param.row.user_id} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_user_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'has_read',
      headerName: translate("label:notificationListView.has_read"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_has_read"> {param.row.has_read} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_has_read">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:notificationListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:notificationListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'link',
      headerName: translate("label:notificationListView.link"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_column_link"> {param.row.link} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_header_link">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:notificationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotification(id)}
        columns={columns}
        data={store.data}
        tableName="notification" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:notificationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotification(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="notification" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <NotificationPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadnotifications()
        }}
      />

    </Container>
  );
})



export default notificationListView
