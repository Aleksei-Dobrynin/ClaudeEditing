import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../notification_templateListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type notification_templateProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  idMain: number;
};

const FastInputView: FC<notification_templateProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idMain !== 0 && storeList.idMain !== props.idMain) {
      storeList.idMain = props.idMain;
      storeList.loadnotification_templates();
    }
  }, [props.idMain]);

  const columns = [
    {
      field: 'contact_type_idNavName',
      width: null, //or number from 1 to 12
      headerName: translate("label:notification_templateListView.contact_type_id"),
    },
    {
      field: 'code',
      width: null, //or number from 1 to 12
      headerName: translate("label:notification_templateListView.code"),
    },
    {
      field: 'subject',
      width: null, //or number from 1 to 12
      headerName: translate("label:notification_templateListView.subject"),
    },
    {
      field: 'body',
      width: null, //or number from 1 to 12
      headerName: translate("label:notification_templateListView.body"),
    },
    {
      field: 'placeholders',
      width: null, //or number from 1 to 12
      headerName: translate("label:notification_templateListView.placeholders"),
    },

  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="notification_template_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:notification_templateAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deletenotification_template(entity.id)}
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
                <LookUp
                  value={store.contact_type_id}
                  onChange={(event) => store.handleChange(event)}
                  name="contact_type_id"
                  data={store.contact_types}
                  id='id_f_notification_template_contact_type_id'
                  label={translate('label:notification_templateAddEditView.contact_type_id')}
                  helperText={store.errors.contact_type_id}
                  error={!!store.errors.contact_type_id}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.code}
                  onChange={(event) => store.handleChange(event)}
                  name="code"
                  data-testid="id_f_notification_template_code"
                  id='id_f_notification_template_code'
                  label={translate('label:notification_templateAddEditView.code')}
                  helperText={store.errors.code}
                  error={!!store.errors.code}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.subject}
                  onChange={(event) => store.handleChange(event)}
                  name="subject"
                  data-testid="id_f_notification_template_subject"
                  id='id_f_notification_template_subject'
                  label={translate('label:notification_templateAddEditView.subject')}
                  helperText={store.errors.subject}
                  error={!!store.errors.subject}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.body}
                  onChange={(event) => store.handleChange(event)}
                  name="body"
                  data-testid="id_f_notification_template_body"
                  id='id_f_notification_template_body'
                  label={translate('label:notification_templateAddEditView.body')}
                  helperText={store.errors.body}
                  error={!!store.errors.body}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.placeholders}
                  onChange={(event) => store.handleChange(event)}
                  name="placeholders"
                  data-testid="id_f_notification_template_placeholders"
                  id='id_f_notification_template_placeholders'
                  label={translate('label:notification_templateAddEditView.placeholders')}
                  helperText={store.errors.placeholders}
                  error={!!store.errors.placeholders}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_notification_templateSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadnotification_templates();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_notification_templateCancelButton"
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
                id="id_notification_templateAddButton"
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
