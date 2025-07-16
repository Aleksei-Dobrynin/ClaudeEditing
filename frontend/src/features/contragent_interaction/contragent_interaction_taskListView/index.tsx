import { FC, useEffect } from 'react';
import {
  Box,
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Contragent_interactionPopupForm from './../contragent_interaction_taskAddEditView/popupForm'
import styled from 'styled-components';


type contragent_interactionListViewProps = {
  task_id: number;
  application_id: number;
};


const Contragent_interactionListView: FC<contragent_interactionListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.task_id !== props.task_id) {
      store.task_id = props.task_id
    }
    store.loadcontragent_interactions()
    return () => store.clearStore()
  }, [props.task_id])


  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:contragent_interactionListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'task_id',
      headerName: translate("label:contragent_interactionListView.task_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_task_id"> {param.row.task_name} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_task_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'contragent_id',
      headerName: translate("label:contragent_interactionListView.contragent_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_contragent_id"> {param.row.contragent_name} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_contragent_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:contragent_interactionListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_contragent_interaction_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_description">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <Box sx={{ mt: 1 }}>
      <PopupGrid
        title={translate("label:contragent_interactionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletecontragent_interaction(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="contragent_interaction" />

      <Contragent_interactionPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        application_id={props.application_id}
        task_id={props.task_id}
        onBtnCancelClick={() => {
          store.closePanel()
          store.loadcontragent_interactions()
        }}
        onSaveClick={() => {
          store.closePanel()
          store.loadcontragent_interactions()
        }}
      />

    </Box>
  );
})



export default Contragent_interactionListView
