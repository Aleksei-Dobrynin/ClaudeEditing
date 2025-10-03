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
import Event_typePopupForm from './../EventTypeAddEditView/popupForm'
import styled from 'styled-components';

type event_typeListViewProps = {
};

const event_typeListView: FC<event_typeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadevent_types()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:event_typeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_event_type_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_event_type_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:event_typeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_event_type_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_event_type_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:event_typeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_event_type_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_event_type_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'name_kg',
      headerName: translate("label:event_typeListView.name_kg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_event_type_column_name_kg"> {param.row.name_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_event_type_header_name_kg">{param.colDef.headerName}</div>)
    },
    {
      field: 'description_kg',
      headerName: translate("label:event_typeListView.description_kg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_event_type_column_description_kg"> {param.row.description_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_event_type_header_description_kg">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:event_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteevent_type(id)}
        columns={columns}
        data={store.data}
        tableName="event_type" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:event_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteevent_type(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="event_type" />
      break
  }

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Event_typePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadevent_types()
        }}
      />
    </Container>
  );
})

export default event_typeListView