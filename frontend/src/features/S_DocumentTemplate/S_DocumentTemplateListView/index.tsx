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
import S_DocumentTemplatePopupForm from './../S_DocumentTemplateAddEditView/popupForm'
import styled from 'styled-components';


type S_DocumentTemplateListViewProps = {
};


const S_DocumentTemplateListView: FC<S_DocumentTemplateListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadS_DocumentTemplates()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:S_DocumentTemplateListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplate_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplate_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:S_DocumentTemplateListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplate_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplate_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:S_DocumentTemplateListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplate_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplate_header_code">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'idCustomSvgIconNavName',
    //   headerName: translate("label:S_DocumentTemplateListView.idCustomSvgIcon"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_S_DocumentTemplate_column_idCustomSvgIconNavName"> {param.row.idCustomSvgIconNavName} </div>),
    //   renderHeader: (param) => (<div data-testid="table_S_DocumentTemplate_header_idCustomSvgIconNavName">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'iconColor',
    //   headerName: translate("label:S_DocumentTemplateListView.iconColor"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_S_DocumentTemplate_column_iconColor"> {param.row.iconColor} </div>),
    //   renderHeader: (param) => (<div data-testid="table_S_DocumentTemplate_header_iconColor">{param.colDef.headerName}</div>)
    // },
    {
      field: 'idDocumentTypeNavName',
      headerName: translate("label:S_DocumentTemplateListView.idDocumentType"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplate_column_idDocumentTypeNavName"> {param.row.idDocumentTypeNavName} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplate_header_idDocumentTypeNavName">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_DocumentTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_DocumentTemplate(id)}
        columns={columns}
        data={store.data}
        tableName="S_DocumentTemplate" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_DocumentTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_DocumentTemplate(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_DocumentTemplate" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_DocumentTemplatePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_DocumentTemplates()
        }}
      />

    </Container>
  );
})



export default S_DocumentTemplateListView
