import React, { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Button,
  makeStyles,
  FormControlLabel,
  Container
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import DateField from "../../../components/DateField";
import dayjs from "dayjs";
import CustomButton from "../../../components/Button";
import AutocompleteCustom from "../../../components/Autocomplete";
import { ArchiveObjectSelector } from "./ArchiveObjectSelector";
import { useNavigate } from "react-router-dom";
import MainStore from "../../../MainStore";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PopupFormAddFolder from "./popupFormAddFolder"

type ProjectsTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ProjectsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const isReadOnly = !MainStore.isArchive;

  return (
    <Container maxWidth="xl" style={{ marginTop: 20 }}>
      <Grid container>

        <PopupFormAddFolder
          openPanel={store.openAddFolder}
          onBtnCancelClick={() => {
            store.openAddFolder = false;
          }}
          onSaveClick={async (id) => {
            store.loadArchiveFolders().then(x => {
              store.openAddFolder = false;
              store.handleChange({
                target: { name: "archive_folder_id", value: id }
              });
            });
          }}
        />
        <form id="ArchiveLogForm" autoComplete="off">
          <Paper elevation={7}>
            <Card>
              <CardHeader title={
                <span id="ArchiveLog_TitleName">
                  {translate("label:ArchiveLogAddEditView.entityTitle")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  {store.id == 0 && <Grid item md={4} xs={4}>
                    <AutocompleteCustom
                      value={store.status_id ?? 0}
                      onChange={(e) => store.status_id = e.target.value}
                      name="status_id"
                      id="id_f_status_id"
                      label={translate("label:ArchiveLogListView.status_id")}
                      fieldNameDisplay={(e) => `${e.name}`}
                      data={store.ArchiveLogStatuses} />
                  </Grid>
                  }

                  {store.id > 0 && <Grid item md={11} xs={11}>
                    {store.id > 0 && store.ArchiveLogStatuses.map(x => {
                      return <CustomButton
                        disabled={store.status_id === x.id}
                        variant="contained"
                        sx={{ mr: 1, mb: 1 }}
                        onClick={() => {
                          if (isReadOnly) {
                            return;
                          }
                          store.changeStatus(x.id)
                        }}>
                        {x.name}
                      </CustomButton>;
                    })}
                  </Grid>
                  }
                  {store.parent_id ? <Grid item md={1} xs={1} justifyContent="flex-end">
                    <CustomButton
                      variant="contained"
                      sx={{ mr: 1, mb: 1 }}
                      onClick={() => {
                        navigate(`/user/ArchiveLog/addedit?id=${store.parent_id}`);
                        store.doLoad(Number(store.parent_id), true);
                      }}>
                      {translate("common:Load_group")}
                    </CustomButton>
                  </Grid> : <Grid item md={1} xs={1}></Grid>}
                  <Grid item md={10} xs={10}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Autocomplete
                        // disabled={store.is_application_read_only}
                        value={store.ArchiveFolders.find(arch => arch.id === store.archive_folder_id) || null}
                        // disabled={isReadOnly}
                        onChange={(event, newValue) => {
                          store.handleChange({
                            target: { name: "archive_folder_id", value: newValue ? newValue.id : "" }
                          });
                        }}
                        options={store.ArchiveFolders}
                        disabled={store.id > 0}
                        getOptionLabel={(field) => `${field.archive_folder_name + " (" + field.object_address + ")"}` || ""}
                        id="id_f_archive_folder_id"
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={translate("label:archive_folderAddEditView.entityTitle")}
                            // helperText={store.errors.dutyplan_object_id}
                            // error={store.errors.dutyplan_object_id != ""}
                            size={"small"}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={2}>
                    <CustomButton
                      variant="contained"
                      onClick={() => {
                        store.openAddFolder = true;
                      }}>
                      Добавить
                    </CustomButton>
                  </Grid>
                  {/* {(store.id == 0 || store.archiveObjects?.length > 0) && <Grid item md={12} xs={12}>
                    <ArchiveObjectSelector />
                  </Grid>} */}
                  {<Grid item md={6} xs={12}>
                    <CustomTextField
                      helperText={store.errordoc_number}
                      error={store.errordoc_number != ""}
                      id="id_f_ArchiveLog_doc_number"
                      label={translate("Номер документа")}
                      value={store.doc_number}
                      onChange={(event) => store.handleChange(event)}
                      name="doc_number"
                      disabled={true}
                    />
                  </Grid>}
                  {<Grid item md={6} xs={12}>
                    <CustomTextField
                      helperText={store.erroraddress}
                      error={store.erroraddress != ""}
                      id="id_f_ArchiveLog_address"
                      label={translate("label:ArchiveLogAddEditView.address")}
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      disabled={true}
                    />
                  </Grid>}
                  <Grid item md={6} xs={6}>
                    <DateField
                      value={store.date_take ? dayjs(store.date_take) : null}
                      onChange={(event) => {
                        store.handleChange(event);
                        store.deadline = dayjs(event.target.value).add(3, "week");
                      }}
                      name="date_take"
                      id="id_f_ArchiveLogAddEditView_date_take"
                      label={translate("label:ArchiveLogAddEditView.date_take")}
                      helperText={store.errordate_take}
                      error={!!store.errordate_take}
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <DateField
                      value={store.deadline ? dayjs(store.deadline) : null}
                      onChange={(event) => store.handleChange(event)}
                      name="deadline"
                      id="id_f_ArchiveLogAddEditView_deadline"
                      label={translate("label:ArchiveLogAddEditView.deadline")}
                      helperText={store.errordeadline}
                      error={!!store.errordeadline}
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <AutocompleteCustom
                      value={store.take_employee_id}
                      onChange={(event) => {
                        store.handleChange(event);
                      }}
                      name="take_employee_id"
                      data={store.take_employees}
                      fieldNameDisplay={(e) => `${e.employee_name} - ${e.post_name ?? ""} (${e.id})`}
                      id="id_f_ArchiveLogAddEditView_take_employee_id"
                      label={translate("label:ArchiveLogAddEditView.take_employee_id")}
                      helperText={store.errortake_employee_id}
                      error={!!store.errortake_employee_id}
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <LookUp
                      value={store.take_structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="take_structure_id"
                      data={store.org_structures}
                      id="id_f_ArchiveLogAddEditView_take_structure_id"
                      label={translate("label:ArchiveLogAddEditView.take_structure_id")}
                      helperText={store.errortake_structure_id}
                      error={!!store.errortake_structure_id}
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <AutocompleteCustom
                      value={store.return_employee_id}
                      onChange={(event) => store.handleChange(event)}
                      name="return_employee_id"
                      data={store.return_employees}
                      fieldNameDisplay={(e) => `${e.employee_name} - ${e.post_name ?? ""} (${e.id})`}
                      id="id_f_ArchiveLogAddEditView_return_employee_id"
                      label={translate("label:ArchiveLogAddEditView.return_employee_id")}
                      helperText={store.errorreturn_employee_id}
                      error={!!store.errorreturn_employee_id}
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <LookUp
                      value={store.return_structure_id}
                      onChange={(event) => store.handleChange(event)}
                      name="return_structure_id"
                      data={store.org_structures}
                      id="id_f_ArchiveLogAddEditView_return_structure_id"
                      label={translate("label:ArchiveLogAddEditView.return_structure_id")}
                      helperText={store.errorreturn_structure_id}
                      error={!!store.errorreturn_structure_id}
                      disabled={isReadOnly}
                    />
                  </Grid>

                  <Grid item md={6} xs={6}>
                    <DateField
                      value={store.date_return ? dayjs(store.date_return) : null}
                      onChange={(event) => store.handleChange(event)}
                      name="date_return"
                      id="id_f_ArchiveLogAddEditView_date_return"
                      label={translate("label:ArchiveLogAddEditView.date_return")}
                      helperText={store.errordate_return}
                      error={!!store.errordate_return}
                      disabled={isReadOnly}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Grid>
      {props.children}
    </Container>
  );
});


export default BaseView;
