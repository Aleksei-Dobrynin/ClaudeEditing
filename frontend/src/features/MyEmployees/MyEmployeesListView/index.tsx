import React, { FC, useEffect } from 'react';
import {
  Box,
  Container, Paper, Tab, Tabs,
  Tooltip
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import EmployeeInStructurePopupForm from './../../EmployeeInStructureMy/EmployeeInStructureAddEditView/popupForm';
import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import MyEmployeeMtmTabs from "./mtmTabs";

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
  }, [props.idStructure])


  const columns: GridColDef[] = [
    {
      field: 'employee_name',
      headerName: translate("label:EmployeeInStructureListView.employee_name"),
      flex: 1
    },
    {
      field: 'structure_name',
      headerName: translate("label:EmployeeInStructureListView.structure_name"),
      flex: 1,
    },
    {
      field: 'post_name',
      headerName: translate("label:EmployeeInStructureListView.post_name"),
      flex: 1,
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
  ];

  let type1: string = 'popup';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:EmployeeInStructureListView.MyEmployees")}
        onDeleteClicked={(id: number) => store.deleteEmployeeInStructure(id)}
        columns={columns}
        data={store.data}
        tableName="EmployeeInStructure" />
      break
    case 'popup':
      component = <MyEmployeeMtmTabs/>
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
        onSaveClick={ () => {
          store.closePanel()
          store.loadEmployeeInStructuresByStructure()
        }}
      />

    </Container>
  );
})




export default EmployeeInStructureListView
