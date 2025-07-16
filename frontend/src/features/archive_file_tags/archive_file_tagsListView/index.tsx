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
import Archive_file_tagsPopupForm from './../archive_file_tagsAddEditView/popupForm'
import styled from 'styled-components';


type archive_file_tagsListViewProps = {
  idMain: number;
};


const archive_file_tagsListView: FC<archive_file_tagsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadarchive_file_tag()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'created_at',
      headerName: translate("label:archive_file_tagsListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_file_tags_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_file_tags_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:archive_file_tagsListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_file_tags_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_file_tags_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:archive_file_tagsListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_file_tags_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_file_tags_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:archive_file_tagsListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_file_tags_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_file_tags_header_updated_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'tag_id',
      headerName: translate("label:archive_file_tagsListView.tag_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archive_file_tags_column_tag_id"> {param.row.tag_id} </div>),
      renderHeader: (param) => (<div data-testid="table_archive_file_tags_header_tag_id">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:archive_file_tagsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchive_file_tags(id)}
        columns={columns}
        data={store.data}
        tableName="archive_file_tags" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:archive_file_tagsListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchive_file_tags(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="archive_file_tags" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      {/* <Archive_file_tagsPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadarchive_file_tag()
        }}
      /> */}

    </Container>
  );
})



export default archive_file_tagsListView
