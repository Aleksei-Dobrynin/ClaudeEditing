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
import TemplCommsReminderPopupForm from './../TemplCommsReminderAddEditView/popupForm'
import styled from 'styled-components';


type TemplCommsReminderListViewProps = {
  template_id: number;
};


const TemplCommsReminderListView: FC<TemplCommsReminderListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.template_id !== props.template_id) {
      store.template_id = props.template_id
    }
    store.loadTemplCommsReminders()
    return () => store.clearStore()
  }, [props.template_id])


  const columns: GridColDef[] = [
    {
      field: 'language_idNavName',
      headerName: translate("label:TemplCommsReminderListView.language_id"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsReminder_column_language_id"}> {param.row.language_idNavName} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsReminder_header_language_id"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'footer_email',
      headerName: translate("label:TemplCommsReminderListView.footer_email"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsReminder_column_footer_email"}> {param.row.footer_email} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsReminder_header_footer_email"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:TemplCommsReminderListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsReminder(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsReminder" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:TemplCommsReminderListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsReminder(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsReminder" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <TemplCommsReminderPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        template_id={store.template_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadTemplCommsReminders()
        }}
      />

    </Container>
  );
})



export default TemplCommsReminderListView
