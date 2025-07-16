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
import Work_schedule_exceptionPopupForm from './../work_schedule_exceptionAddEditView/popupForm'
import styled from 'styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { date } from 'yup';


type work_schedule_exceptionListViewProps = {
  idMain: number;
};


const work_schedule_exceptionListView: FC<work_schedule_exceptionListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (store.idMain !== props.idMain) {
      store.idMain = props.idMain
    }
    store.loadwork_schedule_exceptions()
    return () => store.clearStore()
  }, [props.idMain])


  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:work_schedule_exceptionListView.name"),
      flex: 1,
      renderCell: (param) => {
        return <div data-testid="table_work_schedule_exception_column_name"> {param.row.name} </div>
      },
      renderHeader: (param) => (<div data-testid="table_work_schedule_exception_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'date_start',
      headerName: translate("label:work_schedule_exceptionListView.date_start"),
      flex: 1,
      renderCell: (param) => {
        let day = dayjs(param.row.date_start ?? null)
        return <div data-testid="table_work_schedule_exception_column_date_start"> {day.format("DD.MM.YYYY")} </div>
      },
      renderHeader: (param) => (<div data-testid="table_work_schedule_exception_header_date_start">{param.colDef.headerName}</div>)
    },
    {
      field: 'date_end',
      headerName: translate("label:work_schedule_exceptionListView.date_end"),
      flex: 1,
      renderCell: (param) => {
        let day = dayjs(param.row.date_end ?? null)
        return <div data-testid="table_work_schedule_exception_column_date_end"> {day.format("DD.MM.YYYY")} </div>
      },
      renderHeader: (param) => (<div data-testid="table_work_schedule_exception_header_date_end">{param.colDef.headerName}</div>)
    },
    {
      field: 'time_start',
      headerName: translate("label:work_schedule_exceptionListView.time_start"),
      flex: 1,
      renderCell: (param) => {
        let day = dayjs(param.row.time_start ?? null)
        let date = "";
        if (day?.isValid && day?.isValid()) {
          date = day.format("HH:mm")
        }
        return <div data-testid="table_work_schedule_exception_column_time_start"> {date} </div>
      },
      renderHeader: (param) => (<div data-testid="table_work_schedule_exception_header_time_start">{param.colDef.headerName}</div>)
    },
    {
      field: 'time_end',
      headerName: translate("label:work_schedule_exceptionListView.time_end"),
      flex: 1,
      renderCell: (param) => {
        let day = dayjs(param.row.time_end ?? null)
        let date = "";
        if (day?.isValid && day?.isValid()) {
          date = day.format("HH:mm")
        }
        return <div data-testid="table_work_schedule_exception_column_time_end">{date} </div>
      },
      renderHeader: (param) => (<div data-testid="table_work_schedule_exception_header_time_end">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_holiday',
      headerName: translate("label:work_schedule_exceptionListView.is_holiday"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_work_schedule_exception_column_is_holiday"> <Checkbox checked={param.row.is_holiday} disabled /> </div>),
      renderHeader: (param) => (<div data-testid="table_work_schedule_exception_header_is_holiday">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:work_schedule_exceptionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletework_schedule_exception(id)}
        columns={columns}
        data={store.data}
        tableName="work_schedule_exception" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:work_schedule_exceptionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletework_schedule_exception(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="work_schedule_exception" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Work_schedule_exceptionPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        schedule_id={props.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadwork_schedule_exceptions()
        }}
      />

    </Container>
  );
})



export default work_schedule_exceptionListView
