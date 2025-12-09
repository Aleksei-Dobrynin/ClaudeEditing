import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../task_typeListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type task_typeProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<task_typeProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadtask_types();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'name',
      width: null, //or number from 1 to 12
      headerName: translate("label:task_typeListView.name"),
    },
    {
      field: 'code',
      width: null, //or number from 1 to 12
      headerName: translate("label:task_typeListView.code"),
    },
    {
      field: 'description',
      width: null, //or number from 1 to 12
      headerName: translate("label:task_typeListView.description"),
    },
    {
      field: 'is_for_task',
      width: null, //or number from 1 to 12
      headerName: translate("label:task_typeListView.is_for_task"),
    },
    {
      field: 'is_for_subtask',
      width: null, //or number from 1 to 12
      headerName: translate("label:task_typeListView.is_for_subtask"),
    },
    {
      field: 'icon_color',
      width: null, //or number from 1 to 12
      headerName: translate("label:task_typeListView.icon_color"),
    },
    {
      field: 'svg_icon_id',
      width: null, //or number from 1 to 12
      headerName: translate("label:task_typeListView.svg_icon_id"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="task_type_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:task_typeAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletetask_type(entity.id)}
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
                  data-testid="id_f_task_type_name"
                  id='id_f_task_type_name'
                  label={translate('label:task_typeAddEditView.name')}
                  helperText={store.errors.name}
                  error={!!store.errors.name}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.code}
                  onChange={(event) => store.handleChange(event)}
                  name="code"
                  data-testid="id_f_task_type_code"
                  id='id_f_task_type_code'
                  label={translate('label:task_typeAddEditView.code')}
                  helperText={store.errors.code}
                  error={!!store.errors.code}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description}
                  onChange={(event) => store.handleChange(event)}
                  name="description"
                  data-testid="id_f_task_type_description"
                  id='id_f_task_type_description'
                  label={translate('label:task_typeAddEditView.description')}
                  helperText={store.errors.description}
                  error={!!store.errors.description}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomCheckbox
                  value={store.is_for_task}
                  onChange={(event) => store.handleChange(event)}
                  name="is_for_task"
                  label={translate('label:task_typeAddEditView.is_for_task')}
                  id='id_f_task_type_is_for_task'
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomCheckbox
                  value={store.is_for_subtask}
                  onChange={(event) => store.handleChange(event)}
                  name="is_for_subtask"
                  label={translate('label:task_typeAddEditView.is_for_subtask')}
                  id='id_f_task_type_is_for_subtask'
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.icon_color}
                  onChange={(event) => store.handleChange(event)}
                  name="icon_color"
                  data-testid="id_f_task_type_icon_color"
                  id='id_f_task_type_icon_color'
                  label={translate('label:task_typeAddEditView.icon_color')}
                  helperText={store.errors.icon_color}
                  error={!!store.errors.icon_color}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.svg_icon_id}
                  onChange={(event) => store.handleChange(event)}
                  name="svg_icon_id"
                  data-testid="id_f_task_type_svg_icon_id"
                  id='id_f_task_type_svg_icon_id'
                  label={translate('label:task_typeAddEditView.svg_icon_id')}
                  helperText={store.errors.svg_icon_id}
                  error={!!store.errors.svg_icon_id}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_task_typeSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadtask_types();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_task_typeCancelButton"
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
                id="id_task_typeAddButton"
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
