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
import TemplCommsAccessPopupForm from './../TemplCommsAccessAddEditView/popupForm'
import styled from 'styled-components';


type TemplCommsAccessListViewProps = {
  template_comms_id: number;
};


const TemplCommsAccessListView: FC<TemplCommsAccessListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.template_comms_id !== props.template_comms_id) {
      store.template_comms_id = props.template_comms_id
    }
    store.loadTemplCommsAccesss()
    return () => store.clearStore()
  }, [props.template_comms_id])


  const columns: GridColDef[] = [
    {
      field: 'tag_idNavName',
      headerName: translate("label:TemplCommsAccessListView.tag_id"),
      flex: 1,
      renderCell: (param) => (<div id={"table_TemplCommsAccess_column_tag_id"}> {param.row.tag_idNavName} </div>),
      renderHeader: (param) => (<div id={"table_TemplCommsAccess_header_tag_id"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:TemplCommsAccessListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsAccess(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsAccess" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:TemplCommsAccessListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteTemplCommsAccess(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="TemplCommsAccess" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <TemplCommsAccessPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        template_comms_id={store.template_comms_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadTemplCommsAccesss()
        }}
      />

    </Container>
  );
})



export default TemplCommsAccessListView
