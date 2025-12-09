import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../legal_record_registryListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type legal_record_registryProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<legal_record_registryProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadlegal_record_registries();
    }
  }, [props.idMain]);

  const columns = [
    {
                    field: 'is_active',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.is_active"),
                },
                {
                    field: 'defendant',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.defendant"),
                },
                {
                    field: 'id_statusNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.id_status"),
                },
                {
                    field: 'subject',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.subject"),
                },
                {
                    field: 'complainant',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.complainant"),
                },
                {
                    field: 'decision',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.decision"),
                },
                {
                    field: 'addition',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.addition"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:legal_record_registryListView.updated_by"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="legal_record_registry_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:legal_record_registryAddEditView.entityTitle")}</h3>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={null} sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
            })}
            <Grid item xs={1}></Grid>
          </Grid>
          <Divider />

          {storeList.data.map((entity) => {
            const style = { backgroundColor: entity.id === store.id && "#F0F0F0" };
            return (
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={style}
                  spacing={1}
                  id="id_EmployeeContact_row"
                >
                  {columns.map((col) => {
                    const id = "id_EmployeeContact_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid item xs={col.width} id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <>
                        <IconButton
                          id="id_EmployeeContactEditButton"
                          name="edit_button"
                          style={{ margin: 0, marginRight: 5, padding: 0 }}
                          onClick={() => {
                            storeList.setFastInputIsEdit(true);
                            store.doLoad(entity.id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          id="id_EmployeeContactDeleteButton"
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deletelegal_record_registry(entity.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Divider />
              </>
            );
          })}

          {storeList.isEdit ? (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_active}
                      onChange={(event) => store.handleChange(event)}
                      name="is_active"
                      label={translate('label:legal_record_registryAddEditView.is_active')}
                      id='id_f_legal_record_registry_is_active'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.defendant}
                      onChange={(event) => store.handleChange(event)}
                      name="defendant"
                      data-testid="id_f_legal_record_registry_defendant"
                      id='id_f_legal_record_registry_defendant'
                      label={translate('label:legal_record_registryAddEditView.defendant')}
                      helperText={store.errors.defendant}
                      error={!!store.errors.defendant}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.id_status}
                      onChange={(event) => store.handleChange(event)}
                      name="id_status"
                      data={store.legal_registry_statuses}
                      id='id_f_legal_record_registry_id_status'
                      label={translate('label:legal_record_registryAddEditView.id_status')}
                      helperText={store.errors.id_status}
                      error={!!store.errors.id_status}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.subject}
                      onChange={(event) => store.handleChange(event)}
                      name="subject"
                      data-testid="id_f_legal_record_registry_subject"
                      id='id_f_legal_record_registry_subject'
                      label={translate('label:legal_record_registryAddEditView.subject')}
                      helperText={store.errors.subject}
                      error={!!store.errors.subject}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.complainant}
                      onChange={(event) => store.handleChange(event)}
                      name="complainant"
                      data-testid="id_f_legal_record_registry_complainant"
                      id='id_f_legal_record_registry_complainant'
                      label={translate('label:legal_record_registryAddEditView.complainant')}
                      helperText={store.errors.complainant}
                      error={!!store.errors.complainant}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.decision}
                      onChange={(event) => store.handleChange(event)}
                      name="decision"
                      data-testid="id_f_legal_record_registry_decision"
                      id='id_f_legal_record_registry_decision'
                      label={translate('label:legal_record_registryAddEditView.decision')}
                      helperText={store.errors.decision}
                      error={!!store.errors.decision}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.addition}
                      onChange={(event) => store.handleChange(event)}
                      name="addition"
                      data-testid="id_f_legal_record_registry_addition"
                      id='id_f_legal_record_registry_addition'
                      label={translate('label:legal_record_registryAddEditView.addition')}
                      helperText={store.errors.addition}
                      error={!!store.errors.addition}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_legal_record_registry_created_at'
                      label={translate('label:legal_record_registryAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_legal_record_registry_updated_at'
                      label={translate('label:legal_record_registryAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_legal_record_registry_created_by"
                      id='id_f_legal_record_registry_created_by'
                      label={translate('label:legal_record_registryAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_legal_record_registry_updated_by"
                      id='id_f_legal_record_registry_updated_by'
                      label={translate('label:legal_record_registryAddEditView.updated_by')}
                      helperText={store.errors.updated_by}
                      error={!!store.errors.updated_by}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_legal_record_registrySaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadlegal_record_registries();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_legal_record_registryCancelButton"
                  onClick={() => {
                    storeList.setFastInputIsEdit(false);
                    store.clearStore();
                  }}
                >
                  {translate("common:cancel")}
                </CustomButton>
              </Grid>
            </Grid>
          ) : (
            <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_legal_record_registryAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  // store.project_id = props.idMain;
                }}
              >
                {translate("common:add")}
              </CustomButton>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
});

export default FastInputView;
