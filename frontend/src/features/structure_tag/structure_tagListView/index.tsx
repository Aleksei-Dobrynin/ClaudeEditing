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
import Structure_tagPopupForm from './../structure_tagAddEditView/popupForm'
import styled from 'styled-components';


type structure_tagListViewProps = {
  idMain: number;
};


const structure_tagListView: FC<structure_tagListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadstructure_tags()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:structure_tagListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:structure_tagListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:structure_tagListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_header_code">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:structure_tagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_tag(id)}
        columns={columns}
        data={store.data}
        tableName="structure_tag" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:structure_tagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_tag(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="structure_tag" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Structure_tagPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        structure_id={props.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadstructure_tags()
        }}
      />

    </Container>
  );
})



export default structure_tagListView
