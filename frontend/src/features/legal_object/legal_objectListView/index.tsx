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
import PopupForm from './../legal_objectAddEditView/popupForm'
import styled from 'styled-components';


type legal_objectListViewProps = {
};


const legal_objectListView: FC<legal_objectListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadlegal_objects()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'description',
      headerName: translate("label:legal_objectListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_object_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_object_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'address',
      headerName: translate("label:legal_objectListView.address"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_object_column_address"> {param.row.address} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_object_header_address">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'geojson',
    //   headerName: translate("label:legal_objectListView.geojson"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_object_column_geojson"> {param.row.geojson} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_object_header_geojson">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'created_at',
    //   headerName: translate("label:legal_objectListView.created_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_object_column_created_at"> {param.row.created_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_object_header_created_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_at',
    //   headerName: translate("label:legal_objectListView.updated_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_object_column_updated_at"> {param.row.updated_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_object_header_updated_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'created_by',
    //   headerName: translate("label:legal_objectListView.created_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_object_column_created_by"> {param.row.created_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_object_header_created_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_by',
    //   headerName: translate("label:legal_objectListView.updated_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_object_column_updated_by"> {param.row.updated_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_object_header_updated_by">{param.colDef.headerName}</div>)
    // },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:legal_objectListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletelegal_object(id)}
        columns={columns}
        data={store.data}
        tableName="legal_object" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:legal_objectListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletelegal_object(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="legal_object" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <PopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadlegal_objects()
        }}
      />

    </Container>
  );
})



export default legal_objectListView
