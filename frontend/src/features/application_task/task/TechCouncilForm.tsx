import React, { FC, useEffect, useState } from "react";
import {
  DialogContent,
  Dialog,
  Box,
  DialogTitle
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { observer } from "mobx-react";
import store from "../../TechCouncil/TechCouncilAddEditView/store";
import storeTask from "./store";
import { useTranslation } from "react-i18next";
import CustomTextField from "components/TextField";
import CustomButton from "../../../components/Button";

type TechCouncilFormProps = {
  openPanel: boolean;
  idApplication: number;
  idService: number;
  onSaveClick: (id: number) => void;
}

const TechCouncilForm: FC<TechCouncilFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (props.openPanel) {
      if (store.application_id !== props.idApplication) {
        store.application_id = props.idApplication;
      }
      if (store.service_id !== props.idService) {
        store.service_id = props.idService;
      }
      store.loadUserOrgStructure();
      store.loadorg_structures();
      store.loadTechCouncilParticipantsSettings();
    } else {
      store.clearStore();
    }
  }, [props.openPanel]);

  useEffect(() => {
    setSelectedRows(store.participants.map(p => p.structure_id));
  }, [store.participants]);

  const filteredRows = store.org_structures.filter((row) =>
    row.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) || selectedRows.includes(row.id)
  ).sort((a, b) => {
    const aSelected = selectedRows.includes(a.id);
    const bSelected = selectedRows.includes(b.id);
    if (aSelected === bSelected) {
      return 0;
    }
    return aSelected ? -1 : 1;
  });

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
      field: "name",
      headerName: `${translate("label:TechCouncilParticipantsSettingsListView.structure_name")}`,
      editable: true,
      width: 450
    }
  ];

  return (
    <Dialog open={props.openPanel} maxWidth={"lg"}
    >
      <DialogTitle>{translate("label:TechCouncilParticipantsSettingsListView.sendToTechCouncil")}</DialogTitle>
      <DialogContent>
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
        />
        <Box display="flex" justifyContent="flex-end">
          <CustomButton
            customColor={"#718fb8"}
            size="small"
            variant="contained"
            sx={{ mb: 1, mr: 1 }}
            onClick={() => {
              store.selectedParticipants = [...selectedRows];
              props.onSaveClick(0);
            }}
          >
            {translate("label:TechCouncilParticipantsSettingsListView.sendTo")}
          </CustomButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
    ;
});

export default TechCouncilForm;
