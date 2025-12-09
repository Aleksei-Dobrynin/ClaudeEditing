import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../contragent_interactionListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type contragent_interactionProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<contragent_interactionProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadcontragent_interactions();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'updated_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.updated_by"),
    },
    {
      field: 'application_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.application_id"),
    },
    {
      field: 'task_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.task_id"),
    },
    {
      field: 'contragent_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.contragent_id"),
    },
    {
      field: 'description',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.description"),
    },
    {
      field: 'progress',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.progress"),
    },
    {
      field: 'name',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.name"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:contragent_interactionListView.created_by"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="contragent_interaction_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:contragent_interactionAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletecontragent_interaction(entity.id)}
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
                  value={store.updated_by}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_by"
                  data-testid="id_f_contragent_interaction_updated_by"
                  id='id_f_contragent_interaction_updated_by'
                  label={translate('label:contragent_interactionAddEditView.updated_by')}
                  helperText={store.errors.updated_by}
                  error={!!store.errors.updated_by}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.task_id}
                  onChange={(event) => store.handleChange(event)}
                  name="task_id"
                  data={store.application_tasks}
                  id='id_f_contragent_interaction_task_id'
                  label={translate('label:contragent_interactionAddEditView.task_id')}
                  helperText={store.errors.task_id}
                  error={!!store.errors.task_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.contragent_id}
                  onChange={(event) => store.handleChange(event)}
                  name="contragent_id"
                  data={store.contragents}
                  id='id_f_contragent_interaction_contragent_id'
                  label={translate('label:contragent_interactionAddEditView.contragent_id')}
                  helperText={store.errors.contragent_id}
                  error={!!store.errors.contragent_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description}
                  onChange={(event) => store.handleChange(event)}
                  name="description"
                  data-testid="id_f_contragent_interaction_description"
                  id='id_f_contragent_interaction_description'
                  label={translate('label:contragent_interactionAddEditView.description')}
                  helperText={store.errors.description}
                  error={!!store.errors.description}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.progress}
                  onChange={(event) => store.handleChange(event)}
                  name="progress"
                  data-testid="id_f_contragent_interaction_progress"
                  id='id_f_contragent_interaction_progress'
                  label={translate('label:contragent_interactionAddEditView.progress')}
                  helperText={store.errors.progress}
                  error={!!store.errors.progress}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.name}
                  onChange={(event) => store.handleChange(event)}
                  name="name"
                  data-testid="id_f_contragent_interaction_name"
                  id='id_f_contragent_interaction_name'
                  label={translate('label:contragent_interactionAddEditView.name')}
                  helperText={store.errors.name}
                  error={!!store.errors.name}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.created_at}
                  onChange={(event) => store.handleChange(event)}
                  name="created_at"
                  id='id_f_contragent_interaction_created_at'
                  label={translate('label:contragent_interactionAddEditView.created_at')}
                  helperText={store.errors.created_at}
                  error={!!store.errors.created_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.updated_at}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_at"
                  id='id_f_contragent_interaction_updated_at'
                  label={translate('label:contragent_interactionAddEditView.updated_at')}
                  helperText={store.errors.updated_at}
                  error={!!store.errors.updated_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.created_by}
                  onChange={(event) => store.handleChange(event)}
                  name="created_by"
                  data-testid="id_f_contragent_interaction_created_by"
                  id='id_f_contragent_interaction_created_by'
                  label={translate('label:contragent_interactionAddEditView.created_by')}
                  helperText={store.errors.created_by}
                  error={!!store.errors.created_by}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_contragent_interactionSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadcontragent_interactions();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_contragent_interactionCancelButton"
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
                id="id_contragent_interactionAddButton"
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
