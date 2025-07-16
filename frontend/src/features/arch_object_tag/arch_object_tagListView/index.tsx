import { FC, useEffect } from 'react';
import {
  Container,
  Checkbox
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Arch_object_tagPopupForm from 'features/arch_object_tag/arch_object_tagAddEditView/popupForm'
// import styled from 'styled-components';


type arch_object_tagListViewProps = {
  idMain: number
};


const arch_object_tagListView: FC<arch_object_tagListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadarch_object_tags()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'tags',
      headerName: translate("label:arch_object_tagListView.tags"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_arch_object_tag_column_value"> {param.row.tags} </div>),
      renderHeader: (param) => (<div data-testid="table_arch_object_tag_header_value">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:arch_object_tagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearch_object_tag(id)}
        columns={columns}
        data={store.data}
        tableName="arch_object_tag" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:arch_object_tagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearch_object_tag(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="arch_object_tag" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Arch_object_tagPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadarch_object_tags()
        }}
      />

    </Container>
  );
})



export default arch_object_tagListView
