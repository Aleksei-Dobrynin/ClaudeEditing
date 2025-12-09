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
import ReleasePopupForm from './../releaseAddEditView/popupForm'
import styled from 'styled-components';
import dayjs from 'dayjs';


type releaseListViewProps = {
};


const releaseListView: FC<releaseListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadreleases()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [
    {
      field: 'number',
      headerName: translate("label:releaseListView.number"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_column_number"> {param.row.number} </div>),
      renderHeader: (param) => (<div data-testid="table_release_header_number">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'description',
    //   headerName: translate("label:releaseListView.description"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_release_column_description"> {param.row.description} </div>),
    //   renderHeader: (param) => (<div data-testid="table_release_header_description">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'description_kg',
    //   headerName: translate("label:releaseListView.description_kg"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_release_column_description_kg"> {param.row.description_kg} </div>),
    //   renderHeader: (param) => (<div data-testid="table_release_header_description_kg">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'code',
    //   headerName: translate("label:releaseListView.code"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_release_column_code"> {param.row.code} </div>),
    //   renderHeader: (param) => (<div data-testid="table_release_header_code">{param.colDef.headerName}</div>)
    // },
    {
      field: 'date_start',
      headerName: translate("label:releaseListView.date_start"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_column_date_start">
        {param.row.date_start ? dayjs(param.row.date_start).format("DD.MM.YYYY HH:mm") : ""}
      </div>),
      renderHeader: (param) => (<div data-testid="table_release_header_date_start">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:releaseListView.created_at"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_release_column_date_start">
        {param.row.created_at ? dayjs(param.row.created_at).format("DD.MM.YYYY HH:mm") : ""}
      </div>),
      renderHeader: (param) => (<div data-testid="table_release_header_created_at">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:releaseListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleterelease(id)}
        columns={columns}
        data={store.data}
        tableName="release" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:releaseListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleterelease(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="release" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <ReleasePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadreleases()
        }}
      />

    </Container>
  );
})



export default releaseListView
