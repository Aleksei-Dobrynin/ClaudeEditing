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
import S_QueryPopupForm from './../S_QueryAddEditView/popupForm'
import styled from 'styled-components';


type S_QueryListViewProps = {
};


const S_QueryListView: FC<S_QueryListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadS_Querys()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:S_QueryListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_Query_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_S_Query_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:S_QueryListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_Query_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_S_Query_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:S_QueryListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_Query_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_S_Query_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'query',
      headerName: translate("label:S_QueryListView.query"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_Query_column_query"> {param.row.query} </div>),
      renderHeader: (param) => (<div data-testid="table_S_Query_header_query">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_QueryListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_Query(id)}
        columns={columns}
        data={store.data}
        tableName="S_Query" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_QueryListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_Query(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_Query" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_QueryPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_Querys()
        }}
      />

    </Container>
  );
})



export default S_QueryListView
