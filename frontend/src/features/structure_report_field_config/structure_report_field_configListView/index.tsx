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
import PopupForm from './../structure_report_field_configAddEditView/popupForm'
import styled from 'styled-components';


type structure_report_field_configListViewProps = {
  idReportConfig: number
};


const Structure_report_field_configListView: FC<structure_report_field_configListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.idMain = props.idReportConfig
    store.loadstructure_report_field_configs()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    // {
    //   field: 'structure_report_id',
    //   headerName: translate("label:structure_report_field_configListView.structure_report_id"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_field_config_column_structure_report_id"> {param.row.structure_report_id} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_field_config_header_structure_report_id">{param.colDef.headerName}</div>)
    // },
    {
      field: 'field_name',
      headerName: translate("label:structure_report_field_configListView.field_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_config_column_field_name"> {param.row.fieldName} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_config_header_field_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'report_item',
      headerName: translate("label:structure_report_field_configListView.report_item"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_config_column_report_item"> {param.row.reportItem} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_config_header_report_item">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:structure_report_field_configListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_config_column_created_at"> {param.row.createdAt} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_config_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:structure_report_field_configListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_config_column_updated_at"> {param.row.updatedAt} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_config_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:structure_report_field_configListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_config_column_created_by"> {param.row.createdBy} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_config_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:structure_report_field_configListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_config_column_updated_by"> {param.row.updatedBy} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_config_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:structure_report_field_configListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report_field_config(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report_field_config" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:structure_report_field_configListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report_field_config(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report_field_config" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <PopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        idReportConfig={store.idMain}
        onSaveClick={() => {
          store.closePanel()
          store.loadstructure_report_field_configs()
        }}
      />

    </Container>
  );
})



export default Structure_report_field_configListView
