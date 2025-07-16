import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../tech_decisionListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type tech_decisionProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<tech_decisionProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadtech_decisions();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'dutyplan_object_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:tech_decisionListView.dutyplan_object_id"),
    },
    {
      field: 'application_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:tech_decisionListView.application_id"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:tech_decisionListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:tech_decisionListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:tech_decisionListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:tech_decisionListView.updated_by"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="tech_decision_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:tech_decisionAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletetech_decision(entity.id)}
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
                <CustomTextField
                  value={store.name}
                  onChange={(event) => store.handleChange(event)}
                  name="name"
                  data-testid="id_f_tech_decision_name"
                  id='id_f_tech_decision_name'
                  label={translate('label:tech_decisionAddEditView.name')}
                  helperText={store.errors.name}
                  error={!!store.errors.name}
                />
              </Grid>

              {/* Поле code */}
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.code}
                  onChange={(event) => store.handleChange(event)}
                  name="code"
                  data-testid="id_f_tech_decision_code"
                  id='id_f_tech_decision_code'
                  label={translate('label:tech_decisionAddEditView.code')}
                  helperText={store.errors.code}
                  error={!!store.errors.code}
                />
              </Grid>

              {/* Поле description */}
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description}
                  onChange={(event) => store.handleChange(event)}
                  name="description"
                  data-testid="id_f_tech_decision_description"
                  id='id_f_tech_decision_description'
                  label={translate('label:tech_decisionAddEditView.description')}
                  helperText={store.errors.description}
                  error={!!store.errors.description}
                />
              </Grid>

              {/* Поле name_kg */}
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.name_kg}
                  onChange={(event) => store.handleChange(event)}
                  name="name_kg"
                  data-testid="id_f_tech_decision_name_kg"
                  id='id_f_tech_decision_name_kg'
                  label={translate('label:tech_decisionAddEditView.name_kg')}
                  helperText={store.errors.name_kg}
                  error={!!store.errors.name_kg}
                />
              </Grid>

              {/* Поле description_kg */}
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description_kg}
                  onChange={(event) => store.handleChange(event)}
                  name="description_kg"
                  data-testid="id_f_tech_decision_description_kg"
                  id='id_f_tech_decision_description_kg'
                  label={translate('label:tech_decisionAddEditView.description_kg')}
                  helperText={store.errors.description_kg}
                  error={!!store.errors.description_kg}
                />
              </Grid>

              {/* Поле text_color */}
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.text_color}
                  onChange={(event) => store.handleChange(event)}
                  name="text_color"
                  data-testid="id_f_tech_decision_text_color"
                  id='id_f_tech_decision_text_color'
                  label={translate('label:tech_decisionAddEditView.text_color')}
                  helperText={store.errors.text_color}
                  error={!!store.errors.text_color}
                />
              </Grid>

              {/* Поле background_color */}
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.background_color}
                  onChange={(event) => store.handleChange(event)}
                  name="background_color"
                  data-testid="id_f_tech_decision_background_color"
                  id='id_f_tech_decision_background_color'
                  label={translate('label:tech_decisionAddEditView.background_color')}
                  helperText={store.errors.background_color}
                  error={!!store.errors.background_color}
                />
              </Grid>

              {/* Поле created_at */}
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.created_at}
                  onChange={(event) => store.handleChange(event)}
                  name="created_at"
                  id='id_f_tech_decision_created_at'
                  label={translate('label:tech_decisionAddEditView.created_at')}
                  helperText={store.errors.created_at}
                  error={!!store.errors.created_at}
                />
              </Grid>

              {/* Поле updated_at */}
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.updated_at}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_at"
                  id='id_f_tech_decision_updated_at'
                  label={translate('label:tech_decisionAddEditView.updated_at')}
                  helperText={store.errors.updated_at}
                  error={!!store.errors.updated_at}
                />
              </Grid>

              {/* Поле created_by */}
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.created_by?.toString() || ""}
                  onChange={(event) => store.handleChange(event)}
                  name="created_by"
                  data-testid="id_f_tech_decision_created_by"
                  id='id_f_tech_decision_created_by'
                  label={translate('label:tech_decisionAddEditView.created_by')}
                  helperText={store.errors.created_by}
                  error={!!store.errors.created_by}
                />
              </Grid>

              {/* Поле updated_by */}
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.updated_by?.toString() || ""}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_by"
                  data-testid="id_f_tech_decision_updated_by"
                  id='id_f_tech_decision_updated_by'
                  label={translate('label:tech_decisionAddEditView.updated_by')}
                  helperText={store.errors.updated_by}
                  error={!!store.errors.updated_by}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_tech_decisionSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadtech_decisions();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_tech_decisionCancelButton"
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
                id="id_tech_decisionAddButton"
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
