import React, { FC, useEffect } from "react";
import store from "./store";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import LookUp from "../../../components/LookUp";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import storeTask from "../../application_task/task/store";

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  idMain: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const PopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>([]);

  useEffect(() => {
    if (props.openPanel) {
      store.loadTechCouncilsList();
      store.loadTechCouncils(props.idMain);
      if (store.idMain !== props.idMain) {
        store.idMain = props.idMain
      }
      setSelectedRows([])
    } else {
      // store.clearStore()
    }
  }, [props.openPanel]);

  const handleRowSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectionSet = new Set(newSelection);
      const updatedSelection = prevSelectedRows.filter((id) => newSelectionSet.has(id));
      newSelection.forEach((id) => {
        if (!updatedSelection.includes(id)) {
          updatedSelection.push(id);
        }
      });
      return updatedSelection;
    });
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
  ];

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth={"lg"} fullWidth>
      <DialogTitle>{translate("label:TechCouncilAddEditView.entityTitle")}</DialogTitle>
      <DialogContent>
        <br />
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <DataGrid
              rows={store.TechCouncils}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              rowSelectionModel={selectedRows}
              onRowSelectionModelChange={handleRowSelectionChange}
              sx={{ height: 400, width: "100%" }}
              hideFooter={true}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_TechCouncilSaveButton"
            onClick={() => {
              store.selectedApplicationCase = [...selectedRows];
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_TechCouncilCancelButton"
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
});

export default PopupForm;
