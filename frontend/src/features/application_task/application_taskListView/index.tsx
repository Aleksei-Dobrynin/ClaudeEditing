import { FC, useEffect } from 'react';
import {
  Chip,
  Container
} from "@mui/material";
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Application_taskPopupForm from './../application_taskAddEditView/popupForm'
import styled from 'styled-components';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';

type application_taskListViewProps = {
  idMain: number;
};


const application_taskListView: FC<application_taskListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadapplication_tasks()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:application_taskListView.name"),
      minWidth: 250,
      renderCell: (param) => (<div data-testid="table_application_task_column_name">
        <StyledRouterLink to={`/user/application_task/addedit?id=${param.row.id}`}>{param.row.name} </StyledRouterLink> </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'structure_idNavName',
      headerName: translate("label:application_taskListView.structure_id"),
      flex: 2,
      minWidth: 150,
      renderCell: (param) => (<div data-testid="table_application_task_column_structure_id"> {param.row.structure_idNavName}{param.row.structure_idNavShortName ? ` (${param.row.structure_idNavShortName})` : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_header_structure_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'status_idNavName',
      headerName: translate("label:application_taskListView.status_id"),
      flex: 1,
      renderCell: (param) => (<Chip size="small" label={param.row.status_idNavName} style={{ background: param.row.status_back_color, color: param.row.status_text_color }} />),
      renderHeader: (param) => (<div data-testid="table_application_task_header_status_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'assignees',
      headerName: translate("label:application_taskListView.assignees"),
      flex: 2,
      renderCell: (param) => (<div data-testid="table_application_task_column_assignees"> {param.row.assignees} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_header_assignees">{param.colDef.headerName}</div>)
    },
    {
      field: "task_deadline",
      headerName: translate("label:ApplicationListView.deadline"),
      flex: 1,
      renderCell: (params) => {
        if (!params.value) {
          return (
            <Chip
              size="small"
              label={translate("label:application_taskListView.no_deadline")}
              style={{ background: '#9e9e9e', color: '#ffffff' }}
            />
          );
        }

        const daysLeft = dayjs(params.value).diff(dayjs(), 'day');

        let backgroundColor = '';
        if (daysLeft > 5) {
          backgroundColor = '#4caf50'; // больше 5
        } else if (daysLeft >= 0) {
          backgroundColor = '#ffeb3b'; // меньше 5
        } else {
          backgroundColor = '#f44336'; // дедлайн прошёл
        }

        return (
          <Chip
            size="small"
            label={dayjs(params.value).format('DD.MM.YYYY')}
            style={{ background: backgroundColor }}
          />
        );
      }
    },
  ];

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>

      <PopupGrid
        title={translate("label:application_taskListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_task(id)}
        onEditClicked={(id: number) => {
          store.onEditClicked(id)
        }}
        columns={columns}
        data={store.data}
        tableName="application_task"
      />

      <Application_taskPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idMain={store.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadapplication_tasks()
        }}
      />

    </Container>
  );
})


const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`

export default application_taskListView
