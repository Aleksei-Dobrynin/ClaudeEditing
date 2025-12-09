import { FC, useEffect } from 'react';
import {
  Container,
  Checkbox,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Step_required_documentPopupForm from '../step_required_documentAddEditView/popupForm'
import styled from 'styled-components';


type step_required_documentListViewProps = {
  idMain : number
};


const step_required_documentListView: FC<step_required_documentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadstep_required_documents()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    
    {
      field: 'document_type_id',
      headerName: translate("label:step_required_documentListView.document_type_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_required_document_column_document_type_id"> {param.row.document_type_name} </div>),
      renderHeader: (param) => (<div data-testid="table_step_required_document_header_document_type_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_required',
      headerName: translate("label:step_required_documentListView.is_required"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_step_required_document_column_is_required">
          <Checkbox 
            checked={!!param.row.is_required} 
            disabled 
            size="small"
          />
        </div>
      ),
      renderHeader: (param) => (<div data-testid="table_step_required_document_header_is_required">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:step_required_documentListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_required_document_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_step_required_document_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:step_required_documentListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_step_required_document_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_step_required_document_header_updated_at">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:step_required_documentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestep_required_document(id)}
        columns={columns}
        data={store.data}
        tableName="step_required_document" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:step_required_documentListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestep_required_document(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="step_required_document" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Step_required_documentPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        step_id ={store.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadstep_required_documents()
        }}
      />

    </Container>
  );
})



export default step_required_documentListView