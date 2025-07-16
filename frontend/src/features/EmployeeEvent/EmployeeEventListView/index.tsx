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
import EmployeeEventPopupForm from './../EmployeeEventAddEditView/popupForm';
import dayjs from "dayjs";

type EmployeeEventListViewProps = {
  idEmployee: number;
};


const EmployeeEventListView: FC<EmployeeEventListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idEmployee !== props.idEmployee) {
      store.idEmployee = props.idEmployee
    }
    store.loadEmployeeEvents()
    return () => {
      store.clearStore()
    }
  }, [props.idEmployee])

  const columns: GridColDef[] = [
    {
      field: 'date_start',
      headerName: translate("label:EmployeeEventListView.date_start"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}
        </span>
      )
    },
    {
      field: 'date_end',
      headerName: translate("label:EmployeeEventListView.date_end"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}
        </span>
      )
    },
    {
      field: 'event_type_name',
      headerName: translate("label:EmployeeEventListView.event_type_name"),
      flex: 1
    }
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:EmployeeEventListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteEmployeeEvent(id)}
        columns={columns}
        data={store.data}
        tableName="EmployeeEvent" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:EmployeeEventListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteEmployeeEvent(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="EmployeeEvent" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <EmployeeEventPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idEmployee={store.idEmployee}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadEmployeeEvents()
        }}
      />

    </Container>
  );
})




export default EmployeeEventListView
