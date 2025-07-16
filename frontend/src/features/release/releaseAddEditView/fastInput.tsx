import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../releaseListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type releaseProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<releaseProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadreleases();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'updated_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.updated_by"),
    },
    {
      field: 'number',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.number"),
    },
    {
      field: 'description',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.description"),
    },
    {
      field: 'description_kg',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.description_kg"),
    },
    {
      field: 'code',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.code"),
    },
    {
      field: 'date_start',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.date_start"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:releaseListView.created_by"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="release_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:releaseAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleterelease(entity.id)}
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
                  data-testid="id_f_release_updated_by"
                  id='id_f_release_updated_by'
                  label={translate('label:releaseAddEditView.updated_by')}
                  helperText={store.errors.updated_by}
                  error={!!store.errors.updated_by}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.number}
                  onChange={(event) => store.handleChange(event)}
                  name="number"
                  data-testid="id_f_release_number"
                  id='id_f_release_number'
                  label={translate('label:releaseAddEditView.number')}
                  helperText={store.errors.number}
                  error={!!store.errors.number}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description}
                  onChange={(event) => store.handleChange(event)}
                  name="description"
                  data-testid="id_f_release_description"
                  id='id_f_release_description'
                  label={translate('label:releaseAddEditView.description')}
                  helperText={store.errors.description}
                  error={!!store.errors.description}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.description_kg}
                  onChange={(event) => store.handleChange(event)}
                  name="description_kg"
                  data-testid="id_f_release_description_kg"
                  id='id_f_release_description_kg'
                  label={translate('label:releaseAddEditView.description_kg')}
                  helperText={store.errors.description_kg}
                  error={!!store.errors.description_kg}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.code}
                  onChange={(event) => store.handleChange(event)}
                  name="code"
                  data-testid="id_f_release_code"
                  id='id_f_release_code'
                  label={translate('label:releaseAddEditView.code')}
                  helperText={store.errors.code}
                  error={!!store.errors.code}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.date_start}
                  onChange={(event) => store.handleChange(event)}
                  name="date_start"
                  id='id_f_release_date_start'
                  label={translate('label:releaseAddEditView.date_start')}
                  helperText={store.errors.date_start}
                  error={!!store.errors.date_start}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.created_at}
                  onChange={(event) => store.handleChange(event)}
                  name="created_at"
                  id='id_f_release_created_at'
                  label={translate('label:releaseAddEditView.created_at')}
                  helperText={store.errors.created_at}
                  error={!!store.errors.created_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.updated_at}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_at"
                  id='id_f_release_updated_at'
                  label={translate('label:releaseAddEditView.updated_at')}
                  helperText={store.errors.updated_at}
                  error={!!store.errors.updated_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.created_by}
                  onChange={(event) => store.handleChange(event)}
                  name="created_by"
                  data-testid="id_f_release_created_by"
                  id='id_f_release_created_by'
                  label={translate('label:releaseAddEditView.created_by')}
                  helperText={store.errors.created_by}
                  error={!!store.errors.created_by}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_releaseSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadreleases();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_releaseCancelButton"
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
                id="id_releaseAddButton"
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
