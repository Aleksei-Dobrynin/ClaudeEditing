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
import LanguagePopupForm from './../LanguageAddEditView/popupForm'
import styled from 'styled-components';


type LanguageListViewProps = {
};


const LanguageListView: FC<LanguageListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadLanguages()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:LanguageListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:LanguageListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:LanguageListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'isDefault',
      headerName: translate("label:LanguageListView.isDefault"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_isDefault"> {param.row.isDefault} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_isDefault">{param.colDef.headerName}</div>)
    },
    {
      field: 'queueNumber',
      headerName: translate("label:LanguageListView.queueNumber"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_queueNumber"> {param.row.queueNumber} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_queueNumber">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:LanguageListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteLanguage(id)}
        columns={columns}
        data={store.data}
        tableName="Language" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:LanguageListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteLanguage(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="Language" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <LanguagePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadLanguages()
        }}
      />

    </Container>
  );
})



export default LanguageListView
