import React, { FC, useEffect } from "react";
import {
  Box, Chip,
  Container, Grid, IconButton, InputAdornment, Paper
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import dayjs from "dayjs";
import CustomTextField from "../../../components/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import CustomButton from "../../../components/Button";
import AutocompleteCustom from "../../../components/Autocomplete";
import DutyPlanLogReturnPopupForm from "./popupReturnForm"
import MainStore from "../../../MainStore";

type DutyPlanLogStatus = {};


const DutyPlanLogListView: FC<DutyPlanLogStatus> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadEmployees();
    store.loadDutyPlanLogs();
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: "application_number",
      headerName: translate("label:DutyPlanLogListView.application_id"),
      flex: 1
    },
    {
      field: "doc_number",
      headerName: translate("label:DutyPlanLogListView.doc_number"),
      flex: 1
    },
    {
      field: "date",
      headerName: translate("label:DutyPlanLogListView.date"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}
        </span>
      )
    },
    {
      field: "from_employee_name",
      headerName: translate("label:DutyPlanLogListView.from_employee_name"),
      flex: 1
    },
    {
      field: "file_names",
      headerName: translate("label:DutyPlanLogListView.document_name"),
      flex: 1
    }
  ];

  let type1: string = "popup";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGrid
        title={translate("label:DutyPlanLogListView.entityTitle")}
        onDeleteClicked={(id: number) => {}}
        columns={columns}
        data={store.data}
        tableName="DutyPlanLog"
        hideActions={!MainStore.isArchive} />;
      break;
    case "popup":
      component = <PopupGrid
        title={translate("label:DutyPlanLogListView.entityTitle")}
        onDeleteClicked={(id: number) => {}}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        hideDeleteButton={!MainStore.isArchive}
        hideAddButton={!MainStore.isArchive}
        hideActions={!MainStore.isArchive}
        tableName="DutyPlanLog" />;
      break;
  }


  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>

      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <CustomTextField
                value={store.filter?.doc_number}
                onChange={(e) => store.filter.doc_number = e.target.value}
                name={"number"}
                label={translate("label:DutyPlanLogListView.searchdoc_number")}
                onKeyDown={(e) => e.keyCode === 13}
                id={"pin"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="number_Search_Btn"
                        onClick={() => store.filter.doc_number = ""}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <AutocompleteCustom
                value={store.filter?.employee_id ?? 0}
                onChange={(e) => store.filter.employee_id = e.target.value}
                name="employee_id"
                data={store.employees}
                fieldNameDisplay={(e) => `${e.last_name} ${e.first_name} ${e.second_name}`}
                id="id_f_employee_id"
                label={translate("label:DutyPlanLogListView.search_employee")}
              />
            </Grid>
          </Grid>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Box sx={{ minWidth: 80 }}>
              <CustomButton
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.loadDutyPlanLogsByFilter();
                }}
              >
                {translate("search")}
              </CustomButton>
            </Box>
            {(store.filter?.doc_number !== "" || store.filter?.employee_id !== 0
            ) && <Box sx={{ m: 1 }}>
                <CustomButton
                  id="clearSearchFilterButton"
                  onClick={() => {
                    store.clearFilter();
                    store.loadDutyPlanLogs();
                  }}
                >
                  {translate("clear")}
                </CustomButton>
              </Box>}
          </Box>
        </Box>
      </Paper>

      {component}

      <DutyPlanLogReturnPopupForm
        openPanel={store.openReturnPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.onCloseReturnPanel()}
        onSaveClick={() => {
          store.onCloseReturnPanel()
          store.loadDutyPlanLogs()
        }}
      />

    </Container>
  );
});


export default DutyPlanLogListView;
