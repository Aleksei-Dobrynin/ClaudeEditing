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
import Release_seenPopupForm from './../release_seenAddEditView/popupForm'
import styled from 'styled-components';


type release_seenListViewProps = {
  idMain: number;
};


const release_seenListView: FC<release_seenListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadrelease_seens()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'user_id',
      headerName: translate("label:release_seenListView.user_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_seen_column_user_id"> {param.row.user_id} </div>),
      renderHeader: (param) => (<div data-testid="table_release_seen_header_user_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'date_issued',
      headerName: translate("label:release_seenListView.date_issued"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_seen_column_date_issued"> {param.row.date_issued} </div>),
      renderHeader: (param) => (<div data-testid="table_release_seen_header_date_issued">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:release_seenListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_seen_column_created_at"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_release_seen_header_created_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_at',
      headerName: translate("label:release_seenListView.updated_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_seen_column_updated_at"> {param.row.updated_at} </div>),
      renderHeader: (param) => (<div data-testid="table_release_seen_header_updated_at">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_by',
      headerName: translate("label:release_seenListView.created_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_seen_column_created_by"> {param.row.created_by} </div>),
      renderHeader: (param) => (<div data-testid="table_release_seen_header_created_by">{param.colDef.headerName}</div>)
    },
    {
      field: 'updated_by',
      headerName: translate("label:release_seenListView.updated_by"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_seen_column_updated_by"> {param.row.updated_by} </div>),
      renderHeader: (param) => (<div data-testid="table_release_seen_header_updated_by">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:release_seenListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleterelease_seen(id)}
        columns={columns}
        data={store.data}
        tableName="release_seen" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:release_seenListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleterelease_seen(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="release_seen" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Release_seenPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadrelease_seens()
        }}
      />

    </Container>
  );
})



export default release_seenListView
