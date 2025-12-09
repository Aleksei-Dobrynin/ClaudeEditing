import { FC, useEffect } from 'react';
import {
  Checkbox,
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import Work_schedulePopupForm from './../work_scheduleAddEditView/popupForm'
import styled from 'styled-components';


type work_scheduleListViewProps = {
};


const work_scheduleListView: FC<work_scheduleListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadwork_schedules()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:work_scheduleListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_work_schedule_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_work_schedule_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'year',
      headerName: translate("label:work_scheduleListView.year"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_work_schedule_column_year"> {param.row.year} </div>),
      renderHeader: (param) => (<div data-testid="table_work_schedule_header_year">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_active',
      headerName: translate("label:work_scheduleListView.is_active"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_work_schedule_column_is_active"><Checkbox checked={param.row.is_active} disabled /> </div>),
      renderHeader: (param) => (<div data-testid="table_work_schedule_header_is_active">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:work_scheduleListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletework_schedule(id)}
        columns={columns}
        data={store.data}
        tableName="work_schedule" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:work_scheduleListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletework_schedule(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="work_schedule" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Work_schedulePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadwork_schedules()
        }}
      />

    </Container>
  );
})



export default work_scheduleListView
