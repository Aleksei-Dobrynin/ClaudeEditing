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
import S_DocumentTemplateTranslationPopupForm from './../S_DocumentTemplateTranslationAddEditView/popupForm'
import styled from 'styled-components';


type S_DocumentTemplateTranslationListViewProps = {
  idMain: number;
};


const S_DocumentTemplateTranslationListView: FC<S_DocumentTemplateTranslationListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadS_DocumentTemplateTranslations()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'template',
      headerName: translate("label:S_DocumentTemplateTranslationListView.template"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateTranslation_column_template"> {param.row.template} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateTranslation_header_template">{param.colDef.headerName}</div>)
    },
    {
      field: 'idLanguageNavName',
      headerName: translate("label:S_DocumentTemplateTranslationListView.idLanguage"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_DocumentTemplateTranslation_column_idLanguage"> {param.row.idLanguageNavName} </div>),
      renderHeader: (param) => (<div data-testid="table_S_DocumentTemplateTranslation_header_idLanguage">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_DocumentTemplateTranslationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_DocumentTemplateTranslation(id)}
        columns={columns}
        data={store.data}
        tableName="S_DocumentTemplateTranslation" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_DocumentTemplateTranslationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_DocumentTemplateTranslation(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_DocumentTemplateTranslation" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_DocumentTemplateTranslationPopupForm
        openPanel={store.openPanel}
        idDocumentTemplate={props.idMain}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_DocumentTemplateTranslations()
        }}
      />

    </Container>
  );
})



export default S_DocumentTemplateTranslationListView
