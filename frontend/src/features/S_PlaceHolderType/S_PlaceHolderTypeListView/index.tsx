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
import S_PlaceHolderTypePopupForm from './../S_PlaceHolderTypeAddEditView/popupForm'
import styled from 'styled-components';


type S_PlaceHolderTypeListViewProps = {
};


const S_PlaceHolderTypeListView: FC<S_PlaceHolderTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadS_PlaceHolderTypes()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:S_PlaceHolderTypeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_PlaceHolderType_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_S_PlaceHolderType_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:S_PlaceHolderTypeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_PlaceHolderType_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_S_PlaceHolderType_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:S_PlaceHolderTypeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_PlaceHolderType_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_S_PlaceHolderType_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'queueNumber',
      headerName: translate("label:S_PlaceHolderTypeListView.queueNumber"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_S_PlaceHolderType_column_queueNumber"> {param.row.queueNumber} </div>),
      renderHeader: (param) => (<div data-testid="table_S_PlaceHolderType_header_queueNumber">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:S_PlaceHolderTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_PlaceHolderType(id)}
        columns={columns}
        data={store.data}
        tableName="S_PlaceHolderType" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:S_PlaceHolderTypeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteS_PlaceHolderType(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="S_PlaceHolderType" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <S_PlaceHolderTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadS_PlaceHolderTypes()
        }}
      />

    </Container>
  );
})



export default S_PlaceHolderTypeListView
