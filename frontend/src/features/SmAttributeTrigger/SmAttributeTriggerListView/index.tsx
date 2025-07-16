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
import SmAttributeTriggerPopupForm from './../SmAttributeTriggerAddEditView/popupForm'
import styled from 'styled-components';


type SmAttributeTriggerListViewProps = {
  project_id: number;
};


const SmAttributeTriggerListView: FC<SmAttributeTriggerListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.project_id = props.project_id
    store.loadSmAttributeTriggers()
  }, [])


  const columns: GridColDef[] = [
    {
      field: 'attribute_idNavName',
      headerName: translate("label:SmAttributeTriggerListView.attribute_id"),
      flex: 1,
      renderCell: (param) => (<div id={"table_SmAttributeTrigger_column_attribute_id"}> {param.row.attribute_idNavName} </div>),
      renderHeader: (param) => (<div id={"table_SmAttributeTrigger_header_attribute_id"}>{param.colDef?.headerName}</div>)
    },
    {
      field: 'value',
      headerName: translate("label:SmAttributeTriggerListView.value"),
      flex: 1,
      renderCell: (param) => (<div id={"table_SmAttributeTrigger_column_value"}> {param.row.value} </div>),
      renderHeader: (param) => (<div id={"table_SmAttributeTrigger_header_value"}>{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:SmAttributeTriggerListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteSmAttributeTrigger(id)}
        columns={columns}
        data={store.data}
        tableName="SmAttributeTrigger" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:SmAttributeTriggerListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteSmAttributeTrigger(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="SmAttributeTrigger" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <SmAttributeTriggerPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        project_id={store.project_id}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadSmAttributeTriggers()
        }}
      />

    </Container>
  );
})



export default SmAttributeTriggerListView
