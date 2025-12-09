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
import SmProjectTagPopupForm from './../SmProjectTagAddEditView/popupForm'
import styled from 'styled-components';


type SmProjectTagListViewProps = {
  idMain: number;
};


const SmProjectTagListView: FC<SmProjectTagListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadSmProjectTags()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    {
      field: 'tag_idNavName',
      headerName: translate("label:SmProjectTagListView.tag_id"),
      flex: 1,
      renderCell: (param) => (<div id={"table_SmProjectTag_column_tag_id"}> {param.row.tag_idNavName} </div>),
      renderHeader: (param) => (<div id={"table_SmProjectTag_header_tag_id"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:SmProjectTagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteSmProjectTag(id)}
        columns={columns}
        data={store.data}
        tableName="SmProjectTag" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:SmProjectTagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteSmProjectTag(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="SmProjectTag" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <SmProjectTagPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        project_id={store.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadSmProjectTags()
        }}
      />

    </Container>
  );
})



export default SmProjectTagListView
