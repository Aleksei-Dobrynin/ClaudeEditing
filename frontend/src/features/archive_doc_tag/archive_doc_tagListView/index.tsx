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
import Archive_doc_tagPopupForm from './../archive_doc_tagAddEditView/popupForm'
import styled from 'styled-components';


type archive_doc_tagListViewProps = {
};


const archive_doc_tagListView: FC<archive_doc_tagListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadarchive_doc_tags()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'updated_at',
      headerName: translate("label:archive_doc_tagListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:archive_doc_tagListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:archive_doc_tagListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_updated_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:archive_doc_tagListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:archive_doc_tagListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:archive_doc_tagListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'name_kg',
      headerName: translate("label:archive_doc_tagListView.name_kg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_name_kg"> {param.row.name_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_name_kg">{param.colDef.headerName}</div>)
    },
    {
      field: 'description_kg',
      headerName: translate("label:archive_doc_tagListView.description_kg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_description_kg"> {param.row.description_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_description_kg">{param.colDef.headerName}</div>)
    },
    {
      field: 'text_color',
      headerName: translate("label:archive_doc_tagListView.text_color"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_text_color"> {param.row.text_color} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_text_color">{param.colDef.headerName}</div>)
    },
    {
      field: 'background_color',
      headerName: translate("label:archive_doc_tagListView.background_color"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_background_color"> {param.row.background_color} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_background_color">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:archive_doc_tagListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_doc_tag_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_doc_tag_header_created_at">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:archive_doc_tagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchive_doc_tag(id)}
        columns={columns}
        data={store.data}
        tableName="archive_doc_tag" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:archive_doc_tagListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchive_doc_tag(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="archive_doc_tag" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Archive_doc_tagPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadarchive_doc_tags()
        }}
      />

    </Container>
  );
})



export default archive_doc_tagListView
