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
import PopupForm from './../unit_typeAddEditView/popupForm'
import styled from 'styled-components';


type unit_typeListViewProps = {
};


const Unit_typeListView: FC<unit_typeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadunit_types()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'created_at',
      headerName: translate("label:unit_typeListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_type_column_created_at"> {param.row.createdAt} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_type_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:unit_typeListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_type_column_updated_at"> {param.row.updatedAt} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_type_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:unit_typeListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_type_column_created_by"> {param.row.createdBy} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_type_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:unit_typeListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_type_column_updated_by"> {param.row.updatedBy} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_type_header_updated_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:unit_typeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_type_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_type_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:unit_typeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_type_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_type_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:unit_typeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_type_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_type_header_description">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:unit_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteunit_type(id)}
        columns={columns}
        data={store.data}
        tableName="unit_type" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:unit_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteunit_type(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="unit_type" />
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
          store.loadunit_types()
        }}
      />

    </Container>
  );
})



export default Unit_typeListView
