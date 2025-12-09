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
import Work_dayPopupForm from './../work_dayAddEditView/popupForm'
import styled from 'styled-components';
import dayjs from 'dayjs';
import addEditStore from './../work_dayAddEditView/store'


type work_dayListViewProps = {
  idMain: number;
};


const work_dayListView: FC<work_dayListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadwork_days()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [

    {
      field: 'week_number',
      headerName: translate("label:work_dayListView.week_number"),
      flex: 1,
      renderCell: (param) => {
        const day = addEditStore.Days.find(x => x.id === param.row.week_number)?.name
        return <div data-testid="table_work_day_column_week_number"> {day} </div>
      },
      renderHeader: (param) => (<div data-testid="table_work_day_header_week_number">{param.colDef.headerName}</div>)
    },
    {
      field: 'time_start',
      headerName: translate("label:work_dayListView.time_start"),
      flex: 1,
      renderCell: (param) => {
        let day = dayjs(param.row.time_start ?? null)
        return <div data-testid="table_work_schedule_exception_column_date_end"> {day.format("HH:mm")} </div>
      },
      renderHeader: (param) => (<div data-testid="table_work_day_header_time_start">{param.colDef.headerName}</div>)
    },
    {
      field: 'time_end',
      headerName: translate("label:work_dayListView.time_end"),
      flex: 1,
      renderCell: (param) => {
        let day = dayjs(param.row.time_end ?? null)
        return <div data-testid="table_work_schedule_exception_column_date_end"> {day.format("HH:mm")} </div>
      },
      renderHeader: (param) => (<div data-testid="table_work_day_header_time_end">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:work_dayListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletework_day(id)}
        columns={columns}
        data={store.data}
        tableName="work_day" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:work_dayListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletework_day(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="work_day" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Work_dayPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        schedule_id={props.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadwork_days()
        }}
      />

    </Container>
  );
})



export default work_dayListView
