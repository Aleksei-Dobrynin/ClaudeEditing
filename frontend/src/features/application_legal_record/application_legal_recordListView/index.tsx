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
import PopupForm from './../application_legal_recordAddEditView/popupForm'
import styled from 'styled-components';


type application_legal_recordListViewProps = {
  idMain:number
};


const application_legal_recordListView: FC<application_legal_recordListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadapplication_legal_records()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    
    {
      field: 'id_legalrecord',
      headerName: translate("label:application_legal_recordListView.id_legalrecord"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_legal_record_column_id_legalrecord"> {param.row.id_legalrecord} </div>),
      renderHeader: (param) => (<div data-testid="table_application_legal_record_header_id_legalrecord">{param.colDef.headerName}</div>)
    },
    {
      field: 'id_legalact',
      headerName: translate("label:application_legal_recordListView.id_legalact"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_legal_record_column_id_legalact"> {param.row.id_legalact} </div>),
      renderHeader: (param) => (<div data-testid="table_application_legal_record_header_id_legalact">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:application_legal_recordListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_legal_record_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_application_legal_record_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:application_legal_recordListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_legal_record_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_application_legal_record_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:application_legal_recordListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_legal_record_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_application_legal_record_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:application_legal_recordListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_legal_record_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_application_legal_record_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:application_legal_recordListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_legal_record(id)}
        columns={columns}
        data={store.data}
        tableName="application_legal_record" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:application_legal_recordListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_legal_record(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="application_legal_record" />
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
          store.loadapplication_legal_records()
        }}
      />

    </Container>
  );
})



export default application_legal_recordListView
