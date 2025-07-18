import { FC, useEffect } from "react";
import {
  Container,
  Grid
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import PopupGrid from "components/PopupGrid";
import dayjs from "dayjs";
import DateField from "components/DateField";
import CustomButton from "components/Button";
import AutocompleteCustom from "components/Autocomplete";
// import HistoryTablePopupForm from './../HistoryTableAddEditView/popupForm';

type HistoryTableListViewProps = {
  ApplicationID: number;
};


const HistoryTableListView: FC<HistoryTableListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.ApplicationID !== props.ApplicationID) {
      store.ApplicationID = props.ApplicationID
    }
    store.doLoad();
    return () => {
      store.clearStore();
    };
  }, [props.ApplicationID]);

  const formatJson = (jsonString, table) => {
    try {
      const jsonObject = JSON.parse(jsonString);
      return (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {Object.entries(jsonObject).map(([key, value], index) => (
            <div key={index}>
              <strong>{translate(`label:${table}ListView.${key}`)}: </strong> {value ? String(value) : ""}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return <div>Error parsing JSON</div>;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "entity_type",
      headerName: translate("label:HistoryTableListView.entity_type"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {translate(`label:${params.value}ListView.entityTitle`)}
        </span>
      )
    },
    {
      field: "operation",
      headerName: translate("label:HistoryTableListView.operation"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {translate(`label:HistoryTableListView.db_action_${params.value}`)}
        </span>
      )
    },
    {
      field: "created_at",
      headerName: translate("Время"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}
        </span>
      )
    },
    {
      field: "created_by_name",
      headerName: translate("Сотрудник"),
      flex: 1
    },
    {
      field: "old_value",
      headerName: translate("label:HistoryTableListView.old_value"),
      flex: 3,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {params.value ? formatJson(params.value, params.row.entity_type) : ""}
        </div>
      )
    },
    {
      field: "new_value",
      headerName: translate("label:HistoryTableListView.new_value"),
      flex: 3,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {params.value ? formatJson(params.value, params.row.entity_type) : ""}
        </div>
      )
    },
  ];

  let type1: string = "form";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGrid
        title={translate("label:HistoryTableListView.entityTitle")}
        columns={columns}
        data={store.data}
        customHeader={<>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <AutocompleteCustom
                value={store.employee_id}
                onChange={(event) => store.changeApplications(event)}
                name="employee_id"
                data={store.Employees}
                fieldNameDisplay={(employee) => `${employee.last_name} ${employee.first_name} ${employee.second_name}`}
                id="employee_id"
                label={translate("Сотрудник")}
                helperText={""}
                error={false}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mb: 1 }}>
              <DateField
                value={store.date_start}
                onChange={(event) => store.changeApplications(event)}
                name="date_start"
                id="date_start"
                helperText=""
                label={translate("label:Dashboard.startDate")}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DateField
                value={store.date_end}
                onChange={(event) => store.changeApplications(event)}
                name="date_end"
                id="date_end"
                helperText=""
                label={translate("label:Dashboard.endDate")}
              />
            </Grid>
            <Grid item xs={12} md={3} display={"flex"}>
              <CustomButton sx={{ mr: 1 }} variant="contained" onClick={() => store.loadHistoryTables()} >
                Применить
              </CustomButton>
              {(store.employee_id != 0 || store.date_start != null || store.date_end != null) &&
                <CustomButton onClick={() => store.clearFilter()}>Очистить</CustomButton>
              }
            </Grid>
          </Grid>
        </>
        }
        hideAddButton={true}
        hideActions={true}
        getRowHeight={() => 'auto'}
        tableName="HistoryTable" />;
      break;
    case "popup":
      component = <PopupGrid
        title={translate("label:HistoryTableListView.entityTitle")}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="HistoryTable"
        onDeleteClicked={() => {
        }} />;
      break;
  }


  return (
    <div>



      {component}

      {/*<HistoryTablePopupForm*/}
      {/*  openPanel={store.openPanel}*/}
      {/*  id={store.currentId}*/}
      {/*  onBtnCancelClick={() => store.closePanel()}*/}
      {/*  onSaveClick={() => {*/}
      {/*    store.closePanel()*/}
      {/*    store.loadHistoryTables()*/}
      {/*  }}*/}
      {/*/>*/}

    </div>
  );
});


export default HistoryTableListView;
