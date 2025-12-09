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
import WorkflowPopupForm from './../WorkflowAddEditView/popupForm';
import dayjs from "dayjs";

type WorkflowListViewProps = {};


const WorkflowListView: FC<WorkflowListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadWorkflows()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:WorkflowListView.name"),
      flex: 1
    },
    {
      field: 'is_active',
      headerName: translate("label:WorkflowListView.is_active"),
      flex: 1,
      renderCell: params =>  {
        return <Checkbox checked={params.row.is_active} disabled />
      }
    },
    {
      field: 'date_start',
      headerName: translate("label:WorkflowListView.date_start"),
      flex: 1,
      renderCell: params =>  {
        return <span>{params.row.date_start && dayjs(new Date(params.row.date_start)).format("YYYY.MM.DD")}  </span>
      }
    },
    {
      field: 'date_end',
      headerName: translate("label:WorkflowListView.date_end"),
      flex: 1,
      renderCell: params =>  {
        return <span>{params.row.date_end && dayjs(new Date(params.row.date_end)).format("YYYY.MM.DD")}  </span>
      }
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:WorkflowListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteWorkflow(id)}
        columns={columns}
        data={store.data}
        tableName="Workflow" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:WorkflowListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteWorkflow(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="Workflow" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <WorkflowPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadWorkflows()
        }}
      />

    </Container>
  );
})




export default WorkflowListView
