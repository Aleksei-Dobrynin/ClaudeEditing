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
import S_DocumentTemplateCategoryPopupForm from './../S_DocumentTemplateCategoryAddEditView/popupForm'
import styled from 'styled-components';


type S_DocumentTemplateCategoryListViewProps = {
};


const S_DocumentTemplateCategoryListView: FC<S_DocumentTemplateCategoryListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadS_DocumentTemplateCategorys()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:S_DocumentTemplateCategoryListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateCategory_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateCategory_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:S_DocumentTemplateCategoryListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateCategory_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateCategory_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:S_DocumentTemplateCategoryListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateCategory_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateCategory_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'queueNumber',
      headerName: translate("label:S_DocumentTemplateCategoryListView.queueNumber"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateCategory_column_queueNumber"> {param.row.queueNumber} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateCategory_header_queueNumber">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_DocumentTemplateCategoryListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_DocumentTemplateCategory(id)}
        columns={columns}
        data={store.data}
        tableName="S_DocumentTemplateCategory" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_DocumentTemplateCategoryListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_DocumentTemplateCategory(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_DocumentTemplateCategory" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_DocumentTemplateCategoryPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_DocumentTemplateCategorys()
        }}
      />

    </Container>
  );
})



export default S_DocumentTemplateCategoryListView
