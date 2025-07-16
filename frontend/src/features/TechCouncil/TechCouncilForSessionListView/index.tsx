import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Container, Tooltip, Paper, Grid
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import PopupGrid from "components/PopupGrid";
import CustomButton from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import AddPopupForm from "./popupForm";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Typography from "@mui/material/Typography";
import CustomTextField from "../../../components/TextField";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";

type TechCouncilListViewProps = {
  idMain: number;
};

const TechCouncilListView: FC<TechCouncilListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translate = t;
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const handleRowSelectionChange = (newSelection: any) => {
    setSelectedRows(newSelection);
  };

  useEffect(() => {
    store.loadTechCouncils(props.idMain);
    return () => {
      store.clearStore();
    };
  }, []);

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
      field: "tech_decision_date",
      headerName: translate("label:TechCouncilListView.tech_decision_date"),
      flex: 1,
      renderCell: (param) => (<div>
        {param.row.tech_decision_date ? dayjs(param.row.tech_decision_date).format("DD.MM.YYYY") : ""}
      </div>),
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

  const actions: GridColDef[] = [{
    field: "actions",
    type: "actions",
    headerName: translate("actions"),
    width: 150,
    cellClassName: "actions",
    getActions: (params) => {
      let buttons = [];
      buttons.push(
        <GridActionsCellItem
          icon={<Tooltip title={translate("delete")}><DeleteIcon /></Tooltip>}
          label="Delete"
          data-testid={`TechCouncilDeleteButton`}
          onClick={() => store.deleteTechCouncil(params.id as number, props.idMain)}
          color="inherit"
        />
      );
      return buttons;
    }
  }];

  const grid = actions.concat(columns);

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

        <CustomButton
          variant='contained'
          sx={{ mb: 1 }}
          id={`TechCouncilAddButton`}
          onClick={() => store.onEditClicked(0)}
          endIcon={<AddIcon />}
        >
          {translate('add')}
        </CustomButton>

        <DataGrid
          rows={store.data}
          columns={grid}
          checkboxSelection
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleRowSelectionChange}
          slotProps={{
            pagination: {
              labelRowsPerPage: translate("rowsPerPage")
            }
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          pageSizeOptions={[10, 25, 100]}
          data-testid={`TechCouncilTable`}
        />
      </Paper>

      <AddPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idMain={props.idMain}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadTechCouncils(props.idMain);
        }}
      />

    </Container>
  );
});


export default TechCouncilListView;
