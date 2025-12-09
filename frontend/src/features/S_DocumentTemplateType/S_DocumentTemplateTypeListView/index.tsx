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
import S_DocumentTemplateTypePopupForm from './../S_DocumentTemplateTypeAddEditView/popupForm'
import styled from 'styled-components';


type S_DocumentTemplateTypeListViewProps = {
};


const S_DocumentTemplateTypeListView: FC<S_DocumentTemplateTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadS_DocumentTemplateTypes()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:S_DocumentTemplateTypeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateType_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateType_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:S_DocumentTemplateTypeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateType_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateType_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:S_DocumentTemplateTypeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateType_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateType_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'queueNumber',
      headerName: translate("label:S_DocumentTemplateTypeListView.queueNumber"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateType_column_queueNumber"> {param.row.queueNumber} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateType_header_queueNumber">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_DocumentTemplateTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_DocumentTemplateType(id)}
        columns={columns}
        data={store.data}
        tableName="S_DocumentTemplateType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_DocumentTemplateTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_DocumentTemplateType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_DocumentTemplateType" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_DocumentTemplateTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_DocumentTemplateTypes()
        }}
      />

    </Container>
  );
})



export default S_DocumentTemplateTypeListView
