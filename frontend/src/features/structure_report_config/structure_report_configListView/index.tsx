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
import PopupForm from './../structure_report_configAddEditView/popupForm'
import styled from 'styled-components';


type structure_report_configListViewProps = {
};


const Structure_report_configListView: FC<structure_report_configListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadstructure_report_configs()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:structure_report_configListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_config_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_config_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'structure_name',
      headerName: translate("label:structure_report_configListView.structure_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_config_column_structure_id"> {param.row.structure_name} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_config_header_structure_id">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'created_at',
    //   headerName: translate("label:structure_report_configListView.created_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_config_column_created_at"> {param.row.createdAt} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_config_header_created_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_at',
    //   headerName: translate("label:structure_report_configListView.updated_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_config_column_updated_at"> {param.row.updatedAt} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_config_header_updated_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'created_by',
    //   headerName: translate("label:structure_report_configListView.created_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_config_column_created_by"> {param.row.createdBy} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_config_header_created_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_by',
    //   headerName: translate("label:structure_report_configListView.updated_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_config_column_updated_by"> {param.row.updatedBy} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_config_header_updated_by">{param.colDef.headerName}</div>)
    // },
    {
      field: 'is_active',
      headerName: translate("label:structure_report_configListView.is_active"),
      flex: 1,
      renderCell: params => {
        return<span>{params.row.isActive ?
          translate("label:structure_report_configListView.active")
          : translate("label:structure_report_configListView.inactive")}
        </span>
      },
      renderHeader: (param) => (<div data-testid="table_structure_report_config_header_is_active">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:structure_report_configListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report_config(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report_config" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:structure_report_configListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report_config(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report_config" />
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
          store.loadstructure_report_configs()
        }}
      />

    </Container>
  );
})



export default Structure_report_configListView
