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
import Organization_typePopupForm from './../organization_typeAddEditView/popupForm'
import styled from 'styled-components';


type organization_typeListViewProps = {
};


const organization_typeListView: FC<organization_typeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadorganization_types()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:organization_typeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_organization_type_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_organization_type_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:organization_typeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_organization_type_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_organization_type_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:organization_typeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_organization_type_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_organization_type_header_code">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:organization_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteorganization_type(id)}
        columns={columns}
        data={store.data}
        tableName="organization_type" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:organization_typeListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteorganization_type(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="organization_type" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Organization_typePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadorganization_types()
        }}
      />

    </Container>
  );
})



export default organization_typeListView
