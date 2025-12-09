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
import TemplCommsFooterPopupForm from './../TemplCommsFooterAddEditView/popupForm'
import styled from 'styled-components';


type TemplCommsFooterListViewProps = {
  template_comms_id: number;
};


const TemplCommsFooterListView: FC<TemplCommsFooterListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.template_comms_id !== props.template_comms_id) {
      store.template_comms_id = props.template_comms_id
    }
    store.loadTemplCommsFooters()
    return () => store.clearStore()
  }, [props.template_comms_id])


  const columns: GridColDef[] = [
    {
      field: 'language_idNavName',
      headerName: translate("label:TemplCommsFooterListView.language_id"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsFooter_column_language_id"}> {param.row.language_idNavName} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsFooter_header_language_id"}>{param.colDef.headerName}</div>)
    },
    {
      field: 'footer_email',
      headerName: translate("label:TemplCommsFooterListView.footer_email"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsFooter_column_footer_email"}> {param.row.footer_email} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsFooter_header_footer_email"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:TemplCommsFooterListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsFooter(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsFooter" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:TemplCommsFooterListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsFooter(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsFooter" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <TemplCommsFooterPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        template_comms_id={store.template_comms_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadTemplCommsFooters()
        }}
      />

    </Container>
  );
})



export default TemplCommsFooterListView
