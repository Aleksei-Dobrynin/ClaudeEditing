import React, { FC, useEffect } from 'react';
import {
  Checkbox, Chip,
  Container
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Application_taskPopupForm from './../application_taskAddEditView/popupForm'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

type application_taskListViewProps = {
  idMain: number;
};


const Application_taskListView: FC<application_taskListViewProps> = observer((props) => {
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
      renderCell: (param) => (<div data-testid="table_application_task_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'structure_idNavName',
      headerName: translate("label:application_taskListView.structure_id"),
      flex: 1,
      minWidth: 150,
      renderCell: (param) => (<div data-testid="table_application_task_column_structure_id"> {param.row.structure_idNavName} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_header_structure_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'comment',
      headerName: translate("label:application_taskListView.comment"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_task_column_comment"> {param.row.comment} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_header_comment">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'is_required',
    //   headerName: translate("label:application_taskListView.is_required"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_application_task_column_is_required"> <Checkbox checked={param.row.is_required} disabled /> </div>),
    //   renderHeader: (param) => (<div data-testid="table_application_task_header_is_required">{param.colDef.headerName}</div>)
    // },
    {
      field: 'status_idNavName',
      headerName: translate("label:application_taskListView.status_id"),
      flex: 1,
      renderCell: (param) => (<Chip size="small" label={param.row.status_idNavName} style={{ background: param.row.status_back_color, color: param.row.status_text_color }} />),
      renderHeader: (param) => (<div data-testid="table_application_task_header_status_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'type_name',
      headerName: translate("label:application_taskListView.type_id"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_application_task_column_type_id"> {param.row.type_name} </div>),
      renderHeader: (param) => (<div data-testid="table_application_task_header_type_id">{param.colDef.headerName}</div>)
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
    // {
    //   field: 'order',
    //   headerName: translate("label:application_taskListView.order"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_application_task_column_order"> {param.row.order} </div>),
    //   renderHeader: (param) => (<div data-testid="table_application_task_header_order">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'progress',
    //   headerName: translate("label:application_taskListView.progress"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_application_task_column_progress"> {param.row.progress} </div>),
    //   renderHeader: (param) => (<div data-testid="table_application_task_header_progress">{param.colDef.headerName}</div>)
    // },
  ];

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>

      <PopupGrid
        title={translate("label:application_taskListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteapplication_task(id)}
        onEditClicked={(id: number) => {
          if(id === 0){
            navigate(`/user/application_task/addedit?id=${id}&application_id=${props.idMain}`)
          }else{
            navigate(`/user/application_task/addedit?id=${id}`)
          }
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



export default Application_taskListView
