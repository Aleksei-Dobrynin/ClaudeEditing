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
import Notification_templatePopupForm from './../notification_templateAddEditView/popupForm'
import styled from 'styled-components';


type notification_templateListViewProps = {
};


const notification_templateListView: FC<notification_templateListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadnotification_templates()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'contact_type_id',
      headerName: translate("label:notification_templateListView.contact_type_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_template_column_contact_type_id"> {param.row.contact_type_id} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_template_header_contact_type_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:notification_templateListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_template_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_template_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'subject',
      headerName: translate("label:notification_templateListView.subject"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_template_column_subject"> {param.row.subject} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_template_header_subject">{param.colDef.headerName}</div>)
    },
    {
      field: 'body',
      headerName: translate("label:notification_templateListView.body"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_template_column_body"> {param.row.body} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_template_header_body">{param.colDef.headerName}</div>)
    },
    {
      field: 'placeholders',
      headerName: translate("label:notification_templateListView.placeholders"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_template_column_placeholders"> {param.row.placeholders} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_template_header_placeholders">{param.colDef.headerName}</div>)
    },
    {
      field: 'link',
      headerName: translate("label:notification_templateListView.link"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_notification_template_column_link"> {param.row.link} </div>),
      renderHeader: (param) => (<div data-testid="table_notification_template_header_link">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:notification_templateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotification_template(id)}
        columns={columns}
        data={store.data}
        tableName="notification_template" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:notification_templateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletenotification_template(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="notification_template" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Notification_templatePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadnotification_templates()
        }}
      />

    </Container>
  );
})



export default notification_templateListView
