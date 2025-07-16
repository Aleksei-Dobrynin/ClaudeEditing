import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../structure_report_field_configListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type structure_report_field_configProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<structure_report_field_configProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadstructure_report_field_configs();
    }
  }, [props.idMain]);

  const columns = [
    {
                    field: 'structure_report_id',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:structure_report_field_configListView.structure_report_id"),
                },
                {
                    field: 'field_name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:structure_report_field_configListView.field_name"),
                },
                {
                    field: 'report_item',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:structure_report_field_configListView.report_item"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:structure_report_field_configListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:structure_report_field_configListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:structure_report_field_configListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:structure_report_field_configListView.updated_by"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="structure_report_field_config_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:structure_report_field_configAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletestructure_report_field_config(entity.id)}
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
                      value={store.structure_report_id}
                      onChange={(event) => store.handleChange(event)}
                      name="structure_report_id"
                      data-testid="id_f_structure_report_field_config_structure_report_id"
                      id='id_f_structure_report_field_config_structure_report_id'
                      label={translate('label:structure_report_field_configAddEditView.structure_report_id')}
                      helperText={store.errors.structure_report_id}
                      error={!!store.errors.structure_report_id}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.field_name}
                      onChange={(event) => store.handleChange(event)}
                      name="field_name"
                      data-testid="id_f_structure_report_field_config_field_name"
                      id='id_f_structure_report_field_config_field_name'
                      label={translate('label:structure_report_field_configAddEditView.field_name')}
                      helperText={store.errors.field_name}
                      error={!!store.errors.field_name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.report_item}
                      onChange={(event) => store.handleChange(event)}
                      name="report_item"
                      data-testid="id_f_structure_report_field_config_report_item"
                      id='id_f_structure_report_field_config_report_item'
                      label={translate('label:structure_report_field_configAddEditView.report_item')}
                      helperText={store.errors.report_item}
                      error={!!store.errors.report_item}
                    />
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.created_at}
                      onChange={(event) => store.handleChange(event)}
                      name="created_at"
                      id='id_f_structure_report_field_config_created_at'
                      label={translate('label:structure_report_field_configAddEditView.created_at')}
                      helperText={store.errors.created_at}
                      error={!!store.errors.created_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.updated_at}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_at"
                      id='id_f_structure_report_field_config_updated_at'
                      label={translate('label:structure_report_field_configAddEditView.updated_at')}
                      helperText={store.errors.updated_at}
                      error={!!store.errors.updated_at}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.created_by}
                      onChange={(event) => store.handleChange(event)}
                      name="created_by"
                      data-testid="id_f_structure_report_field_config_created_by"
                      id='id_f_structure_report_field_config_created_by'
                      label={translate('label:structure_report_field_configAddEditView.created_by')}
                      helperText={store.errors.created_by}
                      error={!!store.errors.created_by}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.updated_by}
                      onChange={(event) => store.handleChange(event)}
                      name="updated_by"
                      data-testid="id_f_structure_report_field_config_updated_by"
                      id='id_f_structure_report_field_config_updated_by'
                      label={translate('label:structure_report_field_configAddEditView.updated_by')}
                      helperText={store.errors.updated_by}
                      error={!!store.errors.updated_by}
                    />
                  </Grid> */}
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_structure_report_field_configSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadstructure_report_field_configs();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_structure_report_field_configCancelButton"
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
                id="id_structure_report_field_configAddButton"
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
