import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../archirecture_roadListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type archirecture_roadProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<archirecture_roadProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadarchirecture_roads();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'updated_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.updated_by"),
    },
    {
      field: 'rule_expression',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.rule_expression"),
    },
    {
      field: 'description',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.description"),
    },
    {
      field: 'validation_url',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.validation_url"),
    },
    {
      field: 'post_function_url',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.post_function_url"),
    },
    {
      field: 'is_active',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.is_active"),
    },
    {
      field: 'from_status_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.from_status_id"),
    },
    {
      field: 'to_status_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.to_status_id"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:archirecture_roadListView.created_at"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="archirecture_road_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:archirecture_roadAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletearchirecture_road(entity.id)}
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
                  id='id_f_archirecture_road_updated_at'
                  label={translate('label:archirecture_roadAddEditView.updated_at')}
                  helperText={store.errors.updated_at}
                  error={!!store.errors.updated_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.created_by}
                  onChange={(event) => store.handleChange(event)}
                  name="created_by"
                  data-testid="id_f_archirecture_road_created_by"
                  id='id_f_archirecture_road_created_by'
                  label={translate('label:archirecture_roadAddEditView.created_by')}
                  helperText={store.errors.created_by}
                  error={!!store.errors.created_by}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.updated_by}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_by"
                  data-testid="id_f_archirecture_road_updated_by"
                  id='id_f_archirecture_road_updated_by'
                  label={translate('label:archirecture_roadAddEditView.updated_by')}
                  helperText={store.errors.updated_by}
                  error={!!store.errors.updated_by}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.rule_expression}
                  onChange={(event) => store.handleChange(event)}
                  name="rule_expression"
                  data-testid="id_f_archirecture_road_rule_expression"
                  id='id_f_archirecture_road_rule_expression'
                  label={translate('label:archirecture_roadAddEditView.rule_expression')}
                  helperText={store.errors.rule_expression}
                  error={!!store.errors.rule_expression}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description}
                  onChange={(event) => store.handleChange(event)}
                  name="description"
                  data-testid="id_f_archirecture_road_description"
                  id='id_f_archirecture_road_description'
                  label={translate('label:archirecture_roadAddEditView.description')}
                  helperText={store.errors.description}
                  error={!!store.errors.description}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.validation_url}
                  onChange={(event) => store.handleChange(event)}
                  name="validation_url"
                  data-testid="id_f_archirecture_road_validation_url"
                  id='id_f_archirecture_road_validation_url'
                  label={translate('label:archirecture_roadAddEditView.validation_url')}
                  helperText={store.errors.validation_url}
                  error={!!store.errors.validation_url}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.post_function_url}
                  onChange={(event) => store.handleChange(event)}
                  name="post_function_url"
                  data-testid="id_f_archirecture_road_post_function_url"
                  id='id_f_archirecture_road_post_function_url'
                  label={translate('label:archirecture_roadAddEditView.post_function_url')}
                  helperText={store.errors.post_function_url}
                  error={!!store.errors.post_function_url}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomCheckbox
                  value={store.is_active}
                  onChange={(event) => store.handleChange(event)}
                  name="is_active"
                  label={translate('label:archirecture_roadAddEditView.is_active')}
                  id='id_f_archirecture_road_is_active'
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.from_status_id}
                  onChange={(event) => store.handleChange(event)}
                  name="from_status_id"
                  data={store.architecture_statuses}
                  id='id_f_archirecture_road_from_status_id'
                  label={translate('label:archirecture_roadAddEditView.from_status_id')}
                  helperText={store.errors.from_status_id}
                  error={!!store.errors.from_status_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.to_status_id}
                  onChange={(event) => store.handleChange(event)}
                  name="to_status_id"
                  data={store.architecture_statuses}
                  id='id_f_archirecture_road_to_status_id'
                  label={translate('label:archirecture_roadAddEditView.to_status_id')}
                  helperText={store.errors.to_status_id}
                  error={!!store.errors.to_status_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.created_at}
                  onChange={(event) => store.handleChange(event)}
                  name="created_at"
                  id='id_f_archirecture_road_created_at'
                  label={translate('label:archirecture_roadAddEditView.created_at')}
                  helperText={store.errors.created_at}
                  error={!!store.errors.created_at}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_archirecture_roadSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadarchirecture_roads();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_archirecture_roadCancelButton"
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
                id="id_archirecture_roadAddButton"
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
