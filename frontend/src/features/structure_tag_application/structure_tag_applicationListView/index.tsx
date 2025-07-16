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
import Structure_tag_applicationPopupForm from './../structure_tag_applicationAddEditView/popupForm'
import styled from 'styled-components';


type structure_tag_applicationListViewProps = {
  idMain: number;
};


const structure_tag_applicationListView: FC<structure_tag_applicationListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadstructure_tag_applications()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'structure_tag_id',
      headerName: translate("label:structure_tag_applicationListView.structure_tag_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_application_column_structure_tag_id"> {param.row.structure_tag_id} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_application_header_structure_tag_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'application_id',
      headerName: translate("label:structure_tag_applicationListView.application_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_application_column_application_id"> {param.row.application_id} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_application_header_application_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:structure_tag_applicationListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_application_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_application_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:structure_tag_applicationListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_application_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_application_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:structure_tag_applicationListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_application_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_application_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:structure_tag_applicationListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_application_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_application_header_updated_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'structure_id',
      headerName: translate("label:structure_tag_applicationListView.structure_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_structure_tag_application_column_structure_id"> {param.row.structure_id} </div>),
      renderHeader: (param) => (<div data-testid="table_structure_tag_application_header_structure_id">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:structure_tag_applicationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_tag_application(id)}
        columns={columns}
        data={store.data}
        tableName="structure_tag_application" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:structure_tag_applicationListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletestructure_tag_application(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="structure_tag_application" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Structure_tag_applicationPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadstructure_tag_applications()
        }}
      />

    </Container>
  );
})



export default structure_tag_applicationListView
