import { FC, useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import EmployeeInStructurePopupForm from './../EmployeeInStructureAddEditView/popupForm';
import dayjs from "dayjs";
import CustomCheckbox from "../../../components/Checkbox";
import { red } from "@mui/material/colors";
import PopupGrid from "../../../components/PopupGrid";


type EmployeeInStructureListViewProps = {
  idStructure: number;
};


const EmployeeInStructureListView: FC<EmployeeInStructureListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.idStructure !== props.idStructure) {
      store.idStructure = props.idStructure
    }
    store.loadEmployeeInStructuresByStructure()
    return () => store.clearStore()
  }, [props.idStructure])

  const columns: GridColDef[] = [
    {
      field: 'employee_name',
      headerName: translate("label:EmployeeInStructureListView.employee_name"),
      flex: 1,
      renderCell: (params) => {
        const isExpired = dayjs(params.row.date_end).isBefore(dayjs(new Date()));
        return (
          <span style={isExpired ? { color: "red" } : undefined}>
            {params.value}
          </span>
        )
      }
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
      field: 'is_active',
      headerName: translate("label:EmployeeInStructureListView.is_active"),
      flex: 1,
      renderCell: (params) =>  (
          <CustomCheckbox
            id={params.row.id + params.row.date_end}
            value={dayjs(params.row.date_end).isBefore(dayjs(new Date()))}
            onChange = {(e) => ""}
            name ={params.row.id + params.row.date_end}
            disabled
          />
        )
    },
    {
      field: 'post_name',
      headerName: translate("label:EmployeeInStructureListView.post_name"),
      flex: 1,
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
        title={translate("label:EmployeeInStructureListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteEmployeeInStructure(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        hideDeleteButton
        tableName="EmployeeInStructure"
        checkbox={ <CustomCheckbox
          id={`PopUpGridCheckbox`}
          value={store.Checked}
          onChange = {(e) => {
            store.changeChecked()
            store.changeEmployeeActiveOrAll()
          }}
          name ={'FilterCheckbox'}
          label={store.Checked ? `показать  всех` : `показать активных сотрудников`}
        />}
      />
      break
  }


  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}

      <EmployeeInStructurePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idStructure={store.idStructure}
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
