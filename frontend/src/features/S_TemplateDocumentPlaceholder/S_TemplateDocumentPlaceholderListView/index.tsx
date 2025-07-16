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
import S_TemplateDocumentPlaceholderPopupForm from './../S_TemplateDocumentPlaceholderAddEditView/popupForm'
import styled from 'styled-components';


type S_TemplateDocumentPlaceholderListViewProps = {
};


const S_TemplateDocumentPlaceholderListView: FC<S_TemplateDocumentPlaceholderListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadS_TemplateDocumentPlaceholders()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'idTemplateDocumentNavName',
      headerName: translate("label:S_TemplateDocumentPlaceholderListView.idTemplateDocumentNavName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_TemplateDocumentPlaceholder_column_idTemplateDocumentNavName"> {param.row.idTemplateDocumentNavName} </div>),
      renderHeader: (param) => (<div data-testid="table_S_TemplateDocumentPlaceholder_header_idTemplateDocumentNavName">{param.colDef.headerName}</div>)
    },
    {
      field: 'idPlaceholderNavName',
      headerName: translate("label:S_TemplateDocumentPlaceholderListView.idPlaceholderNavName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_TemplateDocumentPlaceholder_column_idPlaceholderNavName"> {param.row.idPlaceholderNavName} </div>),
      renderHeader: (param) => (<div data-testid="table_S_TemplateDocumentPlaceholder_header_idPlaceholderNavName">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_TemplateDocumentPlaceholderListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_TemplateDocumentPlaceholder(id)}
        columns={columns}
        data={store.data}
        tableName="S_TemplateDocumentPlaceholder" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_TemplateDocumentPlaceholderListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_TemplateDocumentPlaceholder(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_TemplateDocumentPlaceholder" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_TemplateDocumentPlaceholderPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_TemplateDocumentPlaceholders()
        }}
      />

    </Container>
  );
})



export default S_TemplateDocumentPlaceholderListView
