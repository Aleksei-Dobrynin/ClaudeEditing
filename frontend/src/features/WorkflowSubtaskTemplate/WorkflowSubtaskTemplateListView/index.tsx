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
import WorkflowSubtaskTemplatePopupForm from './../WorkflowSubtaskTemplateAddEditView/popupForm';

type WorkflowSubtaskTemplateListViewProps = {
  idWorkflowTaskTemplate: number;
};


const WorkflowSubtaskTemplateListView: FC<WorkflowSubtaskTemplateListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idWorkflowTaskTemplate !== props.idWorkflowTaskTemplate) {
      store.idWorkflowTaskTemplate = props.idWorkflowTaskTemplate
    }
    store.loadWorkflowSubtaskTemplatesByWorkflowTaskTemplate()
    return () => {
      store.clearStore()
    }
  }, [props.idWorkflowTaskTemplate])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:WorkflowSubtaskTemplateListView.name"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:WorkflowSubtaskTemplateListView.description"),
      flex: 1
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:WorkflowSubtaskTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteWorkflowSubtaskTemplate(id)}
        columns={columns}
        data={store.data}
        tableName="WorkflowSubtaskTemplate" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:WorkflowSubtaskTemplateListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteWorkflowSubtaskTemplate(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="WorkflowSubtaskTemplate" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <WorkflowSubtaskTemplatePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idWorkflowTaskTemplate={store.idWorkflowTaskTemplate}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadWorkflowSubtaskTemplatesByWorkflowTaskTemplate()
        }}
      />

    </Container>
  );
})




export default WorkflowSubtaskTemplateListView
