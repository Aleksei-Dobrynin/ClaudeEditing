import { FC, useEffect } from 'react';
import {
  Checkbox,
  Container
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import WorkflowTaskTemplatePopupForm from './../WorkflowTaskTemplateAddEditView/popupForm';

type WorkflowTaskTemplateListViewProps = {
  idWorkflow: number;
};


const WorkflowTaskTemplateListView: FC<WorkflowTaskTemplateListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idWorkflow !== props.idWorkflow) {
      store.idWorkflow = props.idWorkflow
    }
    store.loadWorkflowTaskTemplatesByWorkflow()
    return () => {
      store.clearStore()
    }
  }, [props.idWorkflow])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:WorkflowTaskTemplateListView.name"),
      flex: 1
    },
    {
      field: 'order',
      headerName: translate("label:WorkflowTaskTemplateListView.order"),
      flex: 1
    },
    {
      field: 'is_active',
      headerName: translate("label:WorkflowTaskTemplateListView.is_active"),
      flex: 1,
      renderCell: params =>  {
        return <Checkbox checked={params.row.is_active} disabled />
      }
    },
    {
      field: 'is_required',
      headerName: translate("label:WorkflowTaskTemplateListView.is_required"),
      flex: 1,
      renderCell: params =>  {
        return <Checkbox checked={params.row.is_required} disabled />
      }
    },
    {
      field: 'description',
      headerName: translate("label:WorkflowTaskTemplateListView.description"),
      flex: 1
    },
    {
      field: 'structure_name',
      headerName: translate("label:WorkflowTaskTemplateListView.structure_id"),
      flex: 1
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:WorkflowTaskTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteWorkflowTaskTemplate(id)}
        columns={columns}
        data={store.data}
        tableName="WorkflowTaskTemplate" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:WorkflowTaskTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteWorkflowTaskTemplate(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="WorkflowTaskTemplate" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <WorkflowTaskTemplatePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idWorkflow={store.idWorkflow}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadWorkflowTaskTemplatesByWorkflow()
        }}
      />

    </Container>
  );
})




export default WorkflowTaskTemplateListView
