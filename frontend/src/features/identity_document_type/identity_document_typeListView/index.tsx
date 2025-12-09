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
import Identity_document_typePopupForm from './../identity_document_typeAddEditView/popupForm'
import styled from 'styled-components';


type identity_document_typeListViewProps = {
};


const identity_document_typeListView: FC<identity_document_typeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadidentity_document_types()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:identity_document_typeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_identity_document_type_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_identity_document_type_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:identity_document_typeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_identity_document_type_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_identity_document_type_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:identity_document_typeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_identity_document_type_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_identity_document_type_header_description">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:identity_document_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteidentity_document_type(id)}
        columns={columns}
        data={store.data}
        tableName="identity_document_type" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:identity_document_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteidentity_document_type(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="identity_document_type" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Identity_document_typePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadidentity_document_types()
        }}
      />

    </Container>
  );
})



export default identity_document_typeListView
