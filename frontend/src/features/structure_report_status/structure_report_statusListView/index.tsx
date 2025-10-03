import React, { FC, useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import PopupForm from './../structure_report_statusAddEditView/popupForm'
import styled from 'styled-components';
import dayjs from "dayjs";


type structure_report_statusListViewProps = {
};


const Structure_report_statusListView: FC<structure_report_statusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.loadstructure_report_statuses()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    
    {
      field: 'created_at',
      headerName: translate("label:structure_report_statusListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_status_column_created_at"> {param.row.createdAt ? dayjs(param.row.createdAt).format('DD.MM.YYYY') : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_status_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:structure_report_statusListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_status_column_updated_at"> {param.row.updatedAt ? dayjs(param.row.updatedAt).format('DD.MM.YYYY') : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_status_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:structure_report_statusListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_status_column_created_by"> {param.row.createdBy_name} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_status_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:structure_report_statusListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_status_column_updated_by"> {param.row.updatedBy_name} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_status_header_updated_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:structure_report_statusListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_status_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_status_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:structure_report_statusListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_status_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_status_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:structure_report_statusListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_status_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_status_header_description">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:structure_report_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report_status(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report_status" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:structure_report_statusListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report_status(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report_status" />
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
          store.loadstructure_report_statuses()
        }}
      />

    </Container>
  );
})



export default Structure_report_statusListView
