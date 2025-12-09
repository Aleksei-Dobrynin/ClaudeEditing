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
import S_PlaceHolderTemplatePopupForm from './../S_PlaceHolderTemplateAddEditView/popupForm'
import styled from 'styled-components';


type S_PlaceHolderTemplateListViewProps = {
  idMain: number;
};


const S_PlaceHolderTemplateListView: FC<S_PlaceHolderTemplateListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadS_PlaceHolderTemplates()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:S_PlaceHolderTemplateListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_PlaceHolderTemplate_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_S_PlaceHolderTemplate_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'value',
      headerName: translate("label:S_PlaceHolderTemplateListView.value"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_PlaceHolderTemplate_column_value"> {param.row.value} </div>),
      renderHeader: (param) => (<div data-testid="table_S_PlaceHolderTemplate_header_value">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:S_PlaceHolderTemplateListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_PlaceHolderTemplate_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_S_PlaceHolderTemplate_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'idPlaceholderTypeNavName',
      headerName: translate("label:S_PlaceHolderTemplateListView.idPlaceholderType"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_PlaceHolderTemplate_column_idPlaceholderTypeNavName"> {param.row.idPlaceholderTypeNavName} </div>),
      renderHeader: (param) => (<div data-testid="table_S_PlaceHolderTemplate_header_idPlaceholderTypeNavName">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_PlaceHolderTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_PlaceHolderTemplate(id)}
        columns={columns}
        data={store.data}
        tableName="S_PlaceHolderTemplate" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_PlaceHolderTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_PlaceHolderTemplate(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_PlaceHolderTemplate" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_PlaceHolderTemplatePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idQuery={props.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_PlaceHolderTemplates()
        }}
      />

    </Container>
  );
})



export default S_PlaceHolderTemplateListView
