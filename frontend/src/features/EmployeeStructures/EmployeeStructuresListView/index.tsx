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
import EmployeeInStructurePopupForm from './../EmployeeStructuresAddEditView/popupForm';
import dayjs from "dayjs";

type EmployeeInStructureListViewProps = {
  // idStructure: number;
  idEmployee: number;
};


const EmployeeInStructureListView: FC<EmployeeInStructureListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idEmployee !== props.idEmployee) {
      store.idEmployee = props.idEmployee
    }
    store.loadEmployeeInStructuresByStructure()
    return () => store.clearStore()
  }, [props.idEmployee])

  const columns: GridColDef[] = [
    {
      field: 'structure_name',
      headerName: translate("label:EmployeeInStructureListView.structure_name"),
      flex: 1
    },
    {
      field: 'date_start',
      headerName: translate("label:EmployeeInStructureListView.date_start"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}
        </span>
      )
    },
    {
      field: 'date_end',
      headerName: translate("label:EmployeeInStructureListView.date_end"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}
        </span>
      )
    },
    {
      field: 'post_name',
      headerName: translate("label:EmployeeInStructureListView.post_name"),
      flex: 1,
    },
    {
      field: 'is_temporary',
      headerName: translate("label:EmployeeInStructureListView.is_temporary"),
      flex: 1,
      renderCell: (params) => (
        <Checkbox checked={params.value} disabled />
      )
    }
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:EmployeeInStructureListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteEmployeeInStructure(id)}
        columns={columns}
        data={store.data}
        tableName="EmployeeInStructure" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("Место работы")}
        onDeleteClicked={(id: number) => store.deleteEmployeeInStructure(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="EmployeeInStructure" />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <EmployeeInStructurePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idEmployee={props.idEmployee}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadEmployeeInStructuresByStructure()
        }}
      />

    </Container>
  );
})




export default EmployeeInStructureListView
