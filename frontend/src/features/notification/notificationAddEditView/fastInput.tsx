import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../notificationListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type notificationProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<notificationProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadnotifications();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'title',
      width: null, //or number from 1 to 12
      headerName: translate("label:notificationListView.title"),
    },
    {
      field: 'text',
      width: null, //or number from 1 to 12
      headerName: translate("label:notificationListView.text"),
    },
    {
      field: 'employee_id',
      width: null, //or number from 1 to 12
      headerName: translate("label:notificationListView.employee_id"),
    },
    {
      field: 'user_id',
      width: null, //or number from 1 to 12
      headerName: translate("label:notificationListView.user_id"),
    },
    {
      field: 'has_read',
      width: null, //or number from 1 to 12
      headerName: translate("label:notificationListView.has_read"),
    },
    {
      field: 'created_at',
      width: null, //or number from 1 to 12
      headerName: translate("label:notificationListView.created_at"),
    },
    {
      field: 'code',
      width: null, //or number from 1 to 12
      headerName: translate("label:notificationListView.code"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="notification_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:notificationAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletenotification(entity.id)}
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
                  value={store.title}
                  onChange={(event) => store.handleChange(event)}
                  name="title"
                  data-testid="id_f_notification_title"
                  id='id_f_notification_title'
                  label={translate('label:notificationAddEditView.title')}
                  helperText={store.errors.title}
                  error={!!store.errors.title}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.text}
                  onChange={(event) => store.handleChange(event)}
                  name="text"
                  data-testid="id_f_notification_text"
                  id='id_f_notification_text'
                  label={translate('label:notificationAddEditView.text')}
                  helperText={store.errors.text}
                  error={!!store.errors.text}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.employee_id}
                  onChange={(event) => store.handleChange(event)}
                  name="employee_id"
                  data-testid="id_f_notification_employee_id"
                  id='id_f_notification_employee_id'
                  label={translate('label:notificationAddEditView.employee_id')}
                  helperText={store.errors.employee_id}
                  error={!!store.errors.employee_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.user_id}
                  onChange={(event) => store.handleChange(event)}
                  name="user_id"
                  data-testid="id_f_notification_user_id"
                  id='id_f_notification_user_id'
                  label={translate('label:notificationAddEditView.user_id')}
                  helperText={store.errors.user_id}
                  error={!!store.errors.user_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomCheckbox
                  value={store.has_read}
                  onChange={(event) => store.handleChange(event)}
                  name="has_read"
                  label={translate('label:notificationAddEditView.has_read')}
                  id='id_f_notification_has_read'
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <DateTimeField
                  value={store.created_at}
                  onChange={(event) => store.handleChange(event)}
                  name="created_at"
                  id='id_f_notification_created_at'
                  label={translate('label:notificationAddEditView.created_at')}
                  helperText={store.errors.created_at}
                  error={!!store.errors.created_at}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.code}
                  onChange={(event) => store.handleChange(event)}
                  name="code"
                  data-testid="id_f_notification_code"
                  id='id_f_notification_code'
                  label={translate('label:notificationAddEditView.code')}
                  helperText={store.errors.code}
                  error={!!store.errors.code}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_notificationSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadnotifications();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_notificationCancelButton"
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
                id="id_notificationAddButton"
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
