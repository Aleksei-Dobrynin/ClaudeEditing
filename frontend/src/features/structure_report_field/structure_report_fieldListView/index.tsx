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
import PopupForm from './../structure_report_fieldAddEditView/popupForm'
import styled from 'styled-components';


type structure_report_fieldListViewProps = {
  idReport: number,
  hideAdd?: boolean 
};


const Structure_report_fieldListView: FC<structure_report_fieldListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    store.idMain = props.idReport
    store.loadstructure_report_fields()
    // return () => {
    //   store.clearStore()
    // }
  }, [props.idReport])


  const columns: GridColDef[] = [
    
    // {
    //   field: 'report_id',
    //   headerName: translate("label:structure_report_fieldListView.report_id"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_field_column_report_id"> {param.row.reportId} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_field_header_report_id">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'field_id',
    //   headerName: translate("label:structure_report_fieldListView.field_id"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_field_column_field_id"> {param.row.fieldId} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_field_header_field_id">{param.colDef.headerName}</div>)
    // },
    {
      field: 'report_item',
      headerName: translate("label:structure_report_fieldListView.report_item"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_column_unit_id"> {param.row.report_item} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_header_unit_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'field_name',
      headerName: translate("label:structure_report_fieldListView.field_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_column_unit_id"> {param.row.field_name} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_header_unit_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'unitName',
      headerName: translate("label:structure_report_fieldListView.unit_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_column_unit_id"> {param.row.unitName} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_header_unit_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'value',
      headerName: translate("label:structure_report_fieldListView.value"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_column_value"> {param.row.value} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_header_value">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:structure_report_fieldListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_column_created_at"> {param.row.createdAt} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:structure_report_fieldListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_report_field_column_updated_at"> {param.row.updatedAt} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_report_field_header_updated_at">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'created_by',
    //   headerName: translate("label:structure_report_fieldListView.created_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_field_column_created_by"> {param.row.createdBy} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_field_header_created_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_by',
    //   headerName: translate("label:structure_report_fieldListView.updated_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_structure_report_field_column_updated_by"> {param.row.updatedBy} </div>),
    //   renderHeader: (param) => (<div data-testid="table_structure_report_field_header_updated_by">{param.colDef.headerName}</div>)
    // },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:structure_report_fieldListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report_field(id)}
        columns={columns}
        data={store.data}
        tableName="structure_report_field" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:structure_report_fieldListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_report_field(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        hideAddButton = {true}
        hideDeleteButton={true}
        tableName="structure_report_field" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <PopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        idReport={props.idReport}
        onSaveClick={() => {
          store.closePanel()
          store.loadstructure_report_fields()
        }}
        
      />

    </Container>
  );
})



export default Structure_report_fieldListView
