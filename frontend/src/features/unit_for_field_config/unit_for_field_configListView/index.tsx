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
import PopupForm from './../unit_for_field_configAddEditView/popupForm'
import styled from 'styled-components';


type unit_for_field_configListViewProps = {
  idField: number
};


const Unit_for_field_configListView: FC<unit_for_field_configListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadunit_for_field_configs()
    return () => {
      store.clearStore()
    }
    store.idField = props.idField  
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'unit_id',
      headerName: translate("label:unit_for_field_configListView.unit_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_for_field_config_column_unit_id"> {param.row.unitId} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_for_field_config_header_unit_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'field_id',
      headerName: translate("label:unit_for_field_configListView.field_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_for_field_config_column_field_id"> {param.row.fieldId} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_for_field_config_header_field_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:unit_for_field_configListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_for_field_config_column_created_at"> {param.row.createdAt} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_for_field_config_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:unit_for_field_configListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_for_field_config_column_updated_at"> {param.row.updatedAt} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_for_field_config_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:unit_for_field_configListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_for_field_config_column_created_by"> {param.row.createdBy} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_for_field_config_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:unit_for_field_configListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_unit_for_field_config_column_updated_by"> {param.row.updatedBy} </div>),
      renderHeader: (param) => (<div data-testid="table_unit_for_field_config_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:unit_for_field_configListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteunit_for_field_config(id)}
        columns={columns}
        data={store.data}
        tableName="unit_for_field_config" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:unit_for_field_configListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteunit_for_field_config(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="unit_for_field_config" />
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
          store.loadunit_for_field_configs()
        }}
      />

    </Container>
  );
})



export default Unit_for_field_configListView
