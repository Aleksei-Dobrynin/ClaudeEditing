import React, { FC, useEffect, useState } from "react";
import store from "./store";
import { observer } from "mobx-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import CustomTextField from "../../../components/TextField";

type PopupFormProps = {
  openPanel: boolean;
  application_id: number;
  structure_id: number;
  onBtnCancelClick: () => void;
}

const Uploaded_application_documentPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await store.loadApplicationLegalRecord();
        setSelectedRows(store.selectedLegalRecords);
      } catch (error) {
        console.error('Failed to load legal records:', error);
      }
    };

    if (props.openPanel) {
      fetchData();
    }
  }, [props.openPanel]);

  const filteredRows = store.ApplicationLegalRecord.filter((row) =>
    row.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) || selectedRows.includes(row.id)
  );

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
      field: "id",
      headerName: `${translate("label:TechCouncilAddEditView.ApplicationLegalRecordName")}`,
      editable: true,
      width: 450
    }
  ];

  return (
    <Dialog open={props.openPanel} maxWidth="sm" fullWidth>
      <DialogTitle>{translate("label:TechCouncilAddEditView.ApplicationLegalRecordsName")}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <CustomTextField
              label={translate("label:TechCouncilParticipantsSettingsListView.searchByName")}
              id={"search"}
              name={"search"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            <DataGrid
              rows={filteredRows}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              rowSelectionModel={selectedRows}
              onRowSelectionModelChange={handleRowSelectionChange}
              sx={{ height: 400, width: "100%" }}
              hideFooter={true}
              getRowId={(row) => row.id}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_uploaded_application_documentSaveButton"
            name={"uploaded_application_documentAddEditView.save"}
            onClick={() => {
              store.selectedLegalRecords = [...selectedRows];
              store.saveLegalRecords();
              props.onBtnCancelClick();
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_uploaded_application_documentCancelButton"
            name={"uploaded_application_documentAddEditView.cancel"}
            onClick={() => {
              props.onBtnCancelClick();
            }}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
});

export default Uploaded_application_documentPopupForm;
