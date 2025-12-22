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
import PopupForm from './../step_partnerAddEditView/popupForm'
import styled from 'styled-components';


type step_partnerListViewProps = {
  idMain: number;
};


const step_partnerListView: FC<step_partnerListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadstep_partners()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    
    {
      field: 'partner_id',
      headerName: translate("label:step_partnerListView.partner_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_partner_column_partner_id"> {param.row.partner_id} </div>),
      renderHeader: (param) => (<div data-testid="table_step_partner_header_partner_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'role',
      headerName: translate("label:step_partnerListView.role"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_partner_column_role"> {param.row.role} </div>),
      renderHeader: (param) => (<div data-testid="table_step_partner_header_role">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_required',
      headerName: translate("label:step_partnerListView.is_required"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_partner_column_is_required"> {param.row.is_required} </div>),
      renderHeader: (param) => (<div data-testid="table_step_partner_header_is_required">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:step_partnerListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_partner_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_step_partner_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:step_partnerListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_partner_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_step_partner_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:step_partnerListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_partner_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_step_partner_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:step_partnerListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_partner_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_step_partner_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:step_partnerListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestep_partner(id)}
        columns={columns}
        data={store.effectiveData}
        tableName="step_partner" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:step_partnerListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestep_partner(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.effectiveData}
        tableName="step_partner" />
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
          store.loadstep_partners()
        }}
      />

    </Container>
  );
})



export default step_partnerListView
