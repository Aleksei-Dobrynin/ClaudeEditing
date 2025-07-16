import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import store from "./store";
import React, { FC, useEffect } from "react";
import PopupGrid from 'components/PopupGrid';
type MyEmployeeListProps = {
};


const InactiveEmployeeList: FC<MyEmployeeListProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const columns: GridColDef[] = [
    {
      field: 'employee_name',
      headerName: translate("label:EmployeeInStructureListView.employee_name"),
      flex: 1,
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


  return (
    <PopupGrid
      onDeleteClicked={(id: number) => store.deleteEmployeeInStructure(id)}
      onEditClicked={(id: number) => store.onEditClicked(id)}
      columns={columns}
      hideActions
      hideAddButton
      data={store.data}
      tableName="EmployeeInStructure" />
  );
})

export default InactiveEmployeeList;