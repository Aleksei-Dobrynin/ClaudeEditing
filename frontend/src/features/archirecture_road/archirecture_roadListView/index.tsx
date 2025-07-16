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
import Archirecture_roadPopupForm from './../archirecture_roadAddEditView/popupForm'
import styled from 'styled-components';


type archirecture_roadListViewProps = {
};


const archirecture_roadListView: FC<archirecture_roadListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadarchirecture_roads()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'from_status_id',
      headerName: translate("label:archirecture_roadListView.from_status_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archirecture_road_column_from_status_id"> {param.row.from_status_id} </div>),
      renderHeader: (param) => (<div data-testid="table_archirecture_road_header_from_status_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'to_status_id',
      headerName: translate("label:archirecture_roadListView.to_status_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archirecture_road_column_to_status_id"> {param.row.to_status_id} </div>),
      renderHeader: (param) => (<div data-testid="table_archirecture_road_header_to_status_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'rule_expression',
      headerName: translate("label:archirecture_roadListView.rule_expression"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archirecture_road_column_rule_expression"> {param.row.rule_expression} </div>),
      renderHeader: (param) => (<div data-testid="table_archirecture_road_header_rule_expression">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:archirecture_roadListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archirecture_road_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_archirecture_road_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'validation_url',
      headerName: translate("label:archirecture_roadListView.validation_url"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archirecture_road_column_validation_url"> {param.row.validation_url} </div>),
      renderHeader: (param) => (<div data-testid="table_archirecture_road_header_validation_url">{param.colDef.headerName}</div>)
    },
    {
      field: 'post_function_url',
      headerName: translate("label:archirecture_roadListView.post_function_url"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archirecture_road_column_post_function_url"> {param.row.post_function_url} </div>),
      renderHeader: (param) => (<div data-testid="table_archirecture_road_header_post_function_url">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_active',
      headerName: translate("label:archirecture_roadListView.is_active"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_archirecture_road_column_is_active"> {param.row.is_active} </div>),
      renderHeader: (param) => (<div data-testid="table_archirecture_road_header_is_active">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:archirecture_roadListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchirecture_road(id)}
        columns={columns}
        data={store.data}
        tableName="archirecture_road" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:archirecture_roadListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletearchirecture_road(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="archirecture_road" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Archirecture_roadPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadarchirecture_roads()
        }}
      />

    </Container>
  );
})



export default archirecture_roadListView
