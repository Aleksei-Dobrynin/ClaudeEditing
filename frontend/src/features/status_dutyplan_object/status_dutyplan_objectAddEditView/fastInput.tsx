import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../status_dutyplan_objectListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type status_dutyplan_objectProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<status_dutyplan_objectProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadstatus_dutyplan_objects();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'updated_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.updated_by"),
    },
    {
      field: 'name',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.name"),
    },
    {
      field: 'description',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.description"),
    },
    {
      field: 'code',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.code"),
    },
    {
      field: 'name_kg',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.name_kg"),
    },
    {
      field: 'description_kg',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.description_kg"),
    },
    {
      field: 'text_color',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.text_color"),
    },
    {
      field: 'background_color',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.background_color"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:status_dutyplan_objectListView.created_at"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="status_dutyplan_object_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:status_dutyplan_objectAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletestatus_dutyplan_object(entity.id)}
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
                <DateTimeField
                  value={store.updated_at}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_at"
                  id='id_f_status_dutyplan_object_updated_at'
                  label={translate('label:status_dutyplan_objectAddEditView.updated_at')}
                  helperText={store.errors.updated_at}
                  error={!!store.errors.updated_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.created_by}
                  onChange={(event) => store.handleChange(event)}
                  name="created_by"
                  data-testid="id_f_status_dutyplan_object_created_by"
                  id='id_f_status_dutyplan_object_created_by'
                  label={translate('label:status_dutyplan_objectAddEditView.created_by')}
                  helperText={store.errors.created_by}
                  error={!!store.errors.created_by}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.updated_by}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_by"
                  data-testid="id_f_status_dutyplan_object_updated_by"
                  id='id_f_status_dutyplan_object_updated_by'
                  label={translate('label:status_dutyplan_objectAddEditView.updated_by')}
                  helperText={store.errors.updated_by}
                  error={!!store.errors.updated_by}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.name}
                  onChange={(event) => store.handleChange(event)}
                  name="name"
                  data-testid="id_f_status_dutyplan_object_name"
                  id='id_f_status_dutyplan_object_name'
                  label={translate('label:status_dutyplan_objectAddEditView.name')}
                  helperText={store.errors.name}
                  error={!!store.errors.name}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description}
                  onChange={(event) => store.handleChange(event)}
                  name="description"
                  data-testid="id_f_status_dutyplan_object_description"
                  id='id_f_status_dutyplan_object_description'
                  label={translate('label:status_dutyplan_objectAddEditView.description')}
                  helperText={store.errors.description}
                  error={!!store.errors.description}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.code}
                  onChange={(event) => store.handleChange(event)}
                  name="code"
                  data-testid="id_f_status_dutyplan_object_code"
                  id='id_f_status_dutyplan_object_code'
                  label={translate('label:status_dutyplan_objectAddEditView.code')}
                  helperText={store.errors.code}
                  error={!!store.errors.code}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.name_kg}
                  onChange={(event) => store.handleChange(event)}
                  name="name_kg"
                  data-testid="id_f_status_dutyplan_object_name_kg"
                  id='id_f_status_dutyplan_object_name_kg'
                  label={translate('label:status_dutyplan_objectAddEditView.name_kg')}
                  helperText={store.errors.name_kg}
                  error={!!store.errors.name_kg}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description_kg}
                  onChange={(event) => store.handleChange(event)}
                  name="description_kg"
                  data-testid="id_f_status_dutyplan_object_description_kg"
                  id='id_f_status_dutyplan_object_description_kg'
                  label={translate('label:status_dutyplan_objectAddEditView.description_kg')}
                  helperText={store.errors.description_kg}
                  error={!!store.errors.description_kg}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.text_color}
                  onChange={(event) => store.handleChange(event)}
                  name="text_color"
                  data-testid="id_f_status_dutyplan_object_text_color"
                  id='id_f_status_dutyplan_object_text_color'
                  label={translate('label:status_dutyplan_objectAddEditView.text_color')}
                  helperText={store.errors.text_color}
                  error={!!store.errors.text_color}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.background_color}
                  onChange={(event) => store.handleChange(event)}
                  name="background_color"
                  data-testid="id_f_status_dutyplan_object_background_color"
                  id='id_f_status_dutyplan_object_background_color'
                  label={translate('label:status_dutyplan_objectAddEditView.background_color')}
                  helperText={store.errors.background_color}
                  error={!!store.errors.background_color}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.created_at}
                  onChange={(event) => store.handleChange(event)}
                  name="created_at"
                  id='id_f_status_dutyplan_object_created_at'
                  label={translate('label:status_dutyplan_objectAddEditView.created_at')}
                  helperText={store.errors.created_at}
                  error={!!store.errors.created_at}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_status_dutyplan_objectSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadstatus_dutyplan_objects();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_status_dutyplan_objectCancelButton"
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
                id="id_status_dutyplan_objectAddButton"
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
