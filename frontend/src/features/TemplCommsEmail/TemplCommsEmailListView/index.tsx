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
import TemplCommsEmailPopupForm from './../TemplCommsEmailAddEditView/popupForm'
import styled from 'styled-components';


type TemplCommsEmailListViewProps = {
  template_comms_id: number;
};


const TemplCommsEmailListView: FC<TemplCommsEmailListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.template_comms_id !== props.template_comms_id) {
      store.template_comms_id = props.template_comms_id
    }
    store.loadTemplCommsEmails()
    return () => store.clearStore()
  }, [props.template_comms_id])


  const columns: GridColDef[] = [
    {
      field: 'language_idNavName',
      headerName: translate("label:TemplCommsEmailListView.language_id"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsEmail_column_language_id"}> {param.row.language_idNavName} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsEmail_header_language_id"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'body_email',
      headerName: translate("label:TemplCommsEmailListView.body_email"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsEmail_column_body_email"}> {param.row.body_email} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsEmail_header_body_email"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'subject_email',
      headerName: translate("label:TemplCommsEmailListView.subject_email"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsEmail_column_subject_email"}> {param.row.subject_email} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsEmail_header_subject_email"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:TemplCommsEmailListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsEmail(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsEmail" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:TemplCommsEmailListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsEmail(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsEmail" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <TemplCommsEmailPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        template_comms_id={store.template_comms_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadTemplCommsEmails()
        }}
      />

    </Container>
  );
})



export default TemplCommsEmailListView
