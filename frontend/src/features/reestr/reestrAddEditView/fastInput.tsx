import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../reestrListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type reestrProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<reestrProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadreestrs();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'name',
      width: null, //or number from 1 to 12
      headerName: translate("label:reestrListView.name"),
    },
    {
      field: 'month',
      width: null, //or number from 1 to 12
      headerName: translate("label:reestrListView.month"),
    },
    {
      field: 'year',
      width: null, //or number from 1 to 12
      headerName: translate("label:reestrListView.year"),
    },
    {
      field: 'status_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:reestrListView.status_id"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:reestrListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:reestrListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:reestrListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null, //or number from 1 to 12
      headerName: translate("label:reestrListView.updated_by"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="reestr_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:reestrAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletereestr(entity.id)}
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
                  data-testid="id_f_reestr_name"
                  id='id_f_reestr_name'
                  label={translate('label:reestrAddEditView.name')}
                  helperText={store.errors.name}
                  error={!!store.errors.name}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.month}
                  onChange={(event) => store.handleChange(event)}
                  name="month"
                  data-testid="id_f_reestr_month"
                  id='id_f_reestr_month'
                  label={translate('label:reestrAddEditView.month')}
                  helperText={store.errors.month}
                  error={!!store.errors.month}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.year}
                  onChange={(event) => store.handleChange(event)}
                  name="year"
                  data-testid="id_f_reestr_year"
                  id='id_f_reestr_year'
                  label={translate('label:reestrAddEditView.year')}
                  helperText={store.errors.year}
                  error={!!store.errors.year}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.status_id}
                  onChange={(event) => store.handleChange(event)}
                  name="status_id"
                  data={store.reestr_statuses}
                  id='id_f_reestr_status_id'
                  label={translate('label:reestrAddEditView.status_id')}
                  helperText={store.errors.status_id}
                  error={!!store.errors.status_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.created_at}
                  onChange={(event) => store.handleChange(event)}
                  name="created_at"
                  id='id_f_reestr_created_at'
                  label={translate('label:reestrAddEditView.created_at')}
                  helperText={store.errors.created_at}
                  error={!!store.errors.created_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.updated_at}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_at"
                  id='id_f_reestr_updated_at'
                  label={translate('label:reestrAddEditView.updated_at')}
                  helperText={store.errors.updated_at}
                  error={!!store.errors.updated_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.created_by}
                  onChange={(event) => store.handleChange(event)}
                  name="created_by"
                  data-testid="id_f_reestr_created_by"
                  id='id_f_reestr_created_by'
                  label={translate('label:reestrAddEditView.created_by')}
                  helperText={store.errors.created_by}
                  error={!!store.errors.created_by}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.updated_by}
                  onChange={(event) => store.handleChange(event)}
                  name="updated_by"
                  data-testid="id_f_reestr_updated_by"
                  id='id_f_reestr_updated_by'
                  label={translate('label:reestrAddEditView.updated_by')}
                  helperText={store.errors.updated_by}
                  error={!!store.errors.updated_by}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_reestrSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadreestrs();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_reestrCancelButton"
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
                id="id_reestrAddButton"
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
