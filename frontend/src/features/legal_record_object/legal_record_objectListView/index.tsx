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
import PopupForm from './../legal_record_objectAddEditView/popupForm'
import styled from 'styled-components';


type legal_record_objectListViewProps = {
  idMain:number
};


const Legal_record_objectListView: FC<legal_record_objectListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  
  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadlegal_record_objects()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    
    // {
    //   field: 'created_at',
    //   headerName: translate("label:legal_record_objectListView.created_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_record_object_column_created_at"> {param.row.created_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_record_object_header_created_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_at',
    //   headerName: translate("label:legal_record_objectListView.updated_at"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_record_object_column_updated_at"> {param.row.updated_at} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_record_object_header_updated_at">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'created_by',
    //   headerName: translate("label:legal_record_objectListView.created_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_record_object_column_created_by"> {param.row.created_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_record_object_header_created_by">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'updated_by',
    //   headerName: translate("label:legal_record_objectListView.updated_by"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_legal_record_object_column_updated_by"> {param.row.updated_by} </div>),
    //   renderHeader: (param) => (<div data-testid="table_legal_record_object_header_updated_by">{param.colDef.headerName}</div>)
    // },
    {
      field: 'id_object',
      headerName: translate("label:legal_record_objectListView.id_object"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_legal_record_object_column_id_object"> {param.row.id_object} </div>),
      renderHeader: (param) => (<div data-testid="table_legal_record_object_header_id_object">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:legal_record_objectListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletelegal_record_object(id)}
        columns={columns}
        data={store.data}
        tableName="legal_record_object" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:legal_record_objectListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletelegal_record_object(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="legal_record_object" />
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
          store.loadlegal_record_objects()
        }}
      />

    </Container>
  );
})



export default Legal_record_objectListView
