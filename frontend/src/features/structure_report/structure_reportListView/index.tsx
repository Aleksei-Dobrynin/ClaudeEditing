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
import PopupForm from './../structure_reportAddEditView/popupForm'
import styled from 'styled-components';


type structure_reportListViewProps = {
};


const Structure_reportListView: FC<structure_reportListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadstructure_reports()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'quarter',
      headerName: translate("label:structure_reportListView.quarter"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_quarter"> {param.row.quarter} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_quarter">{param.colDef.headerName}</div>)
    },
    {
      field: 'structure_id',
      headerName: translate("label:structure_reportListView.structure_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_structure_id"> {param.row.structureId} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_structure_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'status_id',
      headerName: translate("label:structure_reportListView.status_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_status_id"> {param.row.statusId} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_status_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'report_config_id',
      headerName: translate("label:structure_reportListView.report_config_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_report_config_id"> {param.row.reportConfigId} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_report_config_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:structure_reportListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_created_at"> {param.row.createdAt} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:structure_reportListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_updated_at"> {param.row.updatedAt} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:structure_reportListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_created_by"> {param.row.createdBy} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:structure_reportListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_updated_by"> {param.row.updatedBy} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_updated_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'month',
      headerName: translate("label:structure_reportListView.month"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_month"> {param.row.month} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_month">{param.colDef.headerName}</div>)
    },
    {
      field: 'year',
      headerName: translate("label:structure_reportListView.year"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_column_year"> {param.row.year} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_header_year">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:structure_reportListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:structure_reportListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report" />
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
          store.loadstructure_reports()
        }}
      />

    </Container>
  );
})



export default Structure_reportListView
