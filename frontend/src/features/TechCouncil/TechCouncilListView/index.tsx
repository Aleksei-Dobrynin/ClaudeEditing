import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Container, Grid, IconButton, InputAdornment, Paper
} from "@mui/material";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TechCouncilPopupForm from "./../TechCouncilAddEditView/popupForm";
import CustomButton from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import CustomTextField from "../../../components/TextField";

type TechCouncilListViewProps = {};

const TechCouncilListView: FC<TechCouncilListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const handleRowSelectionChange = (newSelection: any) => {
    setSelectedRows(newSelection);
  };

  useEffect(() => {
    store.loadTechCouncils();
    return () => {
      store.clearStore();
    };
  }, []);

  const filteredData = store.filterData();

  const handlePrintSelected = () => {
    store.onPrintSelectedApplication(selectedRows)
  };


  const columns: GridColDef[] = [
    {
      field: "application_number",
      headerName: translate("label:TechCouncilListView.application_number"),
      flex: 1
    },
    {
      field: "full_name",
      headerName: translate("label:TechCouncilListView.full_name"),
      flex: 1
    },
    {
      field: "address",
      headerName: translate("label:TechCouncilListView.address"),
      flex: 1
    },
    {
      field: "tech_decision_name",
      headerName: translate("label:TechCouncilListView.tech_decision_name"),
      flex: 1
    },
    {
      field: "details",
      headerName: "Начальники (Всего / Вынесли решение)",
      flex: 1,
      renderCell: (params) => {
        const details = params.row.details || [];
        const totalChiefs = details.length;
        const resolvedChiefs = details.filter(
          (detail: any) => detail.decision_type_name && detail.decision_type_name !== ""
        ).length;
        return `${totalChiefs} / ${resolvedChiefs}`;
      }
    },
    {
      field: "application_id",
      headerName: translate("common:view"),
      flex: 1,
      renderCell: (params) => (
        <CustomButton
          variant="contained"
          id="id_TechCouncilSaveButton"
          onClick={() => navigate(`/user/TechCouncilApplication?id=${params.value}`)}
        >
          {translate("common:view")}
        </CustomButton>
      )
    },
    {
      field: "application_id-print",
      headerName: translate("common:view"),
      flex: 1,
      renderCell: (params) => (
        <CustomButton
          variant="contained"
          sx={{ ml: 2 }}
          id="id_TechCouncilPrintButton"
          name={"TechCouncilPrintButton"}
          onClick={() => {
            store.onPrintCommentSheet(params.row.application_id);
          }}
        >
          {translate("common:print")}
        </CustomButton>
      )
    }
  ];

  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
        <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <CustomTextField
                value={store.search}
                onChange={(e) => store.search = e.target.value}
                name={"searchField"}
                label={translate("Поиск заявки")}
                id={"search"}
              />
            </Grid>
            <Grid item md={6} xs={12}>
            </Grid>
            <Grid item md={2} xs={12}>
              {selectedRows.length > 0 && (
                <CustomButton variant="contained"
                              onClick={handlePrintSelected}>
                  {translate("common:print_selected")}
                </CustomButton>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 30 }}>
        <h1>{translate("label:TechCouncilListView.entityTitle")}</h1>
        <DataGrid
          rows={filteredData}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleRowSelectionChange}
          slotProps={{
            pagination: {
              labelRowsPerPage: translate("rowsPerPage")
            }
          }}
        />
      </Paper>

      <TechCouncilPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idMain={store.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadTechCouncils();
        }}
      />
    </Container>
  );
});


export default TechCouncilListView;
