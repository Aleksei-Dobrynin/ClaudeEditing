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
import Release_videoPopupForm from './../release_videoAddEditView/popupForm'
import styled from 'styled-components';


type release_videoListViewProps = {
  idMain: number
};


const release_videoListView: FC<release_videoListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadrelease_videos()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'file_id',
      headerName: translate("label:release_videoListView.file_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_video_column_file_id"> {param.row.file_id} </div>),
      renderHeader: (param) => (<div data-testid="table_release_video_header_file_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:release_videoListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_video_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_release_video_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:release_videoListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_video_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_release_video_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:release_videoListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_video_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_release_video_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:release_videoListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_video_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_release_video_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:release_videoListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_video_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_release_video_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:release_videoListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleterelease_video(id)}
        columns={columns}
        data={store.data}
        tableName="release_video" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:release_videoListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleterelease_video(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="release_video" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Release_videoPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadrelease_videos()
        }}
      />

    </Container>
  );
})



export default release_videoListView
