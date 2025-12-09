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
import ArchiveLogPopupForm from "../ArchiveLogAddEditView/popupForm"
import ArchiveLogReturnPopupForm from "./popupReturnForm"
import MainStore from "../../../MainStore";

type ArchiveLogStatus = {};


const ArchiveLogListView: FC<ArchiveLogStatus> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadEmployees();
    store.loadArchiveLogs();
    store.loadStatuses();
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: "doc_number",
      headerName: translate("label:ArchiveLogListView.doc_number"),
      flex: 1
    },
    {
      field: "address",
      headerName: translate("label:ArchiveLogListView.address"),
      flex: 1
    },
    {
      field: "status_id",
      headerName: translate("label:ArchiveLogListView.status_id"),
      flex: 1,
      minWidth: 280,
      renderCell: (params) => (
        store.ArchiveLogStatuses.map(x => {
          return <Chip
            sx={{
              m: 0.5,
              bgcolor: params.value === x.id ? 'primary.main' : 'grey.300',
              cursor: params.value === x.id ? 'not-allowed' : 'pointer',
            }}
            variant="outlined"
            label={x.name}
            clickable={params.value !== x.id}
            onClick={() => {
              if (MainStore.isArchive) {
                if (x.code == 'returned') {
                  store.onOpenReturnPanel(params.row.id);
                } else {
                  store.changeStatusArchiveLog(params.row.id, x.id);
                }
              }
            }}
          />
        }
        ))
    },
    {
      field: "date_take",
      headerName: translate("label:ArchiveLogListView.date_take"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}
        </span>
      )
    },
    {
      field: "take_employee_name",
      headerName: translate("label:ArchiveLogListView.take_employee_id"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? `${params.value} - ${params.row?.take_structure_name ?? ''}` : ''}
        </span>
      )
    },
    {
      field: "return_employee_name",
      headerName: translate("label:ArchiveLogListView.return_employee_id"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? `${params.value} - ${params.row?.return_structure_name ?? ''}` : ''}
        </span>
      )
    },
    {
      field: "date_return",
      headerName: translate("label:ArchiveLogListView.date_return"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}
        </span>
      )
    },
    {
      field: "deadline",
      headerName: translate("label:ArchiveLogListView.deadline"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD.MM.YYYY HH:mm") : ""}
        </span>
      )
    },
  ];

  let type1: string = "popup";
  let component = null;
  switch (type1) {
    case "form":
      component = <PageGrid
        title={translate("label:ArchiveLogListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteArchiveLog(id)}
        columns={columns}
        data={store.data}
        tableName="ArchiveLog"
        hideActions={!MainStore.isArchive} />;
      break;
    case "popup":
      component = <PopupGrid
        title={translate("label:ArchiveLogListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteArchiveLog(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        hideDeleteButton={!MainStore.isArchive}
        hideAddButton={!MainStore.isArchive}
        hideActions={!MainStore.isArchive}
        tableName="ArchiveLog" />;
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
                label={translate("label:ArchiveLogListView.searchdoc_number")}
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
                label={translate("label:ArchiveLogListView.search_employee")}
              />
            </Grid>
          </Grid>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Box sx={{ minWidth: 80 }}>
              <CustomButton
                variant="contained"
                id="searchFilterButton"
                onClick={() => {
                  store.loadArchiveLogsByFilter();
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
                    store.loadArchiveLogs();
                  }}
                >
                  {translate("clear")}
                </CustomButton>
              </Box>}
          </Box>
        </Box>
      </Paper>

      {component}

      <ArchiveLogPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadArchiveLogs()
        }}
      />

      <ArchiveLogReturnPopupForm
        openPanel={store.openReturnPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.onCloseReturnPanel()}
        onSaveClick={() => {
          store.onCloseReturnPanel()
          store.loadArchiveLogs()
        }}
      />

    </Container>
  );
});


export default ArchiveLogListView;
