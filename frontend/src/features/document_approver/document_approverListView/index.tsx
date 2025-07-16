import { FC, useEffect } from 'react';
import {
  Checkbox,
  Container
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Document_approverPopupForm from '../document_approverAddEditView/popupForm'
import styled from 'styled-components';


type document_approverListViewProps = {
  idMain: number;
};


const document_approverListView: FC<document_approverListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loaddocument_approvers()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    
    {
      field: 'department_id',
      headerName: translate("label:document_approverListView.department_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_document_approver_column_department_name"> {param.row.department_name} </div>),
      renderHeader: (param) => (<div data-testid="table_document_approver_header_department_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'position_id',
      headerName: translate("label:document_approverListView.position_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_document_approver_column_position_name"> {param.row.position_name} </div>),
      renderHeader: (param) => (<div data-testid="table_document_approver_header_position_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_required',
      headerName: translate("label:document_approverListView.is_required"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_document_approver_column_is_required">
          <Checkbox
            checked={!!param.row.is_required}
            disabled
            size="small"
          />
        </div>
      ),
      renderHeader: (param) => (<div data-testid="table_document_approver_header_is_required">{param.colDef.headerName}</div>)
    },
    {
      field: 'approval_order',
      headerName: translate("label:document_approverListView.approval_order"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_document_approver_column_approval_order"> {param.row.approval_order} </div>),
      renderHeader: (param) => (<div data-testid="table_document_approver_header_approval_order">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:document_approverListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_document_approver_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_document_approver_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:document_approverListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_document_approver_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_document_approver_header_updated_at">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:document_approverListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletedocument_approver(id)}
        columns={columns}
        data={store.data}
        tableName="document_approver" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:document_approverListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletedocument_approver(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="document_approver" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Document_approverPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        step_doc_id={store.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loaddocument_approvers()
        }}
      />

    </Container>
  );
})



export default document_approverListView
