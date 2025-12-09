import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../path_stepListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type path_stepProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<path_stepProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadpath_steps();
    }
  }, [props.idMain]);

  const columns = [
    {
                    field: 'step_type',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.step_type"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.updated_by"),
                },
                {
                    field: 'path_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.path_id"),
                },
                {
                    field: 'responsible_org_id',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.responsible_org_id"),
                },
                {
                    field: 'name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.name"),
                },
                {
                    field: 'description',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.description"),
                },
                {
                    field: 'order_number',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.order_number"),
                },
                {
                    field: 'is_required',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.is_required"),
                },
                {
                    field: 'estimated_days',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.estimated_days"),
                },
                {
                    field: 'wait_for_previous_steps',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:path_stepListView.wait_for_previous_steps"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="path_step_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:path_stepAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletepath_step(entity.id)}
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
                      value={store.step_type}
                      onChange={(event) => store.handleChange(event)}
                      name="step_type"
                      data-testid="id_f_path_step_step_type"
                      id='id_f_path_step_step_type'
                      label={translate('label:path_stepAddEditView.step_type')}
                      helperText={store.errors.step_type}
                      error={!!store.errors.step_type}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.responsible_org_id}
                      onChange={(event) => store.handleChange(event)}
                      name="responsible_org_id"
                      data-testid="id_f_path_step_responsible_org_id"
                      id='id_f_path_step_responsible_org_id'
                      label={translate('label:path_stepAddEditView.responsible_org_id')}
                      helperText={store.errors.responsible_org_id}
                      error={!!store.errors.responsible_org_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_path_step_name"
                      id='id_f_path_step_name'
                      label={translate('label:path_stepAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_path_step_description"
                      id='id_f_path_step_description'
                      label={translate('label:path_stepAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.order_number}
                      onChange={(event) => store.handleChange(event)}
                      name="order_number"
                      data-testid="id_f_path_step_order_number"
                      id='id_f_path_step_order_number'
                      label={translate('label:path_stepAddEditView.order_number')}
                      helperText={store.errors.order_number}
                      error={!!store.errors.order_number}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.is_required}
                      onChange={(event) => store.handleChange(event)}
                      name="is_required"
                      label={translate('label:path_stepAddEditView.is_required')}
                      id='id_f_path_step_is_required'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.estimated_days}
                      onChange={(event) => store.handleChange(event)}
                      name="estimated_days"
                      data-testid="id_f_path_step_estimated_days"
                      id='id_f_path_step_estimated_days'
                      label={translate('label:path_stepAddEditView.estimated_days')}
                      helperText={store.errors.estimated_days}
                      error={!!store.errors.estimated_days}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.wait_for_previous_steps}
                      onChange={(event) => store.handleChange(event)}
                      name="wait_for_previous_steps"
                      label={translate('label:path_stepAddEditView.wait_for_previous_steps')}
                      id='id_f_path_step_wait_for_previous_steps'
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_path_stepSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadpath_steps();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_path_stepCancelButton"
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
                id="id_path_stepAddButton"
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