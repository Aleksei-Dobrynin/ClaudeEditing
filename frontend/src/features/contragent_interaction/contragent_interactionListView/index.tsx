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
import Contragent_interactionPopupForm from './../contragent_interactionAddEditView/popupForm'
import styled from 'styled-components';
import contragent_store from '../contragent_interaction2AddEditView/store';


type contragent_interactionListViewProps = {
  idMain: number;
};


const Contragent_interactionListView: FC<contragent_interactionListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
      contragent_store.customParrent = `user/Application/addedit?id=${props.idMain}`
    }
    store.loadcontragent_interactions()
    return () => store.clearStore()
  }, [props.idMain])


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
    // {
    //   field: 'progress',
    //   headerName: translate("label:contragent_interactionListView.progress"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_contragent_interaction_column_progress"> {param.row.progress} </div>),
    //   renderHeader: (param) => (<div data-testid="table_contragent_interaction_header_progress">{param.colDef.headerName}</div>)
    // },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:contragent_interactionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletecontragent_interaction(id)}
        addButtonClick={()=>{store.onEditClicked(0)}}
        columns={columns}
        data={store.data}
        tableName="contragent_interaction" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:contragent_interactionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletecontragent_interaction(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="contragent_interaction" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Contragent_interactionPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        application_id={props.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadcontragent_interactions()
        }}
      />

    </Container>
  );
})



export default Contragent_interactionListView
