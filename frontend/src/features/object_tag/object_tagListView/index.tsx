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
import Object_tagPopupForm from './../object_tagAddEditView/popupForm'
import styled from 'styled-components';


type object_tagListViewProps = {
};


const object_tagListView: FC<object_tagListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadobject_tags()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:object_tagListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_object_tag_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_object_tag_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:object_tagListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_object_tag_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_object_tag_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:object_tagListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_object_tag_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_object_tag_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:object_tagListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_object_tag_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_object_tag_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:object_tagListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_object_tag_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_object_tag_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:object_tagListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_object_tag_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_object_tag_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:object_tagListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_object_tag_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_object_tag_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:object_tagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteobject_tag(id)}
        columns={columns}
        data={store.data}
        tableName="object_tag" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:object_tagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteobject_tag(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="object_tag" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Object_tagPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadobject_tags()
        }}
      />

    </Container>
  );
})



export default object_tagListView
