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
import S_QueriesDocumentTemplatePopupForm from './../S_QueriesDocumentTemplateAddEditView/popupForm'
import styled from 'styled-components';


type S_QueriesDocumentTemplateListViewProps = {
};


const S_QueriesDocumentTemplateListView: FC<S_QueriesDocumentTemplateListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadS_QueriesDocumentTemplates()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'idDocumentTemplateNavName',
      headerName: translate("label:S_QueriesDocumentTemplateListView.idDocumentTemplateNavName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_QueriesDocumentTemplate_column_idDocumentTemplateNavName"> {param.row.idDocumentTemplateNavName} </div>),
      renderHeader: (param) => (<div data-testid="table_S_QueriesDocumentTemplate_header_idDocumentTemplateNavName">{param.colDef.headerName}</div>)
    },
    {
      field: 'idQueryNavName',
      headerName: translate("label:S_QueriesDocumentTemplateListView.idQueryNavName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_QueriesDocumentTemplate_column_idQueryNavName"> {param.row.idQueryNavName} </div>),
      renderHeader: (param) => (<div data-testid="table_S_QueriesDocumentTemplate_header_idQueryNavName">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_QueriesDocumentTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_QueriesDocumentTemplate(id)}
        columns={columns}
        data={store.data}
        tableName="S_QueriesDocumentTemplate" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_QueriesDocumentTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_QueriesDocumentTemplate(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_QueriesDocumentTemplate" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_QueriesDocumentTemplatePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_QueriesDocumentTemplates()
        }}
      />

    </Container>
  );
})



export default S_QueriesDocumentTemplateListView
